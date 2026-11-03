export default function SearchResultsHeader({ term, count, onRefresh }) {
  return (
    <div className="search-results-info" style={{ display: "block" }}>
      <h3 className="searched-item">
        Search Results For <strong>"{term}"</strong>
      </h3>
      <div className="actions-bar flex-between">
        <div className="no-of-items">{count} items</div>
        <button className="refresh-btn flexbox" onClick={onRefresh}>
          <img src="../src/assets/images/Order Pad/Rotate icon.png" alt="" />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}
