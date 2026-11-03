import { useEffect, useState } from "react";
import NativePopover from "../NativePopover.jsx";

export default function AddNotePopover({ open, initialNote, onSave, onClose }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) setText(initialNote ?? "");
  }, [open, initialNote]);

  return (
    <NativePopover
      id="addNote"
      className="add-note-popover"
      open={open}
      onClose={onClose}
    >
      <h2 className="note-header">Add Quote Note</h2>
      <textarea
        className="note-desc"
        rows={6}
        cols={40}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="note-actions flexbox">
        <button className="add-note-btn" onClick={() => onSave(text.trim())}>
          Add
        </button>
        <button className="cancel-add-note" onClick={onClose}>
          Cancel
        </button>
      </div>
    </NativePopover>
  );
}
