function TopTransactionsTable({ showMore = false }) {
  return (
    <div className="top-trans-table">
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Verizon Communications</td>
            <td>02-04-2024</td>
            <td>$ 450</td>
          </tr>
          <tr>
            <td>McKesson Corporation</td>
            <td>04-14-2024</td>
            <td>$ 320</td>
          </tr>
          <tr>
            <td>AmerisourceBergen</td>
            <td>02-24-2025</td>
            <td>$ 300</td>
          </tr>
          <tr>
            <td>Lumen Technologies</td>
            <td>04-18-2025</td>
            <td>$ 280</td>
          </tr>
          <tr>
            <td>Verizon Communications</td>
            <td>02-04-2024</td>
            <td>$ 450</td>
          </tr>
          {showMore && (
            <>
              <tr>
                <td>McKesson Corporation</td>
                <td>04-14-2024</td>
                <td>$ 320</td>
              </tr>
              <tr>
                <td>AmerisourceBergen</td>
                <td>02-24-2025</td>
                <td>$ 300</td>
              </tr>
              <tr>
                <td>Lumen Technologies</td>
                <td>04-18-2025</td>
                <td>$ 280</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function TopTransactions({ onViewMore, viewMore }) {
  if (viewMore) {
    return <TopTransactionsTable showMore={viewMore} />;
  }
  return (
    <div className="top-transactions">
      <div
        className="panel-header flex-between"
        onClick={(e) => e.currentTarget.classList.toggle("active")}
      >
        <h2 className="flex-center top-trans-header">
          <img
            src="../src/assets/images/Dashboard/down-arr.svg"
            alt=""
            className="arrow-down"
          />
          Top Transactions
        </h2>
        <span
          className="view-more"
          data-target="top-transactions"
          onClick={(e) => {
            e.stopPropagation();
            onViewMore("top-transactions");
          }}
          style={{ cursor: "pointer" }}
        >
          View More
        </span>
      </div>
      <TopTransactionsTable />
    </div>
  );
}
