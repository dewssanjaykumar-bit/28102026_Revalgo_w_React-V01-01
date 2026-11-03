import { useEffect, useRef } from "react";
import RecentQuotes from "./RecentQuotes";
import TrendChart from "./TrendChart";
import AccuracyGauge from "./AccuracyGauge";
import TransactionsTable from "./TopTransactions";

const TITLES = {
  "recent-quotes": "Recent Quotes",
  trend: "Trend",
  accuracy: "Accuracy",
  "top-transactions": "Top Transactions",
};

export default function ExpandModal({
  target,
  quotes,
  onClose,
  onUndo,
  onExport,
  activeTab = "all",
  onTabChange,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (target && !d.open) d.showModal();
    if (!target && d.open) d.close();
  }, [target]);

  return (
    <dialog className="expand-modal" ref={ref} onClose={onClose}>
      {target && (
        <>
          <div className="modal-header flex-between">
            <h2 className="modal-title">{TITLES[target]}</h2>
            <span className="modal-close" onClick={onClose}>
              &times;
            </span>
          </div>
          <div className="expand-container">
            {target === "recent-quotes" && (
              <div className="quotes-table-modal modal-item">
                <RecentQuotes
                  embedded
                  quotes={quotes}
                  activeTab={activeTab}
                  onTabChange={onTabChange}
                  onUndo={onUndo}
                  onExport={onExport}
                />
              </div>
            )}
            {target === "trend" && (
              <div className="modal-item">
                <TrendChart quotes={quotes} activeTab={activeTab} />
              </div>
            )}
            {target === "accuracy" && (
              <div className="modal-item">
                <AccuracyGauge quotes={quotes} />
              </div>
            )}
            {target === "top-transactions" && (
              <div className="modal-item">
                <TransactionsTable viewMore={true} />
              </div>
            )}
          </div>
        </>
      )}
    </dialog>
  );
}
