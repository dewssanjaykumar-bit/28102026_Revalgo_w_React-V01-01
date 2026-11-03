const EditIcon = () => (
  <span className="edit-icon">
    <img src="../../src/assets/images/Dashboard/Edit icon.png" alt="" />
  </span>
);

export function infoFromQuote(quote) {
  const d = quote.quote_details;
  return {
    billTo: { name: d.bill_To.company_name, address: d.bill_To.address },
    shipTo: { name: d.ship_to.company_name, address: d.ship_to.address },
    po: d.po_no,
    job: d.job_no,
    buyer: d.buyer,
    delivery: d.delivery_date,
    lines: quote.totalLineNo,
    total: `$ ${quote.totalPrice}`,
  };
}

export default function QuoteInfoCard({ info, hideEditable, disabled }) {
  const blocks = [
    { label: "Bill To", data: info.billTo.name, sub: info.billTo.address },
    {
      label: "Ship To",
      data: info.shipTo.name,
      sub: info.shipTo.address,
      editable: true,
    },
    { label: "PO No", data: info.po, editable: true, hideWhenApproved: true },
    { label: "Job No", data: info.job, editable: true, hideWhenApproved: true },
    {
      label: "Buyer",
      data: info.buyer,
      editable: true,
      hideWhenApproved: true,
    },
    {
      label: "Delivery Date",
      data: info.delivery,
      editable: true,
      hideWhenApproved: true,
    },
    { label: "# Lines", data: info.lines },
    { label: "Total Price", data: info.total },
  ];

  return (
    <div
      className="quote-info-card"
      style={disabled ? { opacity: 0.5, pointerEvents: "none" } : undefined}
    >
      {blocks.map((b) => (
        <div
          key={b.label}
          className="info-block"
          style={
            hideEditable && b.hideWhenApproved ? { display: "none" } : undefined
          }
        >
          <span className={`label ${b.editable ? "flexbox" : ""}`}>
            {b.label}
            {b.editable && <EditIcon />}
          </span>
          <span className="data">{b.data}</span>
          {b.sub && <span className="subtext">{b.sub}</span>}
        </div>
      ))}
    </div>
  );
}
