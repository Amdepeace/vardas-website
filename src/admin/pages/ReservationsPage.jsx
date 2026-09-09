import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Drawer, DrawerSection } from "../components/Drawer";
import { Stat } from "../components/Stat";
import { StatusBadge } from "../components/StatusBadge";
import { AdminTable, Btn, fmtWhen } from "../components/AdminTable";

const FILTERS = [["all", "All"], ["pending", "Pending"], ["confirmed", "Confirmed"], ["seated", "Seated"], ["completed", "Completed"], ["cancelled", "Cancelled"]].map(([id, label]) => ({ id, label }));
const NEXT = { pending: ["confirmed", "cancelled"], confirmed: ["seated", "no_show", "cancelled"], seated: ["completed"], completed: [], cancelled: [], no_show: [] };

export function ReservationsPage() {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); const [sel, setSel] = useState(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("reservations").select("*").order("starts_at", { ascending: true }).gte("starts_at", new Date(Date.now() - 86400000).toISOString());
    if (error) setError(error.message); else setRows(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(r, status) {
    const { error } = await supabase.from("reservations").update({ status, updated_at: new Date().toISOString() }).eq("id", r.id);
    if (error) return setError(error.message);
    setSel(null); load();
  }

  const visible = useMemo(() => rows.filter((r) => filter === "all" || r.status === filter), [rows, filter]);
  const tonight = rows.filter((r) => new Date(r.starts_at).toDateString() === new Date().toDateString() && !["cancelled", "no_show"].includes(r.status));
  const rides = tonight.filter((r) => r.ride_home_requested).length;

  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Stat label="Tonight" value={tonight.length} hint="reservations not cancelled" />
        <Stat label="Covers tonight" value={tonight.reduce((n, r) => n + r.party_size, 0)} />
        <Stat label="Rides home requested" value={rides} hint="arrange with ride partners" />
      </div>
      <AdminTable title="Reservations" subtitle="Lunch · dinner · club. Guests reserve on the site or WhatsApp; confirm here." filters={FILTERS} filter={filter} onFilter={setFilter}
        error={error} loading={loading} rows={visible} onRow={setSel} empty="No reservations yet. They appear here as guests reserve on the site."
        columns={[
          { key: "ref", label: "Ref", mono: true },
          { key: "starts_at", label: "When", render: (r) => fmtWhen(r.starts_at) },
          { key: "guest_name", label: "Guest", render: (r) => <><span className="font-medium">{r.guest_name}</span><span className="block text-xs text-on-surface-variant">{r.phone}</span></> },
          { key: "service", label: "Service", render: (r) => <span className="capitalize">{r.service} · {r.zone_id || "any zone"}</span> },
          { key: "party_size", label: "Party", align: "right" },
          { key: "ride_home_requested", label: "Ride", render: (r) => r.ride_home_requested ? <span className="text-red font-medium">Yes</span> : "—" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]} />
      <Drawer open={!!sel} onClose={() => setSel(null)} eyebrow={sel?.ref} title={sel?.guest_name || ""}
        actions={sel && NEXT[sel.status].map((s) => <Btn key={s} variant={s === "cancelled" || s === "no_show" ? "danger" : "solid"} onClick={() => setStatus(sel, s)}>{s.replace("_", " ")}</Btn>)}>
        {sel && (
          <div className="space-y-5 text-sm">
            <DrawerSection label="When"><p>{fmtWhen(sel.starts_at)} · <span className="capitalize">{sel.service}</span> · {sel.zone_id || "any zone"}</p></DrawerSection>
            <DrawerSection label="Party"><p>{sel.party_size} guests · {sel.ride_home_requested ? "ride home requested" : "no ride"}</p></DrawerSection>
            <DrawerSection label="Contact"><p>{sel.phone}{sel.email ? ` · ${sel.email}` : ""} · via {sel.source}</p></DrawerSection>
            {sel.notes && <DrawerSection label="Notes"><p>{sel.notes}</p></DrawerSection>}
            <DrawerSection label="Status"><StatusBadge status={sel.status} /></DrawerSection>
          </div>
        )}
      </Drawer>
    </div>
  );
}
