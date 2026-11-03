import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { money, vw } from "../../utils/helpers";

const COLUMNS = [
  ["quoteId", "Quote Id"],
  ["customerName", "Customer Name / Number"],
  ["receivedDate", "Received Date"],
  ["approvedDate", "Approved Date"],
  ["status", "Status"],
  ["totalLineNo", "Total Line No"],
  ["totalPrice", "Total Price"],
];

const TABS = ["pending", "approved", "deleted", "all"];

export default function RecentQuotes({
  quotes,
  onUndo,
  onExpand,
  onExport,
  embedded = false,
  activeTab = "all",
  onTabChange = () => {},
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: null, dir: "asc" });

  const headerRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const setHeight = () => {
      const element = tableRef.current;
      if (!element) return;
      const top = element.getBoundingClientRect().top;
      element.style.height = `${window.innerHeight - top - vw(2.7)}px`;
    };

    const observer = new ResizeObserver(setHeight);
    if (headerRef.current) observer.observe(headerRef.current);
    setHeight();
    window.addEventListener("resize", setHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", setHeight);
    };
  }, []);

  const matchedQuotes = useMemo(() => {
    const s = search.trim().toLowerCase();
    return quotes.filter(
      (q) =>
        !s ||
        q.quoteId.toLowerCase().includes(s) ||
        q.customerName.toLowerCase().includes(s) ||
        String(q.customerNumber).includes(s),
    );
  }, [quotes, search]);

  const counts = useMemo(() => {
    const c = { all: matchedQuotes.length };
    TABS.slice(0, 3).forEach(
      (t) =>
        (c[t] = matchedQuotes.filter(
          (q) => q.status.toLowerCase() === t,
        ).length),
    );
    return c;
  }, [matchedQuotes]);

  const rows = useMemo(() => {
    let list = matchedQuotes.filter(
      (q) => activeTab === "all" || q.status.toLowerCase() === activeTab,
    );
    if (sort.key) {
      const m = sort.dir === "asc" ? 1 : -1;
      list = [...list].sort((a, b) => {
        const x = a[sort.key],
          y = b[sort.key];
        return (
          (typeof x === "number" ? x - y : String(x).localeCompare(String(y))) *
          m
        );
      });
    }
    return list;
  }, [matchedQuotes, activeTab, sort]);

  const toggleSort = (key) =>
    setSort((p) => ({
      key,
      dir: p.key === key && p.dir === "asc" ? "desc" : "asc",
    }));

  const modeIcons = {
    call: "../src/assets/images/Dashboard/Call_icon.svg",
    email: "../src/assets/images/Dashboard/Email_icon.svg",
    ERP: "../src/assets/images/Dashboard/ERP_icon.svg",
  };

  return (
    <div className="recent-quotes">
      <div className="tabs-filters flex-between" ref={headerRef}>
        <ul className="tabs flexbox">
          {TABS.map((t) => (
            <li
              key={t}
              className={`tab-item ${activeTab === t ? "active" : ""}`}
              onClick={() => onTabChange(t)}
            >
              {t[0].toUpperCase() + t.slice(1)}{" "}
              <span className="quotes-count">{counts[t]}</span>
            </li>
          ))}
        </ul>

        <div className="filters flexbox">
          <div className="search-filter flexbox">
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <img
              src="./src/assets/images/Dashboard/Search icon.svg"
              alt=""
              className="search-icon-small"
            />
          </div>
          <button className="other-filter flexbox">
            <img
              src="./src/assets/images/Dashboard/Filter_Icon.svg"
              alt=""
              className="filter-icon"
            />
            Filter
          </button>
          <button className="show-modal-btn" onClick={() => onExport(rows)}>
            <img
              src="./src/assets/images/Dashboard/Export_icon.svg"
              alt="Export"
            />
          </button>
          {!embedded && (
            <button
              className="fullscr-btn"
              onClick={() => onExpand("recent-quotes")}
            >
              <img
                src="./src/assets/images/Dashboard/Expand_icon.svg"
                alt="Expand"
              />
            </button>
          )}
        </div>
      </div>

      <div className="table-container" ref={tableRef}>
        <table className="quotes-table" cellSpacing="2">
          <thead>
            <tr>
              {COLUMNS.map(([key, label]) => (
                <th key={key}>
                  <div onClick={() => toggleSort(key)}>
                    <span>{label}</span>
                    <img
                      src="./src/assets/images/Dashboard/Sort_icon.png"
                      alt=""
                      className="sort"
                    />
                  </div>
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((q) => (
              <tr
                key={q.quoteId}
                className={
                  q.status.toLowerCase() === "deleted" ? "deleted" : ""
                }
              >
                <td>
                  <div className="id-cell">
                    <img src={modeIcons[q.mode]} alt="" />
                    <Link
                      className="quote-id"
                      to="/viewquote"
                      onClick={() => {
                        sessionStorage.setItem("selectedId", q.quoteId);
                        sessionStorage.setItem("status", q.status);
                      }}
                    >
                      {q.quoteId}
                    </Link>
                  </div>
                </td>
                <td>
                  {q.customerName} /
                  <br />
                  <span className="cid">{q.contactNumber}</span>
                </td>
                <td>{q.receivedDate}</td>
                <td>
                  {q.status.toLowerCase() === "pending" ? "--" : q.approvedDate}
                </td>
                <td className={`status ${q.status.toLowerCase()}`}>
                  {q.status}
                </td>
                <td>{q.totalLineNo}</td>
                <td>{money(q.totalPrice)}</td>
                <td>
                  {q.status.toLowerCase() === "deleted" ? (
                    <button
                      className="undo-btn"
                      title="Undo delete"
                      onClick={() => onUndo(q.quoteId)}
                    >
                      Undo
                    </button>
                  ) : (
                    <button
                      className="plus"
                      type="button"
                      title={`Open ${q.quoteId} in quote editor`}
                      aria-label={`Open ${q.quoteId} in quote editor`}
                      onClick={() => {
                        sessionStorage.setItem("selectedId", q.quoteId);
                        sessionStorage.setItem("status", "new");
                        sessionStorage.removeItem("selectedLines");
                        sessionStorage.removeItem("newQuote");
                        navigate("/newquote");
                      }}
                    >
                      <img
                        src="../src/assets/images/Dashboard/Add_icon.svg"
                        alt=""
                      />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>
                  No quotes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
