import { useState } from "react";
import QuickOrderTable from "./QuickOrderTable.jsx";
import UploadSection from "./UploadSection.jsx";

const IMG = "../../src/assets/images";

export default function NewOrderPad({ onAddLines }) {
  const [tab, setTab] = useState("quick");
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={`order-pad ${collapsed ? "collapsed" : ""} ${expanded ? "expanded" : ""}`}>
      <div className="order-header flex-between">
        <ul className="tabs flexbox">
          <li
            className={`tab-item quick-order ${tab === "quick" ? "active" : ""}`}
            data-target="quick-order"
            onClick={() => setTab("quick")}
          >
            Quick Order
          </li>
          <li className={`tab-item upload ${tab === "upload" ? "active" : ""}`} onClick={() => setTab("upload")}>
            Upload
          </li>
        </ul>
        <button className={`expand-btn ${expanded ? "hide" : ""}`} onClick={() => setExpanded(true)}>
          <img src={`${IMG}/Dashboard/Email pad_Expand_icon.png`} alt="" />
        </button>
        <button className={`order-pad-collapse-btn ${expanded ? "" : "hide"}`} onClick={() => setExpanded(false)}>
          <img src={`${IMG}/Order Pad/Collapse_icon.png`} alt="" />
        </button>
      </div>

      <QuickOrderTable show={tab === "quick"} onAddLines={onAddLines} />
      <UploadSection show={tab === "upload"} onAddLines={onAddLines} />

      <button
        className={`collapse-btn ${collapsed ? "active" : ""}`}
        onClick={() => {
          setCollapsed((c) => !c);
          setExpanded(false);
        }}
      >
        <img src={`${IMG}/Dashboard/angle.svg`} alt="" />
      </button>
    </section>
  );
}
