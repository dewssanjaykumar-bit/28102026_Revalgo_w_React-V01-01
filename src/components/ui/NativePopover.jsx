import { useEffect, useRef } from "react";

export default function NativePopover({ id, className, open, onClose, children }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isOpen = el.matches(":popover-open");
    if (open && !isOpen) el.showPopover();
    if (!open && isOpen) el.hidePopover();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    const onToggle = (e) => e.newState === "closed" && closeRef.current?.();
    el.addEventListener("toggle", onToggle);
    return () => el.removeEventListener("toggle", onToggle);
  }, []);

  return (
    <div ref={ref} id={id} className={className} popover="auto">
      {children}
    </div>
  );
}
