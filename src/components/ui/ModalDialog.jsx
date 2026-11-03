import { useEffect, useRef } from "react";

export default function ModalDialog({ className, open, onClose, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className={className} onClose={onClose}>
      {children}
    </dialog>
  );
}
