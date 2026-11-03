import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchResultsHeader from "../../components/ui/globalFilter/SearchResultsHeader.jsx";
import TableSearchBar from "../../components/ui/globalFilter/TableSearchBar.jsx";
import FilterChips from "../../components/ui/globalFilter/FilterChips.jsx";
import TableFooter from "../../components/ui/globalFilter/TableFooter.jsx";
import FiltersSidebar from "../../components/ui/FiltersSidebar.jsx";
import QuotesTable from "../../components/ui/QuotesTable.jsx";
import useQuoteFilters from "../../hooks/useQuoteFilters.js";
import usePagination from "../../hooks/usePagination.js";
import { getAllQuotes } from "../../data/allQuotes.js";
import "../../styles/table.css";
import "./GlobalFilter.css";
import Header from "../../components/layout/Header.jsx";

function searchQuotes(list, term) {
  const q = term.trim().toLowerCase();
  return list.filter(
    (item) =>
      item.customerName.toLowerCase().includes(q) ||
      item.quoteId.toLowerCase().includes(q),
  );
}

function Results({ term, showAll, onRefresh }) {
  const navigate = useNavigate();
  const baseQuotes = useMemo(() => {
    const all = getAllQuotes();
    return showAll ? all : searchQuotes(all, term);
  }, [term, showAll]);

  const filters = useQuoteFilters(baseQuotes);
  const pager = usePagination(filters.results);

  const openQuote = (quoteId) => {
    const quote = baseQuotes.find((q) => q.quoteId === quoteId);
    sessionStorage.setItem("selectedId", quoteId);
    sessionStorage.setItem("status", quote.status);
    navigate("/quote-view");
  };

  return (
    <>
      <Header />
      <main className="global-filter-page">
        <SearchResultsHeader
          term={showAll ? "All" : term}
          count={baseQuotes.length}
          onRefresh={onRefresh}
        />

        <div className="filters-table-container show">
          <FiltersSidebar filters={filters} />

          <section className="results-table">
            <TableSearchBar
              value={filters.search}
              onChange={filters.setSearch}
            />
            <FilterChips chips={filters.chips} onClearAll={filters.clearAll} />
            <QuotesTable
              wrapper={false}
              stackedContact
              rows={pager.pageItems}
              sort={filters.sort}
              onSort={filters.toggleSort}
              onRowClick={openQuote}
            />
            <TableFooter total={pager.total} pager={pager} />
          </section>
        </div>
      </main>
    </>
  );
}

export default function GlobalFilter() {
  const location = useLocation();
  const [term, setTerm] = useState(
    () => sessionStorage.getItem("searched") ?? "",
  );
  const [showAll, setShowAll] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setTerm(sessionStorage.getItem("searched") ?? "");
    setShowAll(false);
  }, [location.key]);

  const refresh = () => {
    setShowAll(true);
    setRefreshKey((k) => k + 1);
  };

  return (
    <Results
      key={refreshKey}
      term={term}
      showAll={showAll}
      onRefresh={refresh}
    />
  );
}
