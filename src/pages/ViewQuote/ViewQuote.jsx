import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalDialog from "../../components/ui/ModalDialog.jsx";
import QuoteInfoCard, {
  infoFromQuote,
} from "../../components/ui/quoteView/QuoteInfoCard.jsx";
import OrderPad from "../../components/ui/quoteView/OrderPad.jsx";
import ItemsTable from "../../components/ui/quoteView/ItemsTable.jsx";
import { updateQuoteStatus, useQuotes } from "../../data/quoteStore.js";
import { approveQuote } from "../../features/approveQuote.js";
import "./ViewQuote.css";
import Header from "../../components/layout/Header.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const STATUS_LABEL = {
  pending: "Pending",
  approved: "Approved",
  deleted: "Deleted",
};
const DIMMED = { opacity: 0.5, pointerEvents: "none" };

export default function QuoteView() {
  const navigate = useNavigate();
  const quotes = useQuotes();

  const quoteId = sessionStorage.getItem("selectedId");
  const quote = quotes.find((q) => q.quoteId === quoteId);
  const status = (quote?.status || "").toLowerCase();

  const [approvedNow, setApprovedNow] = useState(false);

  const [undoOpen, setUndoOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [approvedOpen, setApprovedOpen] = useState(false);

  if (!quote) {
    return (
      <div className="view-quote-root">
        <main className="quote-view-page">
          <p style={{ padding: "2rem" }}>Quote not found.</p>
        </main>
      </div>
    );
  }

  const isPending = status === "pending";
  const isApproved = status === "approved";
  const isDeleted = status !== "pending" && status !== "approved";

  const confirmApprove = () => {
    setConfirmOpen(false);
    setApprovedOpen(true);
    setApprovedNow(true);
    approveQuote(quoteId);
  };

  const confirmUndo = () => {
    updateQuoteStatus(quoteId, "Pending");
    setUndoOpen(false);
    setApprovedNow(false);
  };

  return (
    <div className="view-quote-root">
      <ModalDialog
        className="undo-modal"
        open={undoOpen}
        onClose={() => setUndoOpen(false)}
      >
        <h2 className="modal-title">
          Are you sure you want to undo the deletion of this quote{" "}
          <span id="undo-quote-id">{quoteId}</span> ?
        </h2>
        <div className="actions-btns flex-center">
          <button className="yes-btn" onClick={confirmUndo}>
            Yes
          </button>
          <button className="no-btn" onClick={() => setUndoOpen(false)}>
            No
          </button>
        </div>
      </ModalDialog>

      <ModalDialog
        className="approve-confirmation-modal undo-modal"
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <h2 className="modal-title">
          Are you sure you want to approve this Quote <span>{quoteId}</span> ?
        </h2>
        <div className="actions-btns flex-center">
          <button className="approve-confirm-btn" onClick={confirmApprove}>
            Confirm
          </button>
          <button className="no-btn" onClick={() => setConfirmOpen(false)}>
            Cancel
          </button>
        </div>
      </ModalDialog>

      <ModalDialog
        className="approve-quote-modal undo-modal"
        open={approvedOpen}
        onClose={() => setApprovedOpen(false)}
      >
        <h2 className="modal-title">
          Your Quote <span>{quoteId}</span> has been approved Successfully
        </h2>
        <div className="actions-btns flex-center">
          <button className="no-btn" onClick={() => setApprovedOpen(false)}>
            Ok
          </button>
        </div>
      </ModalDialog>

      <Header />

      <main className="quote-view-page">
        <div className="quote-header flex-between">
          <h1 className="quote-id flexbox">
            <a
              className="go-back-arrow"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </a>
            <span> {quoteId}</span>
            <span
              className={`status ${isPending ? "pending" : isApproved ? "approved" : "deleted"}`}
            >
              {STATUS_LABEL[status] ?? status}
            </span>
            <div
              className={`undo-btn flexbox ${isDeleted ? "active" : ""}`}
              onClick={() => setUndoOpen(true)}
            >
              <img
                src="../src/assets/images/Dashboard/Undo_icon.png"
                alt=""
                className="undo-icon"
              />
              <span>Undo</span>
            </div>
          </h1>
          <div className="quote-actions">
            <button
              className="add-note-btn"
              style={isPending ? undefined : DIMMED}
            >
              Add Note
            </button>
            {isPending && (
              <button
                className="approve-quote-btn"
                onClick={() => setConfirmOpen(true)}
              >
                Approve Quote
              </button>
            )}
          </div>
        </div>

        <QuoteInfoCard
          info={infoFromQuote(quote)}
          hideEditable={isApproved && !approvedNow}
          disabled={isDeleted || approvedNow}
        />

        <div
          className="main-content-section"
          style={isDeleted || approvedNow ? DIMMED : undefined}
        >
          <OrderPad />
          <ItemsTable quote={quote} disabled={isApproved} />
        </div>
      </main>
    </div>
  );
}
