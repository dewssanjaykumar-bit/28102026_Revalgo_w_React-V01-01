import NativePopover from "../NativePopover.jsx";

export function DeleteSelectedPopover({ open, onYes, onClose }) {
  return (
    <NativePopover
      id="deleteSelected"
      className="delete-selected-popover"
      open={open}
      onClose={onClose}
    >
      <h2 className="modal-header">Delete</h2>
      <p className="modal-text">
        Are you sure want to delete the selected items ?
      </p>
      <div className="actions-btns">
        <button className="yes-btn2" onClick={onYes}>
          Yes
        </button>
        <button className="no-btn2" onClick={onClose}>
          No
        </button>
      </div>
    </NativePopover>
  );
}

export function DeleteLinePopover({ lineNo, onYes, onClose }) {
  return (
    <NativePopover
      id="deleteConfirm"
      className="delete-confirm-popover"
      open={lineNo !== null}
      onClose={onClose}
    >
      <h2 className="modal-header">Delete</h2>
      <p className="modal-text">
        Are you sure want to delete item{" "}
        <span className="line-no">{lineNo}</span> ?
      </p>
      <div className="actions-btns">
        <button className="yes-btn" onClick={onYes}>
          Yes
        </button>
        <button className="no-btn" onClick={onClose}>
          No
        </button>
      </div>
    </NativePopover>
  );
}
