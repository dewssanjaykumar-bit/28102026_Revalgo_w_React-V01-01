import { initialQuotes } from "./quotes.js";

export function getAllQuotes() {
  let saved = [];
  try {
    saved = JSON.parse(sessionStorage.getItem("newQuotes")) || [];
  } catch {
  }
  return [...saved, ...initialQuotes];
}
