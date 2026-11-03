const SPECS = [
  ["Wire Size", "12 AWG"],
  ["Material", "Polypropylene"],
  ["Specifications", "#10 Fork Terminal"],
  ["Dimensions", "1-1/2 in L"],
  ["Housing material", "Steel"],
  ["Number of outlets", "1"],
  ["Brand", "KaneBridge"],
  ["Type", "Standard"],
];

export default function ProductPreviewRow() {
  return (
    <tr className="prod-preview" style={{ pointerEvents: "none" }}>
      <td colSpan={11}>
        <div className="product-panel flexbox">
          <div className="left">
            <img src="../../src/assets/images/Create/Product img.png" alt="Product" className="prod-img" />
            <div className="description">
              <h3>Description</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore.
              </p>
            </div>
          </div>
          <div className="specs">
            <h3>Specifications</h3>
            <div className="spec-grid">
              {SPECS.map(([label, value]) => (
                <div className="spec-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
