import { useMemo, useState } from "react";
import { parseUSDate } from "../utils/dates.js";

const toggleIn = (list, value) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

function compare(key, a, b) {
  switch (key) {
    case "receivedDate":
    case "approvedDate":
      return (
        (parseUSDate(a[key])?.getTime() ?? 0) -
        (parseUSDate(b[key])?.getTime() ?? 0)
      );
    case "totalPrice":
    case "totalLineNo":
      return Number(a[key]) - Number(b[key]);
    default:
      return String(a[key] ?? "").localeCompare(String(b[key] ?? ""));
  }
}

export const STATUS_OPTIONS = ["approved", "pending", "deleted"];

export default function useQuoteFilters(baseQuotes) {
  const [statuses, setStatuses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerQuery, setCustomerQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modes, setModes] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: null, dir: "asc" });

  const customerOptions = useMemo(
    () => [...new Set(baseQuotes.map((q) => q.customerName))],
    [baseQuotes],
  );

  const visibleCustomerOptions = useMemo(() => {
    const q = customerQuery.trim().toLowerCase();
    return customerOptions.filter((name) => name.toLowerCase().includes(q));
  }, [customerOptions, customerQuery]);

  const results = useMemo(() => {
    const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59`) : null;
    const customerSet = customers.map((c) => c.toLowerCase());
    const query = search.trim().toLowerCase();

    const filtered = baseQuotes.filter((q) => {
      if (statuses.length && !statuses.includes(q.status.toLowerCase()))
        return false;
      if (
        customerSet.length &&
        !customerSet.includes(q.customerName.toLowerCase())
      )
        return false;
      if (modes.length && !modes.includes(q.mode.toLowerCase())) return false;
      if (
        query &&
        !Object.values(q).some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
        )
      )
        return false;
      if (start || end) {
        const received = parseUSDate(q.receivedDate);
        if (!received) return false;
        if (start && received < start) return false;
        if (end && received > end) return false;
      }
      return true;
    });

    if (!sort.key) return filtered;
    const sorted = [...filtered].sort((a, b) => compare(sort.key, a, b));
    return sort.dir === "desc" ? sorted.reverse() : sorted;
  }, [
    baseQuotes,
    statuses,
    customers,
    modes,
    startDate,
    endDate,
    search,
    sort,
  ]);

  const chips = [
    ...statuses.map((status) => ({
      key: `status-${status}`,
      label: `Status: ${status[0].toUpperCase()}${status.slice(1)}`,
      remove: () =>
        setStatuses((list) => list.filter((item) => item !== status)),
    })),
    ...customers.map((customer) => ({
      key: `customer-${customer}`,
      label: `Customer: ${customer}`,
      remove: () =>
        setCustomers((list) => list.filter((item) => item !== customer)),
    })),
    ...(startDate
      ? [
          {
            key: "start-date",
            label: `From: ${startDate}`,
            remove: () => setStartDate(""),
          },
        ]
      : []),
    ...(endDate
      ? [
          {
            key: "end-date",
            label: `To: ${endDate}`,
            remove: () => setEndDate(""),
          },
        ]
      : []),
    ...modes.map((mode) => ({
      key: `mode-${mode}`,
      label: `Mode: ${mode}`,
      remove: () => setModes((list) => list.filter((item) => item !== mode)),
    })),
    ...(search.trim()
      ? [
          {
            key: "search",
            label: `Search: ${search.trim()}`,
            remove: () => setSearch(""),
          },
        ]
      : []),
  ];

  const clearAll = () => {
    setStatuses([]);
    setCustomers([]);
    setCustomerQuery("");
    setStartDate("");
    setEndDate("");
    setModes([]);
    setSearch("");
  };

  return {
    results,
    chips,
    clearAll,
    search,
    setSearch,
    statuses,
    toggleStatus: (s) => setStatuses((list) => toggleIn(list, s)),
    selectAllStatuses: () => setStatuses(STATUS_OPTIONS),
    clearStatuses: () => setStatuses([]),
    customers,
    toggleCustomer: (name) => setCustomers((list) => toggleIn(list, name)),
    customerQuery,
    setCustomerQuery,
    visibleCustomerOptions,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    modes,
    toggleMode: (m) => setModes((list) => toggleIn(list, m.toLowerCase())),
    sort,
    toggleSort: (key) =>
      setSort((s) =>
        s.key === key
          ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
          : { key, dir: "asc" },
      ),
  };
}
