const icon = (name) => `./src/assets/images/Dashboard/${name}.svg`;

export default function StatsBar({ quotes }) {
  const approved = quotes.filter((q) => q.status.toLowerCase() === "approved");
  const pending = quotes.filter((q) => q.status.toLowerCase() === "pending");
  const revenue = approved.reduce(
    (sum, q) => sum + (Number(q.totalPrice) || 0),
    0,
  );

  const stats = [
    {
      icon: "cart",
      label: "Total Quotes",
      value: approved.length + pending.length,
    },
    { icon: "approved", label: "Approved Quotes", value: approved.length },
    { icon: "pending", label: "Pending Quotes", value: pending.length },
    {
      icon: "revenue",
      label: "Total Revenue",
      value: `$${revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
  ];

  return (
    <ul className="stats-bar">
      {stats.map((s) => (
        <li className="stat" key={s.label}>
          <img src={icon(s.icon)} alt="" className="stat-icon" />
          <div className="stat-desc">
            <p>{s.label}</p>
            <span>{s.value}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
