import { useEffect, useState } from "react";
import { availableProducts, suggestedProducts } from "../../../data/products.js";
import { lineFromProduct } from "../../../features/lineFactories.js";

const emptyRows = () => Array.from({ length: 8 }, () => ({ qty: "", desc: "" }));

export default function QuickOrderTable({ show, onAddLines }) {
  const [rows, setRows] = useState(emptyRows);
  const [dd, setDd] = useState(null);

  useEffect(() => {
    const close = () => setDd(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const position = (input) => {
    const rect = input.getBoundingClientRect();
    let y = rect.bottom + 10;
    if (210 + rect.bottom > window.innerHeight) y = rect.bottom / 1.5 - 50;
    return { x: rect.left + 20, y };
  };

  const update = (i, patch) => setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const query = dd?.query.toLowerCase() ?? "";
  const matches = suggestedProducts.filter((p) => !query || p.desc.toLowerCase().includes(query));

  const upload = () => {
    const lines = [];
    const next = rows.map((r) => {
      const qty = Number(r.qty);
      const product = availableProducts.find((p) => p.desc === r.desc.trim());
      if (!qty || !product) return r;
      lines.push(lineFromProduct(product, qty));
      return { qty: "", desc: "" };
    });
    setRows(next);
    if (lines.length) onAddLines(lines);
  };

  return (
    <div className={`table-container ${show ? "show" : ""}`}>
      <table className="quick-order-table">
        <thead>
          <tr>
            <th>Qty</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <input type="number" min="0" value={row.qty} onChange={(e) => update(i, { qty: e.target.value })} />
              </td>
              <td>
                <input
                  type="text"
                  value={row.desc}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDd({ row: i, ...position(e.target), open: false, query: row.desc.trim() });
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    update(i, { desc: value });
                    setDd({ row: i, ...position(e.target), open: value.trim() !== "", query: value.trim() });
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="upload-btn" onClick={upload}>
        Upload
      </button>

      <ul
        id="productsDropdown"
        className={`products-dropdown ${dd?.open ? "active" : ""}`}
        style={dd ? { left: dd.x, top: dd.y } : undefined}
      >
        {matches.length === 0 ? (
          <div className="dropdown-item">
            <p>No products found!</p>
          </div>
        ) : (
          matches.map((p) => (
            <li
              key={p.product_id}
              className="dropdown-item"
              data-id={p.product_id}
              onClick={() => update(dd.row, { desc: p.desc })}
            >
              <p>{p.desc}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
