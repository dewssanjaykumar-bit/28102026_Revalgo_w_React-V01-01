const IMG = "../../src/assets/images";
const IGNORE_ROW_CLICK =
  "input, .open-suggested, .tag, .add-note-tip, .del-quote-btn, .undo-del-btn";

export default function ItemRow({
  line,
  index,
  selected,
  onSelect,
  onEdit,
  onToggleDetails,
  onDelete,
  onRestore,
  onOpenSuggested,
  onTagClick,
  onNoteClick,
}) {
  const total = (Number(line.sellingPrice) || 0) * (Number(line.qty) || 0);

  return (
    <tr
      data-uid={line.uid}
      className={line.deleted ? "deleted" : ""}
      onClick={(e) => {
        if (!e.target.closest(IGNORE_ROW_CLICK)) onToggleDetails(line.uid);
      }}
    >
      <td className="checkbox">
        <input
          type="checkbox"
          checked={selected}
          disabled={line.deleted}
          onChange={() => onSelect(line.uid)}
        />
      </td>
      <td className="item-no">{index + 1}</td>
      <td>
        <input
          type="number"
          min="1"
          className="num"
          value={line.qty}
          onChange={(e) => onEdit(line.uid, "qty", e.target.value)}
        />
      </td>
      <td>
        <div className="item-desc">{line.itemDesc}</div>
        <div className="flexbox">
          <img
            src={`${IMG}/Order Pad/caret.svg`}
            className="open-suggested"
            alt=""
            onClick={(e) => {
              e.stopPropagation();
              onOpenSuggested(line.uid, e.clientX, e.clientY);
            }}
          />
          <a
            href="#"
            className="product-id"
            onClick={(e) => e.preventDefault()}
          >
            {line.productId}
          </a>
          <span
            className="tag"
            onClick={(e) => {
              e.stopPropagation();
              onTagClick(line.uid, e.clientX, e.clientY);
            }}
          >
            {line.tag}
          </span>
          {line.source && (
            <span className="source-tag">
              <div>
                {line.source.pid}{" "}
                <span
                  className={`stock-status ${line.source.inStock ? "green" : "red"}`}
                >
                  {line.source.inStock ? "S" : "NS"}
                </span>{" "}
              </div>
            </span>
          )}
          <span className="brand">
            - <i>Kanebridge</i>
          </span>
        </div>
        <div className="text-muted">{line.desc}</div>
      </td>
      <td className="score">{line.score}%</td>
      <td>{line.available}</td>
      <td className="money">
        ${" "}
        <input
          type="number"
          min="0"
          className="unit-cost num"
          value={line.unitCost}
          onChange={(e) => onEdit(line.uid, "unitCost", e.target.value)}
        />
      </td>
      <td className="percent">
        <input
          type="number"
          min="0"
          step="0.1"
          className="margin num"
          value={line.margin}
          onChange={(e) => onEdit(line.uid, "margin", e.target.value)}
        />{" "}
        %
      </td>
      <td>
        ${" "}
        <input
          type="number"
          min="0"
          disabled
          className="selling-price num"
          value={Number(line.sellingPrice).toFixed(2)}
          readOnly
        />
      </td>
      <td className="total-cost" style={{ borderRight: "1px solid white" }}>
        $ {total.toFixed(2)}
      </td>
      <td>
        <img
          src={`${IMG}/Create/delete_icon.png`}
          className="del-quote-btn"
          alt=""
          onClick={() => onDelete(line.uid, index + 1)}
        />
        <img
          src={`${IMG}/Dashboard/Undo_icon.svg`}
          className={`undo-del-btn ${line.deleted ? "active" : ""}`}
          alt=""
          onClick={() => onRestore(line.uid)}
        />
        <span
          className={`add-note-tip ${line.note?.trim() ? "note-added" : ""}`}
          onClick={() => onNoteClick(line.uid)}
        ></span>
      </td>
    </tr>
  );
}
