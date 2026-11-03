import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { sourcingOptions } from "../../../data/products.js";

export default function SourcingPopover({ anchor, onPick, onClose }) {
  const ref = useRef(null);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState();

  useLayoutEffect(() => {
    if (!anchor) return;
    const top =
      250 + anchor.y > window.innerHeight ? anchor.y / 1.5 - 20 : anchor.y;
    setPosition({ left: anchor.x + 20, top });
  }, [anchor]);

  useEffect(() => {
    if (anchor) setQuery("");
  }, [anchor]);

  useEffect(() => {
    if (!anchor) return;
    const onDocClick = (e) => {
      if (!ref.current?.contains(e.target)) onClose();
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [anchor, onClose]);

  const items = sourcingOptions.filter((o) =>
    o.id.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      id="productPopover"
      ref={ref}
      className={`products-popover ${anchor ? "active" : ""}`}
      style={position}
    >
      <div className="header">
        <input
          type="text"
          placeholder="Search"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <h3 className="title">Suggested Product</h3>

      <ul className="list">
        {items.length === 0 ? (
          <li className="item desc">No products found!</li>
        ) : (
          items.map((o) => (
            <li key={o.id} className="item" onClick={() => onPick(o)}>
              <p className="id">
                {o.id}{" "}
                <span
                  className={`prod-tag ${o.inStock ? "success" : "danger"}`}
                >
                  {o.inStock ? "S" : "NS"}
                </span>
              </p>
              <p className="score">
                Score <b>{o.score}%</b>
              </p>
              <p className="desc">{o.desc}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
