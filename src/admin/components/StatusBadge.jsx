const TONE = {
  // reservations
  pending: "bg-surface-container-highest text-on-surface-variant border border-outline-variant",
  confirmed: "bg-ink text-white", seated: "bg-red text-white", completed: "bg-surface-container text-on-surface-variant",
  cancelled: "bg-error-container text-on-error-container", no_show: "bg-error-container text-on-error-container",
  // enquiries / bookings
  new: "bg-surface-container-highest text-on-surface-variant border border-outline-variant", quoted: "bg-ink text-white",
  lost: "bg-surface-container text-on-surface-variant", requested: "bg-surface-container-highest text-on-surface-variant border border-outline-variant",
  offered: "bg-ink text-white", declined: "bg-error-container text-on-error-container",
  // generic
  published: "bg-ink text-white", draft: "bg-surface-container-highest text-on-surface-variant border border-outline-variant",
  available: "bg-ink text-white", hidden: "bg-surface-container text-on-surface-variant",
};
export function StatusBadge({ status }) {
  return <span className={`inline-flex items-center font-mono text-[10px] uppercase tracking-[0.15em] px-2 py-1 ${TONE[status] || "bg-surface-container text-on-surface-variant"}`}>{String(status).replace("_", " ")}</span>;
}
