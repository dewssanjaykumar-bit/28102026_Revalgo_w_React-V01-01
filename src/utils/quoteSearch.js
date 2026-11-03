export function matchQuotes(quotes, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return quotes.filter(
    (item) =>
      item.customerName.toLowerCase().includes(q) ||
      item.quoteId.toLowerCase().includes(q)
  );
}
