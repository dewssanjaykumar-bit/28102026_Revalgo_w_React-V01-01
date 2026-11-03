export default function TableSearchBar({ value, onChange }) {
  return (
    <div className="table-search-bar flex-between">
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <img
        src="/assets/images/Dashboard/Search icon.png"
        alt=""
        className="search-icon"
      />
    </div>
  );
}
