export default function AddLineButton({ bottom, onClick }) {
  return (
    <div
      className={`click-to-add-btn ${bottom ? "bottom" : ""}`}
      onClick={onClick}
    >
      <img
        src="../../src/assets/images/Create/click here to add item_icon.png"
        alt=""
      />
      {!bottom && <p>Click here to Add Item</p>}
    </div>
  );
}
