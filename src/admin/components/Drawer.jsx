import { useEffect } from "react";

export function Drawer({ open, onClose, eyebrow, title, actions, children }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
      />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
          <div>
            {eyebrow && (
              <p className="text-label-caps text-outline uppercase mb-1">
                {eyebrow}
              </p>
            )}
            <h2 className="playfair text-2xl text-ink">{title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-outline hover:text-ink"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {actions && (
          <div className="border-t border-outline-variant p-4 flex gap-2 justify-end flex-wrap">
            {actions}
          </div>
        )}
      </aside>
    </div>
  );
}

export function DrawerSection({ label, children }) {
  return (
    <div>
      <p className="text-label-caps text-outline uppercase mb-2">{label}</p>
      {children}
    </div>
  );
}
