import FiltersSidebar from "./FiltersSidebar.jsx";
import QuotesTable from "./QuotesTable.jsx";
import useQuoteFilters from "../../hooks/useQuoteFilters.js";

export default function QuoteResults({ baseQuotes, searchTerm, onRowClick }) {
  const filters = useQuoteFilters(baseQuotes);

  return (
    <>
      <div className="search-results-info" style={{ display: "block" }}>
        <h3 className="searched-item">
          SEARCH RESULTS FOR: <strong>"{searchTerm}"</strong>
        </h3>
        <div className="no-of-items">{baseQuotes.length} items</div>
      </div>

      <div className="filters-table-container show">
        <FiltersSidebar filters={filters} />
        <QuotesTable
          rows={filters.results}
          sort={filters.sort}
          onSort={filters.toggleSort}
          onRowClick={onRowClick}
        />
      </div>
    </>
  );
}
