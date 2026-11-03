import { useEffect, useRef, useState } from "react";
import NativePopover from "../NativePopover.jsx";
import { suggestedProducts } from "../../../data/products.js";

function ProductList({ query, onPick }) {
  const term = query.trim().toLowerCase();
  const items = suggestedProducts.filter(
    (p) => !term || p.product_id.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term)
  );

  return (
    <div className="product-list">
      {items.map((p) => (
        <div className="product-item" key={p.product_id} onClick={() => onPick(p)}>
          <div className="product-title">
            <span className="product-id">{p.product_id}</span>
            <span className="product-price">— ${p.selling_price.toFixed(2)}</span>
          </div>
          <div className="product-meta">
            <span>
              Available Qty <strong>{p.available}</strong>
            </span>
            <span>
              Score <strong>{p.score}%</strong>
            </span>
          </div>
          <p className="product-desc">{p.desc}</p>
        </div>
      ))}
      {items.length === 0 && <p className="product-desc">No products found!</p>}
    </div>
  );
}

export default function SuggestedProducts({
  small,
  expandedOpen,
  modalMode, 
  onPick,
  onExpand,
  onCloseSmall,
  onCloseExpanded,
}) {
  const smallRef = useRef(null);
  const [smallQuery, setSmallQuery] = useState("");
  const [expandedQuery, setExpandedQuery] = useState("");

  useEffect(() => {
    if (small) setSmallQuery("");
  }, [small]);

  useEffect(() => {
    if (expandedOpen) setExpandedQuery("");
  }, [expandedOpen]);

  useEffect(() => {
    if (!small) return;
    const onDocClick = (e) => {
      if (!smallRef.current?.contains(e.target)) onCloseSmall();
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [small, onCloseSmall]);

  let style;
  if (small) {
    const top = small.y + window.innerHeight * 0.3 + 2 > window.innerHeight ? small.y / 1.5 : small.y;
    style = { left: small.x + 20, top };
  }

  return (
    <>
      <div ref={smallRef} className={`suggested-prods-small ${small ? "active" : ""}`} id="suggestedProdsSmall" style={style}>
        <div className="modal-header">
          <h2>Suggested Product</h2>
          <button className="expand-popover-btn" onClick={onExpand}>
            <img src="../../src/assets/images/Dashboard/Email pad_Expand_icon.png" alt="" />
          </button>
        </div>
        <input
          type="text"
          className="search-bar"
          id="suggestedSmallSearch"
          placeholder="Search"
          value={smallQuery}
          onChange={(e) => setSmallQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        />
        <ProductList query={smallQuery} onPick={onPick} />
      </div>

      <NativePopover
        id="suggestedProducts"
        className={`suggested-popover ${modalMode ? "toggleAddItems" : ""}`}
        open={expandedOpen}
        onClose={onCloseExpanded}
      >
        <div className="modal-header">
          <h2>Suggested Product</h2>
          <button className="close-btn" onClick={onCloseExpanded}>
            &times;
          </button>
        </div>
        <input
          type="text"
          className="search-bar"
          id="suggestedExpandedSearch"
          placeholder="Search"
          value={expandedQuery}
          onChange={(e) => setExpandedQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        />
        <ProductList query={expandedQuery} onPick={onPick} />
      </NativePopover>
    </>
  );
}
