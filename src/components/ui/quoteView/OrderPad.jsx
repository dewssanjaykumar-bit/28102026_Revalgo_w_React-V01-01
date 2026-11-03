import { useState } from "react";
import AdditionalInfoModal from "./AdditionalInfoModal.jsx";

const IMG = "../src/assets/images";
const ATTACHMENTS = ["Img23.jpg", "Img23.jpg"];

export default function OrderPad() {
  const [tab, setTab] = useState("email"); 
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeAttachment, setActiveAttachment] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const fileName = activeAttachment !== null ? ATTACHMENTS[activeAttachment] : "";

  return (
    <section className={`order-pad ${collapsed ? "collapsed" : ""} ${expanded ? "expanded" : ""}`}>
      <div className="order-header flex-between">
        <ul className="tabs flexbox">
          <li className={`tab-item quick-order ${tab === "email" ? "active" : ""}`} onClick={() => setTab("email")}>
            Email
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

      <div className={`email-container ${tab === "email" ? "show" : ""}`}>
        <h2 className="email-header">Quote test #6295478644</h2>
        <p className="client-mail-id">Info@astral.com</p>
        <div className="email-meta flex-between">
          <p className="service-mail-id">To: &nbsp; Sales@revalgo.com</p>
          <p className="sent-date">Wed 5/18/2022 4:41 PM</p>
        </div>

        <div className="attachments flexbox">
          {ATTACHMENTS.map((name, i) => (
            <button
              key={i}
              className={`attachment flexbox ${activeAttachment === i ? "active" : ""}`}
              onClick={() => setActiveAttachment(i)}
            >
              <img src={`${IMG}/Dashboard/JPG_icon.png`} alt="" className="jpg-icon" />
              <span>{name}</span>
              <img src={`${IMG}/Dashboard/Download_icon.png`} alt="" className="download-icon" />
            </button>
          ))}
        </div>

        <div className={`img-view ${activeAttachment !== null ? "show" : ""}`}>
          <div className="img-header flex-between">
            <span>{fileName}</span>
            <div className="action-btns flexbox">
              <img src={`${IMG}/Order Pad/info_added _icon.png`} alt="" className="info-icon" onClick={() => setInfoOpen(true)} />
              <img
                src={`${IMG}/Order Pad/image_close icon.png`}
                alt=""
                className="img-close-icon"
                onClick={() => setActiveAttachment(null)}
              />
            </div>
          </div>
          <div className="file-preview-wrapper">
            <img src={`${IMG}/Order Pad/Email pad_aatchement img File.png`} alt="" className="file-preview" />
          </div>
        </div>

        <div className={`email-body ${activeAttachment !== null ? "hide" : ""}`}>
          <p>Hi,</p>
          <p>Please find the order below:</p>
          <ol className="prods-list">
            <li>1 Inch PVC conduit</li>
            <li>5 Inch Plastic Plain conduit</li>
            <li>1-1/2 Aluminium conduit</li>
            <li>2-1/2 Aluminium conduit</li>
          </ol>
          <p>
            King Regards,
            <br />
            Kevin.
          </p>
        </div>
      </div>

      <div className={`upload-section ${tab === "upload" ? "show" : ""}`}>
        <button className="select-files-btn">SELECT FILES</button>
        <p className="files-supported">Files Supported: PDF, XLSX, Image</p>

        <UploadedItem ok />
        <UploadedItem />

        <button className="upload-btn">Upload</button>
      </div>

      <button
        className={`collapse-btn ${collapsed ? "active" : ""}`}
        onClick={() => {
          setCollapsed((c) => !c);
          setExpanded(false);
        }}
      >
        <img src={`${IMG}/Dashboard/angle.svg`} alt="" />
      </button>

      <AdditionalInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} fileName={fileName} />
    </section>
  );
}

function UploadedItem({ ok }) {
  return (
    <div className="uploaded-item">
      <div className="file-info flexbox">
        <img src={`${IMG}/Create/emil pad_Pdf icon.png`} alt="" className="file-icon" />
        <span>Client 123 Proposal.pdf (2.1 MB)</span>
        <button className="file-delete-btn">
          <img src={`${IMG}/Create/delete_icon.png`} alt="" className="delete-icon" />
        </button>
      </div>
      <div className="upload-status flexbox">
        <img src={`${IMG}/Create/${ok ? "Uploaded_icon" : "Error_icon"}.png`} alt="" className="status-icon" />
        <p>
          {ok ? (
            <>
              <span style={{ color: "rgb(1, 158, 1)" }}>Uploaded</span> Client 123 Proposal.pdf
            </>
          ) : (
            <>
              <span style={{ color: "red" }}>Error</span>: Format is not supported
            </>
          )}
        </p>
      </div>
    </div>
  );
}
