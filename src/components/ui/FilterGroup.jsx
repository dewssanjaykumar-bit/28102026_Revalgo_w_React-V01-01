import { useState } from "react";

export default function FilterGroup({ title, className = "", titleClass = "", bodyClass = "", actions, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <li className={`filter-group ${className}`}>
      <div
        className={`filter-title ${titleClass} ${collapsed ? "collapsed" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setCollapsed((c) => !c);
        }}
      >
        <span>
          <span className="accord-status">{collapsed ? "+" : "-"}</span> {title}
        </span>
        {actions}
      </div>
      <div className={`filter-body ${bodyClass} ${collapsed ? "collapsed" : ""}`}>{children}</div>
    </li>
  );
}
