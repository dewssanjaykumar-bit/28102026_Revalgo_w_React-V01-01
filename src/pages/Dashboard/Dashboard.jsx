import { useEffect, useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import Toolbar from "../../components/ui/Toolbar";
import StatsBar from "../../components/ui/StatsBar";
import RecentQuotes from "../../components/ui/RecentQuotes";
import TrendChart from "../../components/ui/TrendChart";
import AccuracyGauge from "../../components/ui/AccuracyGauge";
import TopTransactions from "../../components/ui/TopTransactions";
import UndoModal from "../../components/ui/UndoModal";
import ExpandModal from "../../components/ui/ExpandModal";
import { updateQuoteStatus, useQuotes } from "../../data/quoteStore.js";
import { filterByRange, topTransactions } from "../../utils/helpers.js";
import "./Dashboard.css";
import "../../styles/table.css";
import ExpandIcon from "../../assets/images/Dashboard/Expand_icon.svg";

function ExpandButton({ target, onClick }) {
  return (
    <button className="fullscr-btn" onClick={() => onClick(target)}>
      <img src={ExpandIcon} alt="Expand" />
    </button>
  );
}

export default function Dashboard() {
  const allQuotes = useQuotes();
  const [range, setRange] = useState("last-6-months");
  const [custom, setCustom] = useState({ start: "", end: "" });
  const [activeTab, setActiveTab] = useState("all");
  const [widgets, setWidgets] = useState({
    "recent-orders": true,
    trend: true,
    accuracy: true,
    "top-trans": true,
  });
  const [expanded, setExpanded] = useState(null);
  const [undoId, setUndoId] = useState(null);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [widgets]);

  const quotes = useMemo(
    () => filterByRange(allQuotes, range, custom),
    [allQuotes, range, custom],
  );
  const top = useMemo(() => topTransactions(quotes, 5), [quotes]);
  const rightWidgetCount = [
    widgets.trend,
    widgets.accuracy,
    widgets["top-trans"],
  ].filter(Boolean).length;
  const layoutClass = widgets["recent-orders"]
    ? rightWidgetCount
      ? "widget-layout--with-recent"
      : "widget-layout--recent-only"
    : "widget-layout--right-only";

  const confirmUndo = () => {
    updateQuoteStatus(undoId, "Pending");
    setUndoId(null);
  };

  const exportCsv = (rows) => {
    const head = [
      "quoteId",
      "customerName",
      "receivedDate",
      "approvedDate",
      "status",
      "totalLineNo",
      "totalPrice",
    ];
    const csv = [
      head.join(","),
      ...rows.map((r) => head.map((h) => `"${r[h]}"`).join(",")),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "quotes.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const showRight = widgets.trend || widgets.accuracy || widgets["top-trans"];

  return (
    <div className="dashboard-page">
      <UndoModal
        quoteId={undoId}
        onConfirm={confirmUndo}
        onCancel={() => setUndoId(null)}
      />
      <ExpandModal
        target={expanded}
        quotes={quotes}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={() => setExpanded(null)}
        onUndo={setUndoId}
        onExport={exportCsv}
      />

      <Header />

      <main className="dashboard">
        <Toolbar
          range={range}
          setRange={setRange}
          custom={custom}
          setCustom={setCustom}
          widgets={widgets}
          setWidgets={setWidgets}
        />

        <StatsBar quotes={quotes} />

        <section
          className={`content-section flex-between widget-layout ${layoutClass}`}
        >
          {widgets["recent-orders"] && (
            <div className="left-panel">
              <h2 className="panel-header">Recent Quotes</h2>
              <RecentQuotes
                quotes={quotes}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onUndo={setUndoId}
                onExpand={setExpanded}
                onExport={exportCsv}
              />
            </div>
          )}

          {showRight && (
            <div className={`right-panel right-panel--${rightWidgetCount}`}>
              {widgets.trend && (
                <div className="trend-chart">
                  <h2 className="panel-header">Trend</h2>
                  <div className="chart-container chart1">
                    <ExpandButton target="trend" onClick={setExpanded} />
                    <TrendChart quotes={quotes} activeTab={activeTab} />
                  </div>
                </div>
              )}
              {widgets.accuracy && (
                <div className="accuracy-gauge">
                  <h2 className="panel-header">Accuracy</h2>
                  <div className="chart-container chart2">
                    <ExpandButton target="accuracy" onClick={setExpanded} />
                    <AccuracyGauge quotes={quotes} />
                  </div>
                </div>
              )}
              {widgets["top-trans"] && (
                <TopTransactions rows={top} onViewMore={setExpanded} />
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
