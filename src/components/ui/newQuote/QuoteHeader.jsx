import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const STATUS_LABEL = { approved: "Approved", deleted: "Deleted" };

export default function QuoteHeader({
  quoteId,
  status,
  onDelete,
  onUndo,
  onApprove,
}) {
  const navigate = useNavigate();
  const locked = status !== "";

  return (
    <div className="quote-header flex-between">
      <div className="flexbox">
        <div className="page-title flexbox">
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
          <h1 style={{ marginBottom: 0 }} className="quote-id">
            {quoteId}
          </h1>
          <button className="quote-delete-btn" onClick={onDelete}>
            <img src="../../src/assets/images/Create/delete_icon.png" alt="" />
          </button>
          <span className={`status ${status}`}>
            {STATUS_LABEL[status] ?? ""}
          </span>
          <button
            className={`quote-undo-btn ${status === "deleted" ? "active" : ""}`}
            onClick={onUndo}
          >
            <img src="../../src/assets/images/Dashboard/Undo_icon.png" alt="" />
          </button>
        </div>
        <div className="undo-btn flexbox">
          <img
            src="../../src/assets/images/Dashboard/Undo_icon.png"
            alt=""
            className="undo-icon"
          />
          <span>Undo</span>
        </div>
      </div>
      <div
        className="quote-actions"
        style={locked ? { opacity: 0.5, pointerEvents: "none" } : undefined}
      >
        <button className="add-note-btn">Add Note</button>
        <button className="approve-quote-btn" onClick={onApprove}>
          Approve Quote
        </button>
      </div>
    </div>
  );
}
