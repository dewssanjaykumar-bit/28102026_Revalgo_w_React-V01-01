import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import moment from "moment";
import "daterangepicker/daterangepicker.css";
import useClickOutside from "../../utils/useClickOutside";

const RANGES = [
  ["today", "Today"],
  ["yesterday", "Yesterday"],
  ["last-week", "Last Week"],
  ["last-30-days", "Last 30 Days"],
  ["last-6-months", "Last 6 Months"],
  ["custom", "Custom"],
];

const WIDGETS = [
  ["recent-orders", "Recent Orders"],
  ["trend", "Trend"],
  ["accuracy", "Accuracy"],
  ["top-trans", "Top Transactions"],
];

export default function Toolbar({
  range,
  setRange,
  custom,
  setCustom,
  widgets,
  setWidgets,
}) {
  const [rangeOpen, setRangeOpen] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const rangeRef = useRef(null);
  const widgetRef = useRef(null);
  const dateRangeRef = useRef(null);
  const customRef = useRef(custom);
  const previousRangeRef = useRef(range);

  customRef.current = custom;

  useClickOutside(rangeRef, () => setRangeOpen(false));
  useClickOutside(widgetRef, () => setWidgetOpen(false));

  useEffect(() => {
    let disposed = false;
    let $input;

    const year = new Date().getFullYear();
    const parseDate = (value) =>
      value ? moment(value, "YYYY-MM-DD", true) : moment.invalid();
    const start = parseDate(customRef.current.start);
    const end = parseDate(customRef.current.end);

    window.$ = $;
    window.jQuery = $;
    window.moment = moment;

    import("daterangepicker").then(() => {
      if (disposed || !dateRangeRef.current) return;

      $input = $(dateRangeRef.current);
      $input.daterangepicker({
        startDate: start.isValid() ? start : moment(),
        endDate: end.isValid() ? end : moment(),
        minDate: moment(`${year}-01-01`, "YYYY-MM-DD"),
        maxDate: moment(`${year}-12-31`, "YYYY-MM-DD"),
        opens: "center",
        showDropdowns: true,
        autoUpdateInput: false,
        locale: { format: "YYYY/MM/DD" },
      });

      $input.on("apply.daterangepicker", (_event, picker) => {
        const selectedCustom = {
          start: picker.startDate.format("YYYY-MM-DD"),
          end: picker.endDate.format("YYYY-MM-DD"),
        };
        setCustom(selectedCustom);
        setRange("custom");
        previousRangeRef.current = "custom";
      });

      $input.on("cancel.daterangepicker", (_event, picker) => {
        const savedStart = parseDate(customRef.current.start);
        const savedEnd = parseDate(customRef.current.end);
        picker.setStartDate(savedStart.isValid() ? savedStart : moment());
        picker.setEndDate(savedEnd.isValid() ? savedEnd : moment());
        setRange(previousRangeRef.current);
      });
    });

    return () => {
      disposed = true;
      $input?.off(".daterangepicker");
      $input?.data("daterangepicker")?.remove();
    };
  }, [setCustom, setRange]);

  const label =
    range === "custom" && custom.start && custom.end
      ? `${moment(custom.start, "YYYY-MM-DD").format("YYYY/MM/DD")} - ${moment(custom.end, "YYYY-MM-DD").format("YYYY/MM/DD")}`
      : (RANGES.find(([k]) => k === range)?.[1] ?? "Select date range");

  const allChecked = WIDGETS.every(([k]) => widgets[k]);
  const toggleAll = (checked) => {
    setWidgets(Object.fromEntries(WIDGETS.map(([k]) => [k, checked])));
  };

  return (
    <div className="toolbar flex-between">
      <div className="toolbar-left">
        <h1>DASHBOARD</h1>
      </div>

      <div className="toolbar-right flex-center">
        <div className="filters" ref={rangeRef}>
          <div
            className="filter-select flex-between"
            onClick={() => setRangeOpen((o) => !o)}
          >
            <span className="selected-time">{label}</span>
            <input id="date-range" ref={dateRangeRef} type="text" readOnly />
            <img
              src="./src/assets/images/Dashboard/down-arr.svg"
              alt=""
              className="arrow-down"
            />
            {rangeOpen && (
              <ul className="timeline-dropdown" style={{ display: "block" }}>
                {RANGES.map(([key, text]) => (
                  <li
                    key={key}
                    className={`list-item ${range === key ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setRangeOpen(false);
                      if (key === "custom") {
                        previousRangeRef.current = range;
                        $(dateRangeRef.current).data("daterangepicker")?.show();
                      } else {
                        setRange(key);
                        previousRangeRef.current = key;
                      }
                    }}
                  >
                    {text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div ref={widgetRef} style={{ position: "relative" }}>
          <button
            className="add-widget-btn"
            onClick={() => setWidgetOpen((o) => !o)}
          >
            <span>+ </span>Add /Remove Widget
          </button>
          {widgetOpen && (
            <div className="add-widget-dropdown" style={{ display: "block" }}>
              <h3 className="dd-header">Select Widget</h3>
              <ul className="widgets-list">
                <li className="widget-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={(e) => toggleAll(e.target.checked)}
                    />{" "}
                    Select All
                  </label>
                </li>
                {WIDGETS.map(([key, text]) => (
                  <li className="widget-item" key={key}>
                    <label>
                      <input
                        type="checkbox"
                        checked={widgets[key]}
                        onChange={(e) =>
                          setWidgets({ ...widgets, [key]: e.target.checked })
                        }
                      />{" "}
                      {text}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
