const day = 86400000;

export const fmtDate = (iso) => {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  return `${m}-${d}-${y}`;
};

export const vw = (v) => window.innerWidth * (v / 100);

export const money = (n) => `$ ${Number(n).toLocaleString()}`;

export function getRange(range, custom) {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  switch (range) {
    case "today":
      return [startOfToday, new Date(startOfToday.getTime() + day - 1)];
    case "yesterday":
      return [new Date(startOfToday - day), new Date(startOfToday - 1)];
    case "last-week":
      return [new Date(startOfToday - 7 * day), now];
    case "last-30-days":
      return [new Date(startOfToday - 30 * day), now];
    case "custom":
      return [
        custom.start ? new Date(custom.start) : new Date(0),
        custom.end ? new Date(custom.end + "T23:59:59") : now,
      ];
    default: {
      const s = new Date(startOfToday);
      s.setMonth(s.getMonth() - 6);
      return [s, now];
    }
  }
}

export const filterByRange = (quotes, range, custom) => {
  const [start, end] = getRange(range, custom);
  return quotes.filter((q) => {
    const d = new Date(q.receivedDate);
    return d >= start && d <= end;
  });
};

export const topTransactions = (quotes, n = 5) =>
  quotes
    .filter((q) => q.status.toLowerCase() === "approved")
    .sort((a, b) => b.totalPrice - a.totalPrice)
    .slice(0, n);
