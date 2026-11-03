import { initialQuotes } from "../data/quotes.js";
import { getAllQuotes } from "../data/allQuotes.js";
import {
  getQuote,
  saveApprovedQuote,
  updateQuoteStatus,
} from "../data/quoteStore.js";

const read = (key, fallback) => {
  try {
    return JSON.parse(sessionStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) =>
  sessionStorage.setItem(key, JSON.stringify(value));

export function generateNewQuoteId() {
  const used = [...initialQuotes, ...getAllQuotes()].map((q) => q.quoteId);
  let id;
  do {
    id = `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;
  } while (used.includes(id) || getQuote(id));
  return id;
}

const formatDate = (d) =>
  `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;

export function loadNotes(quoteId) {
  return read("notes", {})[quoteId] || {};
}
export function saveNotes(quoteId, lines) {
  const all = read("notes", {});
  const byLine = {};
  lines.forEach((l, i) => {
    if (l.note?.trim()) byLine[String(i + 1)] = l.note;
  });
  all[quoteId] = byLine;
  write("notes", all);
}

export function loadTags(quoteId) {
  return read("tags", {})[quoteId] || [];
}

export function approveQuote(quoteId, lines) {
  const isStatic = initialQuotes.some((q) => q.quoteId === quoteId);
  if (isStatic) {
    updateQuoteStatus(quoteId, "Approved");
    return;
  }
  createNewQuote(
    quoteId,
    lines.filter((l) => !l.deleted),
  );
}

function createNewQuote(quoteId, rows) {
  const tags = read("tags", {});
  tags[quoteId] = rows.map((l) => l.source || null);
  write("tags", tags);

  let totalPrice = 0;
  const products = rows.map((l) => {
    const qty = Number(l.qty) || 0;
    const unitCost = Number(l.unitCost) || 0;
    const margin = Number(l.margin) || 0;
    const selling = unitCost * (1 + margin / 100);
    const total = qty * selling;
    totalPrice += total;
    return {
      requested: l.productId,
      qty,
      score: l.score,
      margin: margin.toFixed(2),
      unit_cost: unitCost.toFixed(2),
      selling_Price: selling.toFixed(2),
      total_price: total.toFixed(2),
      total_cost: total.toFixed(2), 
      available: l.available,
    };
  });

  const now = new Date();
  const address = "605 Knowllwood Street, Brick,Nj 08724";
  const record = {
    quoteId,
    customerName: sessionStorage.getItem("username") || "snj",
    contactNumber: "261-225-6571",
    approvedDate: formatDate(now),
    status: "Approved",
    totalLineNo: products.length,
    totalPrice,
    quote_details: {
      bill_To: { company_name: "astral india pvt.limited", address },
      ship_to: { company_name: "astral india pvt.limited", address },
      po_no: "AB32109/1054",
      job_no: "AB32109FD/1201",
      buyer: "astral india pvt limited",
      delivery_date: "12/26/2025",
      products,
    },
    receivedDate: formatDate(now),
    mode: "email",
  };
  saveApprovedQuote(record);
}

export function deleteQuote(quoteId) {
  write("deletedQuotes", [quoteId, ...read("deletedQuotes", [])]);
}
export function undoDeleteQuote(quoteId) {
  write(
    "deletedQuotes",
    read("deletedQuotes", []).filter((id) => id !== quoteId),
  );
}
