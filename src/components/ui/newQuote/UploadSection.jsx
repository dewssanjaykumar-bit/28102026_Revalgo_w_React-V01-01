import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { availableProducts } from "../../../data/products.js";
import { lineFromProduct } from "../../../features/lineFactories.js";

const IMG = "../../src/assets/images/Create";

function parseWorkbook(buffer) {
  const workbook = XLSX.read(buffer, { type: "array" });
  const rows = XLSX.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]],
  );
  const valid = [];
  let invalid = 0;

  rows.forEach((row) => {
    const qty = row.qty ?? row.QTY ?? row.Quantity;
    const desc = row.description ?? row.desc ?? row.Description;
    if (!qty || isNaN(qty) || !desc || typeof desc !== "string")
      return invalid++;
    const product = availableProducts.find(
      (p) => p.desc.toLowerCase().trim() === desc.toLowerCase().trim(),
    );
    if (!product) return invalid++;
    valid.push({ qty: Number(qty), product });
  });
  return { valid, invalid };
}

export default function UploadSection({ show, onAddLines }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const id = crypto.randomUUID();
    const reader = new FileReader();

    reader.onload = (evt) => {
      let entry;
      try {
        const { valid, invalid } = parseWorkbook(evt.target.result);
        entry =
          invalid > 0
            ? {
                status: "error",
                message: `Parsed with ${invalid} invalid row(s)`,
                valid,
              }
            : { status: "success", message: "File parsed successfully", valid };
      } catch {
        entry = {
          status: "error",
          message: "Couldn't read the file",
          valid: [],
        };
      }
      setFiles((prev) => [...prev, { id, name: file.name, sizeMB, ...entry }]);
    };
    reader.readAsArrayBuffer(file);
  };

  const validCount = files.reduce((n, f) => n + f.valid.length, 0);

  const upload = () => {
    onAddLines(
      files.flatMap((f) =>
        f.valid.map((v) => lineFromProduct(v.product, v.qty)),
      ),
    );
    setFiles([]);
  };

  return (
    <div className={`upload-section ${show ? "show" : ""}`}>
      <button
        className="select-files-btn"
        onClick={() => inputRef.current.click()}
      >
        SELECT FILES
      </button>
      <input
        type="file"
        id="excelInput"
        accept=".xlsx,.xls"
        hidden
        ref={inputRef}
        onChange={handleFile}
      />
      <p className="files-supported">Files Supported: PDF, XLSX, Image</p>

      <div className="uploaded-item">
        {files.map((f) => (
          <div key={f.id} className="uploaded-item uploaded-file">
            <div className="file-info flexbox">
              <img
                src={`${IMG}/emil pad_Pdf icon.png`}
                className="file-icon"
                alt=""
              />
              <span>
                {f.name} {f.sizeMB}MB
              </span>
              <button
                className="file-delete-btn"
                onClick={() =>
                  setFiles((prev) => prev.filter((x) => x.id !== f.id))
                }
              >
                <img
                  src={`${IMG}/delete_icon.png`}
                  className="delete-icon"
                  alt=""
                />
              </button>
            </div>
            <div className={`upload-status flexbox ${f.status}`}>
              <img
                src={`${IMG}/${f.status === "error" ? "Error_icon" : "Uploaded_icon"}.png`}
                className="status-icon"
                alt=""
              />
              <p>
                {f.status === "error" ? (
                  <>
                    <span style={{ color: "red" }}>Error</span>: {f.message}
                  </>
                ) : (
                  <>
                    <span style={{ color: "rgb(1,158,1)" }}>Uploaded</span>{" "}
                    {f.message}
                  </>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="upload-btn"
        disabled={validCount === 0}
        onClick={upload}
      >
        Upload
      </button>
    </div>
  );
}
