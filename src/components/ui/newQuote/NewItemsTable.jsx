import { useEffect, useRef } from "react";
import Sortable from "sortablejs";
import ItemRow from "./ItemRow.jsx";
import ProductPreviewRow from "./ProductPreviewRow.jsx";
import AddLineButton from "./AddLineButton.jsx";

export default function NewItemsTable({
  lines,
  selected,
  expandedUid,
  onSelect,
  onSelectAll,
  onEdit,
  onToggleDetails,
  onCloseDetails,
  onMove,
  onDelete,
  onRestore,
  onDeleteSelected,
  onOpenSuggested,
  onTagClick,
  onNoteClick,
  onAddItem,
}) {
  const bodyRef = useRef(null);
  const latest = useRef({});
  latest.current = { onMove, onCloseDetails };

  const active = lines.filter((l) => !l.deleted);
  const allChecked =
    active.length > 0 && active.every((l) => selected.has(l.uid));
  const anyChecked = active.some((l) => selected.has(l.uid));

  useEffect(() => {
    const sortable = Sortable.create(bodyRef.current, {
      animation: 150,
      ghostClass: "ghost",
      draggable: "tr[data-uid]",
      filter: "input",
      preventOnFilter: false,
      onStart: () => latest.current.onCloseDetails(),
      onEnd: ({ item, from, oldIndex, newIndex }) => {
        if (oldIndex === newIndex) return;
        item.remove();
        const rows = [...from.children].filter((el) => el.dataset.uid);
        from.insertBefore(item, rows[oldIndex] ?? null);
        latest.current.onMove(oldIndex, newIndex);
      },
    });
    return () => sortable.destroy();
  }, []);

  return (
    <>
      <section className="items-table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th className="checkbox">
                <input
                  type="checkbox"
                  id="check-all"
                  checked={allChecked}
                  onChange={(e) => onSelectAll(e.target.checked)}
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
              <th>
                <img
                  src="../../src/assets/images/Create/delete_icon.png"
                  alt=""
                  className={`del-selected-btn ${anyChecked ? "active" : ""}`}
                  onClick={onDeleteSelected}
                />
              </th>
            </tr>
          </thead>
          <tbody ref={bodyRef}>
            {lines.map((line, i) => (
              <RowWithPreview key={line.uid}>
                <ItemRow
                  line={line}
                  index={i}
                  selected={selected.has(line.uid)}
                  onSelect={onSelect}
                  onEdit={onEdit}
                  onToggleDetails={onToggleDetails}
                  onDelete={onDelete}
                  onRestore={onRestore}
                  onOpenSuggested={onOpenSuggested}
                  onTagClick={onTagClick}
                  onNoteClick={onNoteClick}
                />
                {expandedUid === line.uid && <ProductPreviewRow />}
              </RowWithPreview>
            ))}
          </tbody>
        </table>
        {lines.length === 0 && <AddLineButton onClick={onAddItem} />}
      </section>
      {lines.length > 0 && <AddLineButton bottom onClick={onAddItem} />}
    </>
  );
}

function RowWithPreview({ children }) {
  return <>{children}</>;
}
