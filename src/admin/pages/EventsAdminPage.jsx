import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Drawer } from "../components/Drawer";
import { StatusBadge } from "../components/StatusBadge";
import { AdminTable, Btn, Input, fmtWhen } from "../components/AdminTable";

const BLANK = { slug: "", title: "", kind: "club-night", starts_at: "", ends_at: "", lineup: "", cover_etb: 0, dress_code: "Smart", published: false };
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function EventsAdminPage() {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [edit, setEdit] = useState(null); const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("events").select("*").order("starts_at", { ascending: true });
    if (error) setError(error.message); else setRows(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault(); setSaving(true);
    const row = { ...edit, slug: edit.slug || slugify(edit.title), lineup: String(edit.lineup || "").split(",").map((s) => s.trim()).filter(Boolean),
      cover_etb: Number(edit.cover_etb) || 0, starts_at: new Date(edit.starts_at).toISOString(), ends_at: edit.ends_at ? new Date(edit.ends_at).toISOString() : null };
    const q = row.id ? supabase.from("events").update(row).eq("id", row.id) : supabase.from("events").insert(row);
    const { error } = await q; setSaving(false);
    if (error) return setError(error.message);
    setEdit(null); load();
  }
  async function remove() {
    if (!edit?.id || !confirm(`Delete "${edit.title}"?`)) return;
    const { error } = await supabase.from("events").delete().eq("id", edit.id);
    if (error) return setError(error.message); setEdit(null); load();
  }
  const set = (k) => (e) => setEdit((d) => ({ ...d, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const local = (iso) => iso ? new Date(iso).toISOString().slice(0, 16) : "";

  return (
    <div>
      <AdminTable title="Events" subtitle="Club nights, live music, brunch, private. Cover, lineup and dress code are published — cover is never charged if it isn't listed."
        action={<Btn onClick={() => setEdit({ ...BLANK })}>+ New event</Btn>} error={error} loading={loading} rows={rows}
        onRow={(r) => setEdit({ ...r, lineup: (r.lineup || []).join(", "), starts_at: local(r.starts_at), ends_at: local(r.ends_at) })} empty="No events yet."
        columns={[
          { key: "starts_at", label: "When", render: (r) => fmtWhen(r.starts_at) },
          { key: "title", label: "Event", render: (r) => <><span className="font-medium">{r.title}</span><span className="block text-xs text-on-surface-variant">{(r.lineup || []).join(" · ")}</span></> },
          { key: "kind", label: "Kind" },
          { key: "cover_etb", label: "Cover", align: "right", mono: true, render: (r) => r.cover_etb ? `ETB ${r.cover_etb}` : "No cover" },
          { key: "dress_code", label: "Dress" },
          { key: "published", label: "Status", render: (r) => <StatusBadge status={r.published ? "published" : "draft"} /> },
        ]} />
      <Drawer open={!!edit} onClose={() => setEdit(null)} eyebrow={edit?.id ? "Edit event" : "New event"} title={edit?.title || "Event"}
        actions={edit && <>{edit.id && <Btn variant="danger" onClick={remove}>Delete</Btn>}<Btn form="event-form" type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Btn></>}>
        {edit && (
          <form id="event-form" onSubmit={save} className="space-y-4">
            <Input label="Title" required value={edit.title} onChange={set("title")} />
            <Input label="Kind" as="select" value={edit.kind} onChange={set("kind")}>{["club-night", "live-music", "brunch", "private", "corporate", "community"].map((k) => <option key={k}>{k}</option>)}</Input>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Starts" type="datetime-local" required value={edit.starts_at} onChange={set("starts_at")} />
              <Input label="Ends" type="datetime-local" value={edit.ends_at || ""} onChange={set("ends_at")} />
            </div>
            <Input label="Lineup (comma-separated)" value={edit.lineup} onChange={set("lineup")} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Cover (ETB, 0 = none)" type="number" min="0" value={edit.cover_etb} onChange={set("cover_etb")} />
              <Input label="Dress code" value={edit.dress_code || ""} onChange={set("dress_code")} />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!edit.published} onChange={set("published")} /> Published on the site</label>
          </form>
        )}
      </Drawer>
    </div>
  );
}
