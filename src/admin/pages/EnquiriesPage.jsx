import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Drawer, DrawerSection } from "../components/Drawer";
import { StatusBadge } from "../components/StatusBadge";
import { AdminTable, Btn, fmtWhen } from "../components/AdminTable";

const TABS = [{ id: "hire", label: "Private hire" }, { id: "artists", label: "Artists" }, { id: "applications", label: "Careers & suppliers" }];
const HIRE_NEXT = { new: ["quoted", "lost"], quoted: ["confirmed", "lost"], confirmed: [], lost: [] };

export function EnquiriesPage() {
  const [tab, setTab] = useState("hire"); const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); const [sel, setSel] = useState(null);

  async function load() {
    setLoading(true); setError("");
    const q = tab === "hire" ? supabase.from("hire_enquiries").select("*").order("created_at", { ascending: false })
      : tab === "artists" ? supabase.from("artists").select("*").order("created_at", { ascending: false })
      : supabase.from("applications").select("*, job_openings(title)").order("created_at", { ascending: false });
    const { data, error } = await q;
    if (error) setError(error.message); else setRows(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [tab]);

  async function update(table, id, patch) {
    const { error } = await supabase.from(table).update(patch).eq("id", id);
    if (error) return setError(error.message); setSel(null); load();
  }

  const columns = useMemo(() => tab === "hire" ? [
      { key: "created_at", label: "Received", render: (r) => fmtWhen(r.created_at) },
      { key: "contact_name", label: "Contact", render: (r) => <><span className="font-medium">{r.contact_name}</span><span className="block text-xs text-on-surface-variant">{r.company || "—"} · {r.phone}</span></> },
      { key: "kind", label: "Kind" }, { key: "preferred_date", label: "Date" }, { key: "guests", label: "Guests", align: "right" }, { key: "zone_id", label: "Zone" },
      { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    ] : tab === "artists" ? [
      { key: "created_at", label: "Received", render: (r) => fmtWhen(r.created_at) },
      { key: "name", label: "Act", render: (r) => <span className="font-medium">{r.name}</span> }, { key: "kind", label: "Kind" },
      { key: "genres", label: "Genres", render: (r) => (r.genres || []).join(", ") || "—" },
      { key: "approved", label: "Status", render: (r) => <StatusBadge status={r.approved ? "confirmed" : "pending"} /> },
    ] : [
      { key: "created_at", label: "Received", render: (r) => fmtWhen(r.created_at) },
      { key: "name", label: "Name", render: (r) => <><span className="font-medium">{r.name}</span><span className="block text-xs text-on-surface-variant">{r.phone}{r.email ? ` · ${r.email}` : ""}</span></> },
      { key: "kind", label: "Kind" }, { key: "job", label: "Role", render: (r) => r.job_openings?.title || "General" },
      { key: "message", label: "Message", render: (r) => <span className="text-xs text-on-surface-variant line-clamp-2 max-w-xs block">{r.message || "—"}</span> },
    ], [tab]);

  return (
    <div>
      <AdminTable title="Enquiries" subtitle="Everything that comes through the site's forms. Quote private hire within 48 hours." filters={TABS} filter={tab} onFilter={setTab}
        error={error} loading={loading} rows={rows} onRow={setSel} empty="Nothing here yet." columns={columns} />
      <Drawer open={!!sel} onClose={() => setSel(null)} eyebrow={tab} title={sel?.contact_name || sel?.name || ""}
        actions={sel && (tab === "hire" ? HIRE_NEXT[sel.status]?.map((s) => <Btn key={s} variant={s === "lost" ? "danger" : "solid"} onClick={() => update("hire_enquiries", sel.id, { status: s })}>{s}</Btn>)
          : tab === "artists" ? <Btn onClick={() => update("artists", sel.id, { approved: !sel.approved })}>{sel.approved ? "Unapprove" : "Approve & list"}</Btn> : null)}>
        {sel && <div className="space-y-4 text-sm">{Object.entries(sel).filter(([k, v]) => v && !["id", "job_openings", "links"].includes(k)).map(([k, v]) => <DrawerSection key={k} label={k.replace(/_/g, " ")}><p className="break-words">{Array.isArray(v) ? v.join(", ") : typeof v === "object" ? JSON.stringify(v) : String(v)}</p></DrawerSection>)}</div>}
      </Drawer>
    </div>
  );
}
