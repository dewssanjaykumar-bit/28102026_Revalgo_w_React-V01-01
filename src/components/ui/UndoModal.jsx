import { useEffect, useRef } from "react";

export default function UndoModal({ quoteId, onConfirm, onCancel }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (quoteId && !d.open) d.showModal();
    if (!quoteId && d.open) d.close();
  }, [quoteId]);

  return (
    <dialog className="undo-modal" ref={ref} onClose={onCancel}>
      <h2 className="modal-title">
        Are you sure you want to undo the deletion of this quote ?
        <span id="undo-quote-id"> {quoteId}</span>
      </h2>
      <div className="actions-btns flex-center">
        <button className="yes-btn" onClick={onConfirm}>Yes</button>
        <button className="no-btn" onClick={onCancel}>No</button>
      </div>
    </dialog>
  );
}
