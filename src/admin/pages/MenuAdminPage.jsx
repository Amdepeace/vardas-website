import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Drawer } from "../components/Drawer";
import { StatusBadge } from "../components/StatusBadge";
import { AdminTable, Btn, Input } from "../components/AdminTable";
import { etb } from "../../lib/format";

const BLANK = { section_id: "kitchen", name: "", description: "", price_etb: "", unit: "each", is_bottle_service: false, seasonal: false, available: true };

export function MenuAdminPage() {
  const [sections, setSections] = useState([]); const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); const [edit, setEdit] = useState(null); const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const [s, i] = await Promise.all([supabase.from("menu_sections").select("*").order("sort_order"), supabase.from("menu_items").select("*").order("name")]);
    if (s.error || i.error) setError((s.error || i.error).message); else { setSections(s.data || []); setItems(i.data || []); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault(); setSaving(true);
    const row = { ...edit, price_etb: Number(edit.price_etb), updated_at: new Date().toISOString() };
    if (!row.price_etb || row.price_etb <= 0) { setSaving(false); return setError("Every item needs a real price — that is the pledge."); }
    const q = row.id ? supabase.from("menu_items").update(row).eq("id", row.id) : supabase.from("menu_items").insert(row);
    const { error } = await q; setSaving(false);
    if (error) return setError(error.message);
    setEdit(null); setError(""); load();
  }
  async function remove() {
    if (!edit?.id || !confirm(`Delete "${edit.name}"?`)) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", edit.id);
    if (error) return setError(error.message); setEdit(null); load();
  }

  const filters = [{ id: "all", label: "All" }, ...sections.map((s) => ({ id: s.id, label: s.title }))];
  const visible = useMemo(() => items.filter((i) => filter === "all" || i.section_id === filter), [items, filter]);
  const set = (k) => (e) => setEdit((d) => ({ ...d, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <div>
      <AdminTable title="Menu & prices" subtitle="Every published item shows its price on the site. Items without a price cannot be saved." filters={filters} filter={filter} onFilter={setFilter}
        action={<Btn onClick={() => setEdit({ ...BLANK, section_id: filter === "all" ? "kitchen" : filter })}>+ New item</Btn>}
        error={error} loading={loading} rows={visible} onRow={(r) => setEdit({ ...r })} empty="No items yet. Add the card here — nothing appears on the site without a price."
        columns={[
          { key: "name", label: "Item", render: (r) => <><span className="font-medium">{r.name}</span>{r.description && <span className="block text-xs text-on-surface-variant">{r.description}</span>}</> },
          { key: "section_id", label: "Section", render: (r) => sections.find((s) => s.id === r.section_id)?.title || r.section_id },
          { key: "price_etb", label: "Price", align: "right", mono: true, render: (r) => `${etb(r.price_etb)} / ${r.unit}` },
          { key: "flags", label: "Flags", render: (r) => <span className="text-xs text-on-surface-variant">{[r.is_bottle_service && "bottle", r.seasonal && "seasonal"].filter(Boolean).join(" · ") || "—"}</span> },
          { key: "available", label: "Status", render: (r) => <StatusBadge status={r.available ? "available" : "hidden"} /> },
        ]} />
      <Drawer open={!!edit} onClose={() => setEdit(null)} eyebrow={edit?.id ? "Edit item" : "New item"} title={edit?.name || "Menu item"}
        actions={edit && <>{edit.id && <Btn variant="danger" onClick={remove}>Delete</Btn>}<Btn form="menu-form" type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Btn></>}>
        {edit && (
          <form id="menu-form" onSubmit={save} className="space-y-4">
            <Input label="Name" required value={edit.name} onChange={set("name")} />
            <Input label="Description" value={edit.description || ""} onChange={set("description")} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price (ETB)" type="number" min="1" step="1" required value={edit.price_etb} onChange={set("price_etb")} />
              <Input label="Unit" as="select" value={edit.unit} onChange={set("unit")}><option>each</option><option>glass</option><option>bottle</option><option>shisha</option></Input>
            </div>
            <Input label="Section" as="select" value={edit.section_id} onChange={set("section_id")}>{sections.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}</Input>
            <div className="flex flex-wrap gap-5 text-sm pt-1">
              <label className="flex items-center gap-2"><input type="checkbox" checked={!!edit.is_bottle_service} onChange={set("is_bottle_service")} /> Bottle service (on request only)</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={!!edit.seasonal} onChange={set("seasonal")} /> Seasonal</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={!!edit.available} onChange={set("available")} /> Available (shown on site)</label>
            </div>
          </form>
        )}
      </Drawer>
    </div>
  );
}
