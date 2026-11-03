export default function Pagination({
  page,
  totalPages,
  window: pages,
  onChange,
}) {
  return (
    <nav className="pagination-controls" aria-label="Pagination">
      <button
        className="page-btn page-prev"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        &laquo;
      </button>
      <ul className="pagination-list">
        {pages.map((p) =>
          typeof p === "number" ? (
            <li
              key={p}
              className={`page-item ${p === page ? "active" : ""}`}
              data-page={p}
              tabIndex={0}
              onClick={() => onChange(p)}
              onKeyDown={(e) => e.key === "Enter" && onChange(p)}
            >
              {p}
            </li>
          ) : (
            <li key={p} className="page-ellipsis">
              ...
            </li>
          ),
        )}
      </ul>
      <button
        className="page-btn page-next"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        &raquo;
      </button>
    </nav>
  );
}
