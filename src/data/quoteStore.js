import { useSyncExternalStore } from "react";
import { initialQuotes } from "./quotes.js";

const STORAGE_KEY = "revalgo.quotes.v1";
const listeners = new Set();
let quotesSnapshot;

function cloneQuotes(quotes) {
  return JSON.parse(JSON.stringify(quotes));
}

function readLegacyIds(key) {
  try {
    const value = JSON.parse(sessionStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function setLegacyStatuses(quotes, key, status) {
  const ids = readLegacyIds(key);
  return quotes.map((quote) =>
    ids.includes(quote.quoteId) ? { ...quote, status } : quote,
  );
}

function createQuoteRecord(quoteId) {
  const today = new Date();
  const receivedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  const defaultCompany = "Astral India Pvt. Limited";
  const defaultAddress = "605 Knollwood Street, Brick,  NJ 08724";

  return {
    quoteId,
    customerName: sessionStorage.getItem("username") || "New Customer",
    contactNumber: "881-380-2766",
    receivedDate,
    approvedDate: "--",
    status: "Pending",
    totalLineNo: 0,
    totalPrice: 0,
    mode: "call",
    quote_details: {
      bill_To: { company_name: defaultCompany, address: defaultAddress },
      ship_to: { company_name: defaultCompany, address: defaultAddress },
      po_no: "-",
      job_no: "-",
      buyer: "-",
      delivery_date: "-",
      products: [],
    },
  };
}

function persist(quotes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch {
  }
}

function loadQuotes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
  }

  let quotes = cloneQuotes(initialQuotes);
  quotes = setLegacyStatuses(quotes, "pendingQuotes", "Pending");
  quotes = setLegacyStatuses(quotes, "approvedQuotes", "Approved");

  try {
    const added = JSON.parse(sessionStorage.getItem("newQuotes") || "[]");
    if (Array.isArray(added)) {
      for (const quote of added) {
        if (
          quote?.quoteId &&
          !quotes.some((item) => item.quoteId === quote.quoteId)
        ) {
          quotes.push(quote);
        }
      }
    }
    const pendingNewQuote = sessionStorage.getItem("newQuote");
    if (
      pendingNewQuote &&
      !quotes.some((item) => item.quoteId === pendingNewQuote)
    ) {
      quotes.push(createQuoteRecord(pendingNewQuote));
    }
  } catch {
  }

  quotes = setLegacyStatuses(quotes, "deletedQuotes", "Deleted");
  persist(quotes);

  try {
    [
      "pendingQuotes",
      "approvedQuotes",
      "newQuotes",
      "deletedQuotes",
      "newQuote",
    ].forEach((key) => sessionStorage.removeItem(key));
  } catch {
  }

  return quotes;
}

function getSnapshot() {
  quotesSnapshot ??= loadQuotes();
  return quotesSnapshot;
}

function notify() {
  listeners.forEach((listener) => listener());
}

function handleStorage(event) {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    if (Array.isArray(parsed)) quotesSnapshot = parsed;
    else quotesSnapshot = cloneQuotes(initialQuotes);
    notify();
  } catch {
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", handleStorage);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useQuotes() {
  return useSyncExternalStore(subscribe, getSnapshot, () => initialQuotes);
}

export function getQuote(quoteId) {
  return getSnapshot().find((quote) => quote.quoteId === quoteId) ?? null;
}

export function addQuote(quoteId) {
  const current = getSnapshot();
  if (current.some((quote) => quote.quoteId === quoteId)) return false;
  quotesSnapshot = [...current, createQuoteRecord(quoteId)];
  persist(quotesSnapshot);
  notify();
  return true;
}

export function removeQuote(quoteId) {
  const current = getSnapshot();
  const remaining = current.filter((quote) => quote.quoteId !== quoteId);
  if (remaining.length === current.length) return false;
  quotesSnapshot = remaining;
  persist(quotesSnapshot);
  notify();
  return true;
}

export function updateQuoteStatus(quoteId, status) {
  const current = getSnapshot();
  if (!current.some((quote) => quote.quoteId === quoteId)) return false;
  quotesSnapshot = current.map((quote) =>
    quote.quoteId === quoteId ? { ...quote, status } : quote,
  );
  persist(quotesSnapshot);
  notify();
  return true;
}

export function saveApprovedQuote(quote) {
  if (!quote?.quoteId) return false;
  const current = getSnapshot();
  const exists = current.some((item) => item.quoteId === quote.quoteId);
  quotesSnapshot = exists
    ? current.map((item) =>
        item.quoteId === quote.quoteId ? { ...item, ...quote } : item,
      )
    : [...current, quote];
  persist(quotesSnapshot);
  notify();
  return true;
}

export function addQuoteProducts(quoteId, products) {
  const current = getSnapshot();
  const quote = current.find((item) => item.quoteId === quoteId);
  if (!quote || !Array.isArray(products)) return false;

  const mergedProducts = [
    ...(quote.quote_details.products || []),
    ...products.map((product) => ({ ...product })),
  ];

  quotesSnapshot = current.map((item) =>
    item.quoteId === quoteId
      ? {
          ...item,
          totalLineNo: mergedProducts.length,
          totalPrice: mergedProducts.reduce(
            (total, product) => total + Number(product.total_cost || 0),
            0,
          ),
          quote_details: { ...item.quote_details, products: mergedProducts },
        }
      : item,
  );
  persist(quotesSnapshot);
  notify();
  return true;
}
