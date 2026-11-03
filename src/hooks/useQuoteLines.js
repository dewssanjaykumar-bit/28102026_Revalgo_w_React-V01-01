import { useReducer } from "react";

const reprice = (l) => ({
  ...l,
  sellingPrice: (Number(l.unitCost) || 0) * (1 + (Number(l.margin) || 0) / 100),
});

function reducer(state, a) {
  switch (a.type) {
    case "add":
      return [...state, ...a.lines];
    case "edit": // field: qty | unitCost | margin
      return state.map((l) =>
        l.uid !== a.uid ? l : a.field === "qty" ? { ...l, qty: a.value } : reprice({ ...l, [a.field]: a.value })
      );
    case "apply": // suggested product chosen for a row
      return state.map((l) =>
        l.uid !== a.uid
          ? l
          : reprice({
              ...l,
              productId: a.product.product_id,
              desc: a.product.desc,
              score: a.product.score,
              available: a.product.available,
              unitCost: a.product.selling_price, // original treats the displayed price as unit cost
            })
      );
    case "setDeleted":
      return state.map((l) => (a.uids.includes(l.uid) ? { ...l, deleted: a.deleted } : l));
    case "move": {
      const next = [...state];
      const [item] = next.splice(a.from, 1);
      next.splice(a.to, 0, item);
      return next;
    }
    case "note":
      return state.map((l) => (l.uid === a.uid ? { ...l, note: a.note } : l));
    case "source":
      return state.map((l) => (l.uid === a.uid ? { ...l, source: a.source } : l));
    default:
      return state;
  }
}

export default function useQuoteLines(init) {
  const [lines, dispatch] = useReducer(reducer, null, init);
  return { lines, dispatch };
}
