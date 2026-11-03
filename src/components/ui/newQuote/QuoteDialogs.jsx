import ModalDialog from "../ModalDialog.jsx";
import NativePopover from "../NativePopover.jsx";

export function SourcingConfirmDialog({ pending, onYes, onNo }) {
  return (
    <ModalDialog className="sourcing-confirm-modal" open={pending !== null} onClose={onNo}>
      <h2 className="modal-title">
        Do you want to confirm with <span className="prod-id">{pending?.pid}</span> Non Stock Item?
      </h2>
      <div className="actions-btns flex-center">
        <button className="yes-btn confirm-sourcing" onClick={onYes}>
          Yes
        </button>
        <button className="no-btn" onClick={onNo}>
          No
        </button>
      </div>
    </ModalDialog>
  );
}

export function DeleteQuoteDialog({ open, quoteId, onYes, onNo }) {
  return (
    <ModalDialog className="delete-quote-modal" open={open} onClose={onNo}>
      <h2 className="modal-title">
        Are you sure, you want to delete this quote <span id="delete-quote-id">{quoteId}</span> ?
      </h2>
      <div className="actions-btns flex-center">
        <button className="yes-btn" onClick={onYes}>
          Yes
        </button>
        <button className="no-btn" onClick={onNo}>
          No
        </button>
      </div>
    </ModalDialog>
  );
}

export function UndoQuoteDialog({ open, quoteId, onYes, onNo }) {
  return (
    <ModalDialog className="undo-quote-modal" open={open} onClose={onNo}>
      <h2 className="modal-title">
        Are you sure, you want to undo this quote <span id="undo-quote-id">{quoteId}</span> ?
      </h2>
      <div className="actions-btns flex-center">
        <button className="undo-yes-btn" onClick={onYes}>
          Yes
        </button>
        <button className="undo-no-btn" onClick={onNo}>
          No
        </button>
      </div>
    </ModalDialog>
  );
}

export function ApproveConfirmDialog({ open, quoteId, onConfirm, onCancel }) {
  return (
    <ModalDialog className="approve-confirmation-modal undo-modal" open={open} onClose={onCancel}>
      <h2 className="modal-title">
        Are you sure you want to approve this Quote <span>{quoteId}</span> ?
      </h2>
      <div className="actions-btns flex-center">
        <button className="approve-confirm-btn" onClick={onConfirm}>
          Confirm
        </button>
        <button className="no-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </ModalDialog>
  );
}

export function ApprovedPopover({ open, quoteId, onClose }) {
  return (
    <NativePopover className="approve-quote-popover undo-modal" open={open} onClose={onClose}>
      <h2 className="modal-title">
        Your Quote <span id="approve-quote-id">{quoteId}</span> has been approved Successfully
      </h2>
      <div className="actions-btns flex-center">
        <button className="no-btn" onClick={onClose}>
          Ok
        </button>
      </div>
    </NativePopover>
  );
}
