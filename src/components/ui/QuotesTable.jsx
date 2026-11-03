const MODE_ICONS = {
  call: "../src/assets/images/Dashboard/Call_icon.svg",
  email: "../src/assets/images/Dashboard/Email_icon.svg",
  erp: "../src/assets/images/Dashboard/ERP_icon.svg",
};

const COLUMNS = [
  { key: "quoteId", label: "Quote Id" },
  { key: "customerName", label: "Customer Name / Number" },
  { key: "receivedDate", label: "Received Date" },
  { key: "approvedDate", label: "Approved Date" },
  { key: "status", label: "Status" },
  { key: "totalLineNo", label: "Total Line No" },
  { key: "totalPrice", label: "Total Price" },
];

export default function QuotesTable({
  rows,
  sort,
  onSort,
  onRowClick,
  wrapper = true,
}) {
  const table = (
    <div className="table-container">
      <table className="quotes-table" cellSpacing="2">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key}>
                <div data-sort={col.key} onClick={() => onSort(col.key)}>
                  <span>{col.label}</span>
                  <img
                    src="../src/assets/images/Dashboard/Sort_icon.png"
                    alt=""
                    className={`sort ${sort.key === col.key && sort.dir === "desc" ? "reverse" : ""}`}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((q) => {
            const status = q.status.toLowerCase();
            return (
              <tr key={q.quoteId} onClick={() => onRowClick(q.quoteId)}>
                <td>
                  <div className="id-cell">
                    <img src={MODE_ICONS[q.mode.toLowerCase()]} alt="" />
                    <span className="quote-id">{q.quoteId}</span>
                  </div>
                </td>
                <td>
                  {q.customerName} / <br /> {q.contactNumber}
                </td>
                <td>{q.receivedDate}</td>
                <td>{status === "pending" ? "--" : q.approvedDate}</td>
                <td className={`status ${status}`}>{q.status}</td>
                <td>{q.totalLineNo}</td>
                <td>${q.totalPrice}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return wrapper ? <section className="results-table">{table}</section> : table;
}
