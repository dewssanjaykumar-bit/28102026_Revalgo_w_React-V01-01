import { updateQuoteStatus } from "../data/quoteStore.js";

export function approveQuote(quoteId) {
  updateQuoteStatus(quoteId, "Approved");
}
