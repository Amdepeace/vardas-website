// Shared table shell for the staff console: filter chips, error, loading/empty states, clickable rows.
export function AdminTable({ title, subtitle, action, filters, filter, onFilter, error, loading, rows, empty, columns, onRow }) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="display text-2xl text-ink">{title}</h2>
          {subtitle && <p className="text-sm text-on-surface-variant mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {filters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((f) => (
            <button key={f.id} onClick={() => onFilter(f.id)} className={`text-cta-label uppercase px-4 py-2 transition-colors ${filter === f.id ? "bg-ink text-white" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}`}>{f.label}</button>
          ))}
        </div>
      )}
      {error && <div className="bg-error-container text-on-error-container p-4 mb-4 text-sm">{error}</div>}
      {loading ? (
        <div className="text-outline text-cta-label uppercase">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="border border-outline-variant bg-surface-container-lowest p-10 text-center text-on-surface-variant text-body-md">{empty}</div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>{columns.map((c) => <th key={c.key} className={`px-4 py-3 text-label-caps text-outline uppercase ${c.align === "right" ? "text-right" : "text-left"}`}>{c.label}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} onClick={onRow ? () => onRow(r) : undefined} className={`border-b border-outline-variant last:border-b-0 transition-colors ${onRow ? "hover:bg-surface-container-low cursor-pointer" : ""}`}>
                    {columns.map((c) => <td key={c.key} className={`px-4 py-3 text-sm text-on-surface ${c.align === "right" ? "text-right" : ""} ${c.mono ? "font-mono" : ""}`}>{c.render ? c.render(r) : r[c.key] ?? "—"}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-label-caps text-outline uppercase block mb-1">{label}</span>
      {props.as === "select" ? (
        <select {...props} className="w-full border border-outline-variant bg-white px-3 py-2 text-sm focus:outline-none focus:border-ink">{props.children}</select>
      ) : props.as === "textarea" ? (
        <textarea {...props} className="w-full border border-outline-variant bg-white px-3 py-2 text-sm focus:outline-none focus:border-ink min-h-[90px]" />
      ) : (
        <input {...props} className="w-full border border-outline-variant bg-white px-3 py-2 text-sm focus:outline-none focus:border-ink" />
      )}
    </label>
  );
}

export function Btn({ children, variant = "solid", ...props }) {
  const v = { solid: "bg-ink text-white hover:bg-red", ghost: "border border-ink text-ink hover:bg-ink hover:text-white", danger: "border border-error text-error hover:bg-error hover:text-white" }[variant];
  return <button {...props} className={`text-cta-label uppercase px-4 py-2 transition-colors disabled:opacity-50 ${v}`}>{children}</button>;
}

export const fmtWhen = (iso) => iso ? new Date(iso).toLocaleString("en-GB", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
