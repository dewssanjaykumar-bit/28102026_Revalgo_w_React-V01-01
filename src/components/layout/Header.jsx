import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faGear,
  faBell,
  faCaretDown,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/images/Login/Revalgo White Background.png";

import { useQuotes } from "../../data/quoteStore.js";

const MAX_RESULTS = 6;

function findMatches(query, quotes) {
  const q = query.trim().toLowerCase();
  if (!q) return { customers: [], quoteIds: [] };

  const customers = new Set();
  const quoteIds = new Set();
  for (const item of quotes) {
    if (item.customerName.toLowerCase().includes(q))
      customers.add(item.customerName);
    if (item.quoteId.toLowerCase().includes(q)) quoteIds.add(item.quoteId);
  }
  return {
    customers: [...customers].slice(0, MAX_RESULTS),
    quoteIds: [...quoteIds].slice(0, MAX_RESULTS),
  };
}

function ResultList({ title, items, listClass, onPick }) {
  return (
    <>
      <h2 className="list-title">{title}</h2>
      <ul className={`global-search-list ${listClass}`}>
        {items.length === 0 ? (
          <li className="search-item no-result">No results</li>
        ) : (
          items.map((value) => (
            <li
              key={value}
              className="search-item"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onPick(value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onPick(value);
                }
              }}
            >
              {value}
            </li>
          ))
        )}
      </ul>
    </>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const quotes = useQuotes();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const { customers, quoteIds } = useMemo(
    () => findMatches(value, quotes),
    [value, quotes],
  );

  useEffect(() => {
    const onClick = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const pick = (picked) => {
    setValue(picked);
    setOpen(false);

    if (picked.startsWith("#")) {
      const quote = quotes.find((q) => q.quoteId === picked);
      sessionStorage.setItem("selectedId", picked);
      sessionStorage.setItem("status", quote?.status ?? "");
      navigate("/quote-view");
      return;
    }
    sessionStorage.setItem("searched", picked);
    navigate("/global-filter");
  };

  return (
    <header className="navbar flex-between">
      <a href="./dashboard.html" className="navbar-left">
        <img src={Logo} alt="Revalgo logo" className="logo" />
      </a>
      <div className="navbar-center" ref={wrapperRef}>
        <div className="search-bar flex-center">
          <input
            type="text"
            placeholder="PO#, Order#, Quote#, Customer#/Name"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(e.target.value.trim() !== "");
            }}
            onFocus={() => setOpen(value.trim() !== "")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.trim()) {
                sessionStorage.setItem("searched", value.trim());
                setOpen(false);
                navigate("/global-filter");
              }
            }}
          />
          <img
            src="../src/assets/images/Dashboard/Search icon.svg"
            alt=""
            className="search-icon"
          />
        </div>

        <div
          className="global-search-dropdown"
          style={{ display: open ? "block" : "none" }}
        >
          <ResultList
            title="Customer Name"
            items={customers}
            listClass="customer-list"
            onPick={pick}
          />
          <ResultList
            title="Quote Id"
            items={quoteIds}
            listClass="quoteId-list"
            onPick={pick}
          />
        </div>
      </div>
      <div className="navbar-right flex-between">
        <button
          className="new-quote-btn"
          onClick={() => navigate("/createquote")}
        >
          New Quote
        </button>
        <FontAwesomeIcon icon={faHouse} />
        <FontAwesomeIcon icon={faGear} />
        <FontAwesomeIcon icon={faBell} />
        <div className="profile flex-center">
          <div className="user flex-center">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <FontAwesomeIcon icon={faCaretDown} />
        </div>
      </div>
      <div className="global-search-dropdown">
        <h2 className="list-title">Customer Name</h2>
        <ul className="global-search-list customer-list"></ul>
        <h2 className="list-title">Quote Id</h2>
        <ul className="global-search-list quoteId-list"></ul>
      </div>
    </header>
  );
}
