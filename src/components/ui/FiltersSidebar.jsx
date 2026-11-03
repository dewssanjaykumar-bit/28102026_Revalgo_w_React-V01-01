import { useLayoutEffect, useRef, useState } from "react";
import FilterGroup from "./FilterGroup.jsx";
import { STATUS_OPTIONS } from "../../hooks/useQuoteFilters.js";

const VISIBLE_CUSTOMERS = 4;
const MODE_OPTIONS = ["ERP", "Call", "Email"];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function FiltersSidebar({ filters }) {
  const sidebarRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useLayoutEffect(() => {
    const resize = () => {
      const el = sidebarRef.current;
      if (!el) return;
      console.log(window.innerHeight, el.getBoundingClientRect().top);
      console.log(el.style.height);
      el.style.height = `${window.innerHeight - el.getBoundingClientRect().top - 20}px`;
      console.log(el.style.height);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const options = filters.visibleCustomerOptions;
  const shown = showAll ? options : options.slice(0, VISIBLE_CUSTOMERS);

  return (
    <aside className="filters" ref={sidebarRef}>
      <div className="filter-header" onClick={() => setCollapsed((c) => !c)}>
        <h3>Filters</h3>
        <button className={`collapse-btn ${collapsed ? "active" : ""}`}>
          <img src="../src/assets/images/Dashboard/angle.svg" alt="" />
        </button>
      </div>

      <ul className={`filter-groups-list ${collapsed ? "collapsed" : ""}`}>
        <FilterGroup
          title="Status"
          titleClass="status-title"
          bodyClass="status-options"
          actions={
            <div className="filter-actions">
              <button
                className="select-all"
                onClick={(e) => {
                  e.stopPropagation();
                  filters.selectAllStatuses();
                }}
              >
                Select All
              </button>{" "}
              |{" "}
              <button
                className="clear-all"
                onClick={(e) => {
                  e.stopPropagation();
                  filters.clearStatuses();
                }}
              >
                Clear All
              </button>
            </div>
          }
        >
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              className={`status-btn ${filters.statuses.includes(status) ? "active" : ""}`}
              onClick={() => filters.toggleStatus(status)}
            >
              {cap(status)}
            </button>
          ))}
        </FilterGroup>

        <FilterGroup title="Customer Name" className="customer-name">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by customer"
              value={filters.customerQuery}
              onChange={(e) => {
                filters.setCustomerQuery(e.target.value);
                setShowAll(false);
              }}
            />
            <button className="search-btn">
              <img
                src="../src/assets/images/Dashboard/Search icon.png"
                alt="search"
              />
            </button>
          </div>
          <div className="checkbox-list">
            {options.length === 0 ? (
              <label>No Results!</label>
            ) : (
              shown.map((name) => (
                <label key={name} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={filters.customers.includes(name)}
                    onChange={() => filters.toggleCustomer(name)}
                  />{" "}
                  {name}
                </label>
              ))
            )}
          </div>
          {options.length > VISIBLE_CUSTOMERS && (
            <a
              href="#"
              className="see-more"
              onClick={(e) => {
                e.preventDefault();
                setShowAll((v) => !v);
              }}
            >
              {showAll ? "Show Less" : "Show More"}
            </a>
          )}
        </FilterGroup>

        <FilterGroup title="Date Range" bodyClass="date-range">
          <div className="date-input">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => filters.setStartDate(e.target.value)}
            />
          </div>
          <div className="date-input">
            <label>End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => filters.setEndDate(e.target.value)}
            />
          </div>
        </FilterGroup>

        <FilterGroup title="Mode Of Quotes" bodyClass="checkbox-list modes">
          {MODE_OPTIONS.map((mode) => (
            <label key={mode}>
              <input
                type="checkbox"
                checked={filters.modes.includes(mode.toLowerCase())}
                onChange={() => filters.toggleMode(mode)}
              />{" "}
              {mode}
            </label>
          ))}
        </FilterGroup>
      </ul>
    </aside>
  );
}
