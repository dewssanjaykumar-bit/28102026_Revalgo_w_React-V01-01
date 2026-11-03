import Pagination from "./Pagination.jsx";
import { PAGE_SIZES } from "../../../hooks/usePagination.js";

export default function TableFooter({ total, pager }) {
  return (
    <div className="table-footer" aria-label="table controls">
      <div className="entries-control flex-center">
        <label htmlFor="entries-select">Show</label>
        <select
          id="entries-select"
          className="entries-select"
          value={pager.pageSize}
          onChange={(e) => pager.setPageSize(Number(e.target.value))}
        >
          {PAGE_SIZES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span className="entries-label">entries</span>
      </div>

      <div className="table-info" aria-live="polite">
        Showing {pager.start} to {pager.end} of {total} entries
      </div>

      <Pagination
        page={pager.page}
        totalPages={pager.totalPages}
        window={pager.window}
        onChange={pager.setPage}
      />
    </div>
  );
}
