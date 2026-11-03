import { useState } from "react";
import ModalDialog from "../ModalDialog.jsx";
import AddQuoteIcon from "../../../assets/images/Create/click here to add item_icon.png";

const DEFAULT_ROW = {
  qty: 10,
  productId: "ID4321",
  desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  score: 93,
  available: 289,
  cost: 41.2,
  margin: 10,
  selling: 45.32,
};

export function applyProductToRow(row, p) {
  const cost = p.selling_price;
  return {
    ...row,
    productId: p.product_id,
    desc: p.desc,
    score: p.score,
    available: p.available,
    cost,
    selling: (cost * (1 + (Number(row.margin) || 0) / 100)).toFixed(2),
  };
}

export function useAddItemRows() {
  const [rows, setRows] = useState([DEFAULT_ROW]);
  const patch = (i, p) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...p } : r)));
  return {
    rows,
    patch,
    reset: () => setRows([DEFAULT_ROW]),
    duplicate: (i) =>
      setRows((prev) => {
        const next = [...prev];
        next.splice(i + 1, 0, { ...prev[i] });
        return next;
      }),
    apply: (i, product) =>
      setRows((prev) =>
        prev.map((r, idx) => (idx === i ? applyProductToRow(r, product) : r)),
      ),
  };
}

export default function AddItemModal({
  open,
  state,
  onClose,
  onAdd,
  onOpenSuggested,
}) {
  const { rows, patch, duplicate } = state;

  const onMargin = (i, value) => {
    const cost = Number(rows[i].cost) || 0;
    patch(i, {
      margin: value,
      selling: (cost * (1 + (Number(value) || 0) / 100)).toFixed(2),
    });
  };
  const onSelling = (i, value) => {
    const cost = Number(rows[i].cost) || 0;
    patch(i, {
      selling: value,
      margin: cost
        ? ((Number(value) / cost - 1) * 100).toFixed(2)
        : rows[i].margin,
    });
  };

  return (
    <ModalDialog
      className="add-items-modal"
      open={open}
      onCancel={onClose}
      onBackdropClick={onClose}
    >
      <div className="modal-header flex-between">
        <h1>Add Item</h1>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
      <table className="modal-items-table">
        <thead>
          <tr>
            <th className="blue-th">Qty Requested</th>
            <th>Product ID</th>
            <th>Score</th>
            <th>Available Qty</th>
            <th>Cost</th>
            <th className="blue-th">Margin</th>
            <th className="blue-th">Selling Price</th>
            <th>Total Cost</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const total = (Number(r.selling) || 0) * (Number(r.qty) || 0);
            return (
              <tr key={i}>
                <td className="modal-qty-req">
                  <input
                    type="number"
                    className="num qty-req"
                    value={r.qty}
                    onChange={(e) => patch(i, { qty: e.target.value })}
                  />
                </td>
                <td>
                  <div className="prod-info flexbox">
                    <img
                      src="../../../src/assets/images/Order Pad/caret.svg"
                      className="open-suggested-modal"
                      alt=""
                      onClick={() => onOpenSuggested(i)}
                    />
                    <div className="modal-prod-id">{r.productId}</div>
                    <div className="modal-prod-desc">{r.desc}</div>
                  </div>
                </td>
                <td className="modal-score">{r.score}%</td>
                <td className="modal-available-qty">{r.available}</td>
                <td>
                  ${" "}
                  <span className="modal-cost">
                    {Number(r.cost).toFixed(2)}
                  </span>
                </td>
                <td className="modal-margin">
                  <input
                    type="number"
                    className="num"
                    value={r.margin}
                    onChange={(e) => onMargin(i, e.target.value)}
                  />{" "}
                  %
                </td>
                <td className="modal-selling-price">
                  ${" "}
                  <input
                    type="number"
                    className="num"
                    value={r.selling}
                    onChange={(e) => onSelling(i, e.target.value)}
                  />
                </td>
                <td className="modal-total-price">
                  $ {isFinite(total) ? total.toFixed(2) : "0.00"}
                </td>
                <td>
                  <img
                    src={AddQuoteIcon}
                    alt=""
                    className="modal-add-row-button"
                    onClick={() => duplicate(i)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="action-btns flexbox">
        <button className="add-item-btn" onClick={() => onAdd(rows)}>
          Add
        </button>
        <button className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </ModalDialog>
  );
}
