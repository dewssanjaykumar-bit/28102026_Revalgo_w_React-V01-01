export default function FilterChips({ chips, onClearAll }) {
  if (chips.length === 0) return null;

  return (
    <div className="top-filters-bar flex-between">
      <ul className="filtered-chips flexbox">
        {chips.map((chip) => (
          <li key={chip.key} className="chip-item" onClick={chip.remove}>
            &times; {chip.label}
          </li>
        ))}
      </ul>
      <button className="clear-filter-btn" onClick={onClearAll}>
        Clear All
      </button>
    </div>
  );
}
