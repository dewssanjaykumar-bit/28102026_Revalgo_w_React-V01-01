import "./NewQuote.css";
import "../../styles/quote-view.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuoteHeader from "../../components/ui/newQuote/QuoteHeader.jsx";
import QuoteInfoCard, {
  infoFromQuote,
} from "../../components/ui/quoteView/QuoteInfoCard.jsx";
import NewOrderPad from "../../components/ui/newQuote/NewOrderPad.jsx";
import NewItemsTable from "../../components/ui/newQuote/NewItemsTable.jsx";
import SourcingPopover from "../../components/ui/newQuote/SourcingPopover.jsx";
import SuggestedProducts from "../../components/ui/newQuote/SuggestedProducts.jsx";
import AddItemModal, {
  useAddItemRows,
} from "../../components/ui/newQuote/AddItemModal.jsx";
import AddNotePopover from "../../components/ui/newQuote/AddNotePopover.jsx";
import {
  DeleteLinePopover,
  DeleteSelectedPopover,
} from "../../components/ui/newQuote/DeletePopovers.jsx";
import { getQuote, removeQuote } from "../../data/quoteStore.js";
import {
  ApproveConfirmDialog,
  ApprovedPopover,
  DeleteQuoteDialog,
  SourcingConfirmDialog,
  UndoQuoteDialog,
} from "../../components/ui/newQuote/QuoteDialogs.jsx";
import useQuoteLines from "../../hooks/useQuoteLines.js";
import {
  linesFromQuote,
  lineFromModalRow,
} from "../../features/lineFactories.js";
import {
  approveQuote,
  generateNewQuoteId,
  loadNotes,
  loadTags,
  saveNotes,
  undoDeleteQuote,
} from "../../features/quoteStorage.js";
import Header from "../../components/layout/Header.jsx";

const DIMMED = { opacity: 0.5, pointerEvents: "none" };

const DEFAULT_INFO = {
  billTo: {
    name: "Astral India Pvt. Limited",
    address: "605 Knollwood Street, Brick, NJ 08724",
  },
  shipTo: {
    name: "Astral India Pvt. Limited",
    address: "605 Knollwood Street, Brick, NJ 08724",
  },
  po: "--",
  job: "--",
  buyer: "--",
  delivery: "--",
};

function loadInitial() {
  const selectedId = sessionStorage.getItem("selectedId");
  const newQuoteId = sessionStorage.getItem("newQuote");
  const status = sessionStorage.getItem("status");
  const source = selectedId ? getQuote(selectedId) : null;

  let quoteId = source?.quoteId ?? "#7DB38BFED";
  if (newQuoteId && !selectedId) quoteId = newQuoteId;
  if (status === "new") quoteId = generateNewQuoteId();
  const isDraft =
    status === "new" || sessionStorage.getItem("activeNewQuoteId") === quoteId;

  let lines = [];
  if (source) {
    let imported = null;
    try {
      imported = JSON.parse(sessionStorage.getItem("selectedLines"));
    } catch {
      /* ignore */
    }
    lines = linesFromQuote(source, imported);

    const notes = loadNotes(selectedId);
    const tags = loadTags(selectedId);
    lines = lines.map((l, i) => ({
      ...l,
      note: notes[String(i + 1)] ?? "",
      source: tags[i] ?? null,
    }));
  }
  return { quoteId, source, lines, isDraft };
}

export default function NewQuote() {
  const [initial] = useState(loadInitial);
  const { quoteId, source, isDraft } = initial;
  const { lines, dispatch } = useQuoteLines(() => initial.lines);
  const navigate = useNavigate();

  const [status, setStatus] = useState(""); 
  const [selected, setSelected] = useState(() => new Set());
  const [expandedUid, setExpandedUid] = useState(null);

  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [approvedOpen, setApprovedOpen] = useState(false);
  const [deleteQuoteOpen, setDeleteQuoteOpen] = useState(false);
  const [undoQuoteOpen, setUndoQuoteOpen] = useState(false);
  const [deleteLine, setDeleteLine] = useState(null);
  const [deleteSelectedOpen, setDeleteSelectedOpen] = useState(false);
  const [noteUid, setNoteUid] = useState(null);
  const [sourcingAnchor, setSourcingAnchor] = useState(null);
  const [sourcingConfirm, setSourcingConfirm] = useState(null);

  const addRows = useAddItemRows();
  const [addOpen, setAddOpen] = useState(false);
  const [smallPanel, setSmallPanel] = useState(null);
  const [expandedOpen, setExpandedOpen] = useState(false);
  const [targetKind, setTargetKind] = useState(null);
  const targetRef = useRef(null);

  useEffect(() => {
    sessionStorage.removeItem("selectedLines");
    sessionStorage.removeItem("newQuote");
    sessionStorage.removeItem("status");
  }, []);

  const active = lines.filter((l) => !l.deleted);
  const totalPrice = active.reduce(
    (sum, l) => sum + (Number(l.qty) || 0) * (Number(l.sellingPrice) || 0),
    0,
  );
  const info = {
    ...(source ? infoFromQuote(source) : DEFAULT_INFO),
    lines: active.length,
    total: `$ ${totalPrice.toFixed(2)}`,
  };

  const locked = status !== "";
  const setTarget = (t) => {
    targetRef.current = t;
    setTargetKind(t?.kind ?? null);
  };

  const toggleSelect = (uid) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(uid) ? next.delete(uid) : next.add(uid);
      return next;
    });
  const selectAll = (checked) =>
    setSelected(checked ? new Set(active.map((l) => l.uid)) : new Set());

  const removeLines = (uids) => {
    dispatch({ type: "setDeleted", uids, deleted: true });
    setSelected((prev) => new Set([...prev].filter((u) => !uids.includes(u))));
    setExpandedUid(null);
  };

  const closeSuggested = () => {
    setSmallPanel(null);
    setExpandedOpen(false);
    setTarget(null);
  };

  const pickSuggested = (product) => {
    const t = targetRef.current;
    if (t?.kind === "row") dispatch({ type: "apply", uid: t.uid, product });
    if (t?.kind === "modal") {
      addRows.apply(t.index, product);
      setAddOpen(true);
    }
    closeSuggested();
  };

  const closeExpanded = () => {
    setExpandedOpen(false);
    if (targetRef.current?.kind === "modal") setAddOpen(true);
  };

  const closeAddModal = () => {
    setAddOpen(false);
    addRows.reset();
  };

  const discardQuote = () => {
    if (isDraft) removeQuote(quoteId);
    if (sessionStorage.getItem("activeNewQuoteId") === quoteId) {
      sessionStorage.removeItem("activeNewQuoteId");
    }
    ["selectedId", "selectedLines", "newQuote", "status"].forEach((key) =>
      sessionStorage.removeItem(key),
    );
    navigate("/dashboard", { replace: true });
  };

  const addFromModal = (rows) => {
    dispatch({ type: "add", lines: rows.map(lineFromModalRow) });
    closeAddModal();
  };

  const confirmApprove = () => {
    setApproveConfirmOpen(false);
    approveQuote(quoteId, lines);
    saveNotes(quoteId, lines);
    setStatus("approved");
    setApprovedOpen(true);
  };

  return (
    <>
      <Header />
      <main className="quote-view-page">
        <SourcingConfirmDialog
          pending={sourcingConfirm}
          onYes={() => {
            dispatch({
              type: "source",
              uid: sourcingConfirm.uid,
              source: { pid: sourcingConfirm.pid, inStock: false },
            });
            setSourcingConfirm(null);
          }}
          onNo={() => setSourcingConfirm(null)}
        />
        <UndoQuoteDialog
          open={undoQuoteOpen}
          quoteId={quoteId}
          onYes={() => {
            undoDeleteQuote(quoteId);
            setStatus("");
            setUndoQuoteOpen(false);
          }}
          onNo={() => setUndoQuoteOpen(false)}
        />
        <DeleteQuoteDialog
          open={deleteQuoteOpen}
          quoteId={quoteId}
          onYes={discardQuote}
          onNo={() => setDeleteQuoteOpen(false)}
        />
        <ApproveConfirmDialog
          open={approveConfirmOpen}
          quoteId={quoteId}
          onConfirm={confirmApprove}
          onCancel={() => setApproveConfirmOpen(false)}
        />
        <AddItemModal
          open={addOpen}
          state={addRows}
          onClose={closeAddModal}
          onAdd={addFromModal}
          onOpenSuggested={(index) => {
            setTarget({ kind: "modal", index });
            setAddOpen(false);
            setExpandedOpen(true);
          }}
        />

        <SourcingPopover
          anchor={sourcingAnchor}
          onClose={() => setSourcingAnchor(null)}
          onPick={(option) => {
            const uid = sourcingAnchor.uid;
            setSourcingAnchor(null);
            if (option.inStock)
              dispatch({
                type: "source",
                uid,
                source: { pid: option.id, inStock: true },
              });
            else setSourcingConfirm({ uid, pid: option.id });
          }}
        />
        <SuggestedProducts
          small={smallPanel}
          expandedOpen={expandedOpen}
          modalMode={targetKind === "modal"}
          onPick={pickSuggested}
          onExpand={() => {
            setSmallPanel(null);
            setExpandedOpen(true);
          }}
          onCloseSmall={closeSuggested}
          onCloseExpanded={closeExpanded}
        />
        <AddNotePopover
          open={noteUid !== null}
          initialNote={lines.find((l) => l.uid === noteUid)?.note}
          onClose={() => setNoteUid(null)}
          onSave={(note) => {
            dispatch({ type: "note", uid: noteUid, note });
            setNoteUid(null);
          }}
        />
        <DeleteLinePopover
          lineNo={deleteLine?.lineNo ?? null}
          onClose={() => setDeleteLine(null)}
          onYes={() => {
            removeLines([deleteLine.uid]);
            setDeleteLine(null);
          }}
        />
        <DeleteSelectedPopover
          open={deleteSelectedOpen}
          onClose={() => setDeleteSelectedOpen(false)}
          onYes={() => {
            removeLines(
              active.filter((l) => selected.has(l.uid)).map((l) => l.uid),
            );
            setDeleteSelectedOpen(false);
          }}
        />

        <main className="quote-view-page">
          <ApprovedPopover
            open={approvedOpen}
            quoteId={quoteId}
            onClose={() => setApprovedOpen(false)}
          />

          <QuoteHeader
            quoteId={quoteId}
            status={status}
            onDelete={() => setDeleteQuoteOpen(true)}
            onUndo={() => setUndoQuoteOpen(true)}
            onApprove={() => setApproveConfirmOpen(true)}
          />

          <QuoteInfoCard info={info} disabled={locked} />

          <div
            className="main-content-section"
            style={locked ? DIMMED : undefined}
          >
            <NewOrderPad
              onAddLines={(newLines) =>
                dispatch({ type: "add", lines: newLines })
              }
            />
            <NewItemsTable
              lines={lines}
              selected={selected}
              expandedUid={expandedUid}
              onSelect={toggleSelect}
              onSelectAll={selectAll}
              onEdit={(uid, field, value) =>
                dispatch({ type: "edit", uid, field, value })
              }
              onToggleDetails={(uid) =>
                setExpandedUid((prev) => (prev === uid ? null : uid))
              }
              onCloseDetails={() => setExpandedUid(null)}
              onMove={(from, to) => dispatch({ type: "move", from, to })}
              onDelete={(uid, lineNo) => setDeleteLine({ uid, lineNo })}
              onRestore={(uid) =>
                dispatch({ type: "setDeleted", uids: [uid], deleted: false })
              }
              onDeleteSelected={() => setDeleteSelectedOpen(true)}
              onOpenSuggested={(uid, x, y) => {
                setExpandedOpen(false);
                setTarget({ kind: "row", uid });
                setSmallPanel({ x, y });
              }}
              onTagClick={(uid, x, y) => setSourcingAnchor({ uid, x, y })}
              onNoteClick={setNoteUid}
              onAddItem={() => setAddOpen(true)}
            />
          </div>
        </main>
      </main>
    </>
  );
}
