import { useMemo, useState } from "react";

export default function ItemsTable({ quote, disabled }) {
  const lines = useMemo(() => {
    const products = quote.quote_details.products;
    return Array.from({ length: Number(quote.totalLineNo) }, (_, i) => products[i % products.length]);
  }, [quote]);

  const [checked, setChecked] = useState(() => lines.map(() => false));
  const allChecked = checked.length > 0 && checked.every(Boolean);

  const toggle = (index) => setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));

  return (
    <section
      className="items-table-container"
      style={disabled ? { opacity: 0.5, pointerEvents: "none" } : undefined}
    >
      <table className="items-table">
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
            <th>
              Requested / <span className="blue-th">Suggested Product</span>
            </th>
            <th>Score</th>
            <th>Available Qty</th>
            <th className="blue-th">Unit Cost</th>
            <th className="blue-th">Margin</th>
            <th>Selling Price</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((info, i) => (
            <tr key={i}>
              <td className="checkbox">
                <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} />
              </td>
              <td>{i + 1}</td>
              <td>
                <a href="#" className="qty-link" onClick={(e) => e.preventDefault()}>
                  {info.qty}
                </a>
              </td>
              <td>
                <div className="item-desc">Lorem ipsum dolor sit.</div>
                <div className="flexbox">
                  <img src="../src/assets/images/Order Pad/caret.svg" className="open-suggested" alt="" />
                  <a href="#" className="product-id" onClick={(e) => e.preventDefault()}>
                    {info.requested}
                  </a>
                  <span className="tag">tyd14xlp6</span>
                  <span className="brand">
                    - <i>Kanebridge</i>
                  </span>
                </div>
                <div className="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
              </td>
              <td>{info.score}</td>
              <td>{info.available}</td>
              <td className="money">$ {info.unit_cost}</td>
              <td className="percent">{info.margin}%</td>
              <td>{info.selling_Price}</td>
              <td className="bold">$ {info.total_cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
