import { useEffect, useRef } from "react";

export default function QuoteSearchBar({
  mode,
  value,
  onChange,
  onSubmit,
  matches,
  dropdownOpen,
  onDropdownOpen,
  onDropdownClose,
  onPick,
  error,
}) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (!wrapperRef.current?.contains(e.target)) onDropdownClose();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [onDropdownClose]);

  const showList = mode === "existing" && dropdownOpen && value.trim() !== "";

  return (
    <div className="quotes-search-bar flexbox" ref={wrapperRef}>
      <input
        type="text"
        placeholder="Enter Customer Name / Account Number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.trim() && onDropdownOpen()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
            onSubmit();
          }
        }}
      />
      <img src="/assets/images/Dashboard/Search icon.png" alt="" className="search-icon" />

      <ul className="search-list" style={{ display: showList ? "block" : "none" }}>
        <li className="search-item header">
          <span className="quote-id-title">Quote ID</span>
          <span className="customer-name-title">Customer Name</span>
        </li>
        {matches.length === 0 ? (
          <li className="search-item empty">No results found</li>
        ) : (
          matches.map((q) => (
            <li key={q.quoteId} className="search-item" onClick={() => onPick(q)}>
              <span className="quote-id">{q.quoteId}</span>
              <span className="customer-name">{q.customerName}</span>
            </li>
          ))
        )}
      </ul>

      <div className={`err-message ${error ? "active" : ""}`}>{error}</div>
    </div>
  );
}
