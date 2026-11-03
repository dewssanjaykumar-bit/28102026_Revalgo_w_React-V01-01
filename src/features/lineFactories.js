export const newUid = () => crypto.randomUUID();

const base = { tag: "tyd14xlp6", deleted: false, note: "", source: null };

export function lineFromQuoteProduct(p) {
  return {
    ...base,
    uid: newUid(),
    qty: p.qty,
    productId: p.requested,
    itemDesc: "Lorem ipsum dolor sit.",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    score: p.score,
    available: p.available,
    unitCost: Number(p.unit_cost),
    margin: Number(p.margin),
    sellingPrice: Number(p.selling_Price),
  };
}

export function lineFromProduct(prod, qty) {
  return {
    ...base,
    uid: newUid(),
    qty,
    productId: prod.product_id,
    itemDesc: prod.desc,
    desc: prod.desc,
    score: prod.score,
    available: prod.available,
    unitCost: Number(prod.unit_cost),
    margin: prod.margin,
    sellingPrice: Number(prod.selling_price),
  };
}

export function lineFromModalRow(r) {
  return {
    ...base,
    uid: newUid(),
    qty: Number(r.qty) || 0,
    productId: r.productId,
    itemDesc: r.desc,
    desc: r.desc,
    score: r.score,
    available: r.available,
    unitCost: Number(r.cost),
    margin: Number(r.margin),
    sellingPrice: Number(r.selling),
  };
}

export function linesFromQuote(quote, importedIds) {
  const products = quote.quote_details.products;
  if (importedIds?.length) {
    const picked = products.filter((p) => importedIds.includes(p.requested));
    if (picked.length === 0) return [];
    return Array.from({ length: importedIds.length }, (_, i) =>
      lineFromQuoteProduct(picked[i % picked.length])
    );
  }
  return Array.from({ length: Number(quote.totalLineNo) }, (_, i) =>
    lineFromQuoteProduct(products[i % products.length])
  );
}
