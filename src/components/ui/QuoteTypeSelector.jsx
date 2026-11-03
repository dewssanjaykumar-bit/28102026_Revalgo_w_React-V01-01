const OPTIONS = [
  {
    id: "new",
    label: "New",
    activeIcon: "../src/assets/images/Create/create quote_new icon_Blue.png",
    idleIcon: "../src/assets/images/Create/create quote_new icon_Black.png",
    iconClass: "new",
  },
  {
    id: "existing",
    label: "From Existing",
    activeIcon: "../src/assets/images/Create/create quote_Existing icon_Blue.png",
    idleIcon: "../src/assets/images/Create/create quote_existing icon_Grey.png",
    iconClass: "existing",
  },
];

export default function QuoteTypeSelector({ mode, shrink, onChange }) {
  return (
    <section className="create-quote">
      <div className={`quote-selection flex-center ${shrink ? "shrink" : ""}`}>
        {OPTIONS.map((opt) => (
          <div
            key={opt.id}
            className={`select-item ${opt.id === "new" ? "create-new" : ""} ${
              mode === opt.id ? "active" : ""
            }`}
            onClick={() => onChange(opt.id)}
          >
            <img src={opt.activeIcon} alt="" className={`select-icon ${opt.iconClass}`} />
            <img src={opt.idleIcon} alt="" className={`select-icon ${opt.iconClass}`} />
            <h2>{opt.label}</h2>
          </div>
        ))}
      </div>
    </section>
  );
}
