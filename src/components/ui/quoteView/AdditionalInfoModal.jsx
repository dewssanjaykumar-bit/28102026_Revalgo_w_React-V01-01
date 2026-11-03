import { useState } from "react";
import ModalDialog from "../ModalDialog.jsx";

const INITIAL_FIELDS = [
  { label: "Alternate", value: "Ricky 516-353-9794", selected: true },
  { label: "Bill To Job", value: "2707", selected: false },
  { label: "Booked Dock Time Delivery Needed", value: "7-7:30 AM DELIVERY WINDOW", selected: true },
  { label: "Contact Info", value: "Bob Driscoll (718)825-1659", selected: false },
  { label: "Delivery Date", value: "3/30/2017", selected: true },
  { label: "Delivery Time", value: "By 7 AM", selected: true },
  { label: "Ship Via", value: "-", selected: false },
  { label: "Order Date", value: "3/30/2017", selected: false },
  { label: "Order Number", value: "007484", selected: true },
  { label: "Deliver to", value: "2707- Brightstar... (address)", selected: false },
  { label: "Delivery Date", value: "Monarch Electric Company Lock Box...", selected: false },
  { label: "Work For", value: "Structure Tone, Inc... (address)", selected: false },
];

export default function AdditionalInfoModal({ open, onClose, fileName }) {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const selectedCount = fields.filter((f) => f.selected).length;
  const allSelected = selectedCount === fields.length;

  const toggle = (index) =>
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, selected: !f.selected } : f)));

  return (
    <ModalDialog className="ad-info-modal" open={open} onClose={onClose}>
      <div className="modal-header flex-between">
        <div className="modal-title">
          Additional Information ({selectedCount}/{fields.length}) <br />
          <div className="file">File Name: {fileName}</div>
        </div>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>

      <label className="select-all">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => setFields((prev) => prev.map((f) => ({ ...f, selected: e.target.checked })))}
        />{" "}
        Select All
      </label>

      <div className="grid">
        {fields.map((field, i) => (
          <div key={i} className={`field-box ${field.selected ? "selected" : ""}`} onClick={() => toggle(i)}>
            <input type="checkbox" className="checkbox" checked={field.selected} onChange={() => {}} />
            <div className="field-label">{field.label}</div>
            <div className="field-value">{field.value}</div>
          </div>
        ))}
      </div>

      <div className="modal-footer flexbox">
        <button className="btn update" onClick={onClose}>
          Update
        </button>
        <button className="btn cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </ModalDialog>
  );
}
