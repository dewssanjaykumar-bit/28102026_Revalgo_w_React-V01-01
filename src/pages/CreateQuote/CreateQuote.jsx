import { useCallback, useMemo, useState } from "react";
import QuoteTypeSelector from "../../components/ui/QuoteTypeSelector.jsx";
import QuoteSearchBar from "../../components/ui/QuoteSearchBar.jsx";
import QuoteResults from "../../components/ui/QuoteResults.jsx";
import QuoteLinesModal from "../../components/ui/QuoteLinesModal.jsx";
import {
  addQuote,
  addQuoteProducts,
  useQuotes,
} from "../../data/quoteStore.js";
import { generateNewQuoteId } from "../../features/quoteStorage.js";
import { matchQuotes } from "../../utils/quoteSearch.js";
import Header from "../../components/layout/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../../styles/filters.css";
import "./CreateQuote.css";
import "../../styles/table.css";
import { useNavigate } from "react-router-dom";

function validateNewQuoteId(id, quotes) {
  if (id === "") return "Quote Id must not be empty!";
  if (id[0] !== "#") return "Quote Id must begin with `#`";
  if (id.length < 5) return "Quote Id must be at least 5 characters long";
  if (!/^[A-Za-z0-9]+$/.test(id.slice(1)))
    return "Quote Id must contain only alphabets or numbers";
  if (quotes.some((q) => q.quoteId === id)) return "Quote Id already exists!";
  return "";
}

export default function CreateQuote() {
  const quotes = useQuotes();
  const [mode, setMode] = useState("new");
  const [view, setView] = useState("search");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const [modalQuoteId, setModalQuoteId] = useState(null);

  const matches = useMemo(() => matchQuotes(quotes, query), [quotes, query]);
  const hasQuery = query.trim() !== "";
  const modalQuote = modalQuoteId
    ? quotes.find((q) => q.quoteId === modalQuoteId)
    : null;

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);
  const openDropdown = useCallback(() => setDropdownOpen(true), []);
  const navigate = useNavigate();

  const changeMode = (next) => {
    setMode(next);
    setView("search");
    setError("");
    if (next === "new") {
      setQuery("");
      setSelectedId(null);
    }
  };

  const changeQuery = (value) => {
    setQuery(value);
    setSelectedId(null);
    setDropdownOpen(value.trim() !== "");
    if (value.trim() !== "") setError("");
  };

  const pickQuote = (quote) => {
    setQuery(quote.quoteId);
    setSelectedId(quote.quoteId);
    setDropdownOpen(false);
    sessionStorage.setItem("selectedId", quote.quoteId);
    sessionStorage.setItem("status", "Pending");
    sessionStorage.removeItem("newQuote");
  };

  const createQuote = () => {
    const id = query.trim();
    const message = validateNewQuoteId(id, quotes);
    if (message) {
      setError(message);
      return;
    }
    if (!addQuote(id)) {
      setError("Quote Id already exists!");
      return;
    }
    sessionStorage.setItem("activeNewQuoteId", id);
    sessionStorage.setItem("selectedId", id);
    sessionStorage.setItem("status", "Pending");
    sessionStorage.removeItem("selectedLines");
    setError("");
    navigate("/newquote");
  };

  const goNext = () => {
    if (!hasQuery) return;
    if (selectedId) {
      sessionStorage.setItem("status", "Pending");
      setModalQuoteId(selectedId);
    } else {
      setDropdownOpen(false);
      setView("results");
    }
  };

  const submit = mode === "new" ? createQuote : goNext;

  const importLines = (products) => {
    if (products?.length) {
      const quoteId = generateNewQuoteId();
      if (!addQuote(quoteId)) return;
      addQuoteProducts(quoteId, products);
      sessionStorage.setItem("activeNewQuoteId", quoteId);
      sessionStorage.setItem("selectedId", quoteId);
      sessionStorage.setItem("status", "Pending");
      navigate("/newquote");
    }
  };

  const inResults = view === "results";

  return (
    <div className="create-quote-page">
      <Header />
      <main>
        <div className="page-title flexbox">
          <FontAwesomeIcon
            icon={faArrowLeft}
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          />
          <h1 style={{ marginBottom: 0 }}>Create Quote</h1>
        </div>

        <QuoteTypeSelector
          mode={mode}
          shrink={inResults}
          onChange={changeMode}
        />

        {!inResults && (
          <>
            <QuoteSearchBar
              mode={mode}
              value={query}
              onChange={changeQuery}
              onSubmit={submit}
              matches={matches}
              dropdownOpen={dropdownOpen}
              onDropdownOpen={openDropdown}
              onDropdownClose={closeDropdown}
              onPick={pickQuote}
              error={error}
            />
            <button
              className={`create-quote-btn ${mode === "new" ? "active" : ""}`}
              onClick={createQuote}
            >
              Create Quote
            </button>
            <button
              className={`next-btn ${mode === "existing" ? "active" : ""} ${hasQuery ? "" : "disabled"}`}
              onClick={goNext}
            >
              Next
            </button>
          </>
        )}

        {inResults && (
          <QuoteResults
            baseQuotes={matches}
            searchTerm={query}
            onRowClick={setModalQuoteId}
          />
        )}

        {modalQuote && (
          <QuoteLinesModal
            key={modalQuote.quoteId}
            quote={modalQuote}
            onClose={() => setModalQuoteId(null)}
            onImport={importLines}
          />
        )}
      </main>
    </div>
  );
}
