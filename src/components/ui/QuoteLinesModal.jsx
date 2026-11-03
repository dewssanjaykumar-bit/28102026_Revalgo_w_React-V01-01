import { useEffect, useMemo, useRef, useState } from "react";

export default function QuoteLinesModal({ quote, onClose, onImport }) {
  const dialogRef = useRef(null);

  const lines = useMemo(() => {
    const products = quote.quote_details.products;
    return Array.from({ length: Number(quote.totalLineNo) }, (_, i) => ({
      lineNo: i + 1,
      ...products[i % products.length],
    }));
  }, [quote]);

  const [checked, setChecked] = useState(() => lines.map(() => false));
  const allChecked = checked.length > 0 && checked.every(Boolean);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const toggle = (index) =>
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));

  return (
    <dialog ref={dialogRef} className="quote-lines-modal" onClose={onClose}>
      <div className="modal-header flex-between">
        <h1>
          Select line items to import from Existing Quote ID "
          <span className="clicked-quote-id">{quote.quoteId}</span>"
        </h1>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
      </div>

      <table className="lines-table">
        <thead>
          <tr>
            <th className="checkbox">
              <input
                type="checkbox"
                id="check-all"
                checked={allChecked}
                onChange={(e) => setChecked(lines.map(() => e.target.checked))}
              />
            </th>
            <th>Line No</th>
            <th className="blue-th">Qty Requested</th>
            <th>Requested Product</th>
            <th>Suggested Product Id</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, i) => (
            <tr key={line.lineNo}>
              <td className="checkbox">
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={() => toggle(i)}
                />
              </td>
              <td>{line.lineNo}</td>
              <td>{line.qty}</td>
              <td>
                <div className="item-desc">Lorem ipsum dolor sit.</div>
              </td>
              <td>
                <a
                  href="#"
                  className="prod-id"
                  onClick={(e) => e.preventDefault()}
                >
                  {line.requested}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="action-btns flexbox">
        <button
          className="import-btn"
          onClick={() =>
            onImport(
              lines
                .filter((_, i) => checked[i])
                .map(({ lineNo, ...product }) => product),
            )
          }
        >
          Import
        </button>
        <button className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </dialog>
  );
}
