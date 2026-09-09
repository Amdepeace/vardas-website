import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Drawer, DrawerSection } from "../components/Drawer";
import { Stat } from "../components/Stat";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "vip", label: "VIP" },
  { id: "platinum", label: "Platinum" },
  { id: "gold", label: "Gold" },
  { id: "bronze", label: "Bronze" },
];

const FIELD_CLASS =
  "w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-red focus:border-red";

export function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) setError(error.message);
    else {
      setGuests(data || []);
      setError("");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    let v = guests;
    if (filter === "vip") v = v.filter((g) => g.is_vip);
    else if (["bronze", "gold", "platinum"].includes(filter))
      v = v.filter((g) => g.loyalty_tier === filter);
    if (search.trim()) {
      const s = search.toLowerCase();
      v = v.filter(
        (g) =>
          g.full_name?.toLowerCase().includes(s) ||
          g.email?.toLowerCase().includes(s) ||
          g.phone?.includes(search)
      );
    }
    return v;
  }, [guests, filter, search]);

  const stats = useMemo(
    () => ({
      total: guests.length,
      vip: guests.filter((g) => g.is_vip).length,
      platinum: guests.filter((g) => g.loyalty_tier === "platinum").length,
      repeat: guests.filter((g) => g.total_stays > 1).length,
    }),
    [guests]
  );

  async function updateGuest(id, changes) {
    const { data, error } = await supabase
      .from("guests")
      .update(changes)
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      setError(error.message);
      return;
    }
    if (data) setSelected(data);
    await load();
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="text-label-caps text-outline uppercase mb-2">Directory</p>
          <h2 className="playfair text-headline-xl text-ink">Guests</h2>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="bg-red text-white text-cta-label uppercase px-5 py-2.5 rounded hover:bg-secondary-fixed-dim flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New guest
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Total guests" value={stats.total} />
        <Stat label="VIPs" value={stats.vip} />
        <Stat label="Platinum tier" value={stats.platinum} />
        <Stat label="Repeat guests" value={stats.repeat} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <input
            type="search"
            placeholder="Search by name, email, or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-10 pr-4 py-2 text-on-surface focus:outline-none focus:ring-1 focus:ring-red"
          />
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`text-cta-label uppercase px-4 py-2 rounded transition-colors ${
                filter === f.id
                  ? "bg-ink text-white"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-outline text-cta-label uppercase">Loading…</div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-10 text-center text-on-surface-variant">
          <p className="text-body-md">
            {guests.length === 0
              ? 'No guests yet. Click "New guest" to add one.'
              : "No guests match this filter."}
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>
                  <th className="text-left px-4 py-3 text-label-caps text-outline uppercase">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-label-caps text-outline uppercase">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-label-caps text-outline uppercase">
                    Phone
                  </th>
                  <th className="text-left px-4 py-3 text-label-caps text-outline uppercase">
                    Country
                  </th>
                  <th className="text-left px-4 py-3 text-label-caps text-outline uppercase">
                    Tier
                  </th>
                  <th className="text-right px-4 py-3 text-label-caps text-outline uppercase">
                    Stays
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((g) => (
                  <tr
                    key={g.id}
                    onClick={() => setSelected(g)}
                    className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-on-surface">
                      <span className="font-medium">{g.full_name}</span>
                      {g.is_vip && (
                        <span className="ml-2 inline-block text-[10px] uppercase tracking-widest text-red">
                          VIP
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">
                      {g.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant font-mono">
                      {g.phone || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">
                      {g.country || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface capitalize">
                      {g.loyalty_tier || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface text-right">
                      {g.total_stays}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <GuestDrawer
          guest={selected}
          onClose={() => setSelected(null)}
          onUpdate={(changes) => updateGuest(selected.id, changes)}
        />
      )}

      {showNew && (
        <NewGuestDrawer
          onClose={() => setShowNew(false)}
          onCreated={() => {
            setShowNew(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function GuestDrawer({ guest, onClose, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(guest);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  async function save(e) {
    e.preventDefault();
    setSubmitting(true);
    setErr("");
    const changes = {
      full_name: form.full_name,
      email: form.email || null,
      phone: form.phone || null,
      country: form.country || null,
      is_vip: !!form.is_vip,
      loyalty_tier: form.loyalty_tier || null,
      notes: form.notes || null,
    };
    try {
      await onUpdate(changes);
      setEditing(false);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Drawer
      open
      onClose={onClose}
      eyebrow="Guest profile"
      title={guest.full_name}
      actions={
        editing ? (
          <>
            <button
              onClick={() => {
                setEditing(false);
                setForm(guest);
              }}
              className="text-cta-label uppercase px-4 py-2 text-on-surface-variant hover:text-ink"
            >
              Cancel
            </button>
            <button
              form="edit-guest-form"
              type="submit"
              disabled={submitting}
              className="text-cta-label uppercase px-4 py-2 bg-red text-white rounded hover:bg-secondary-fixed-dim disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Save"}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onClose}
              className="text-cta-label uppercase px-4 py-2 text-on-surface-variant hover:text-ink"
            >
              Close
            </button>
            <button
              onClick={() => setEditing(true)}
              className="text-cta-label uppercase px-4 py-2 bg-red text-white rounded hover:bg-secondary-fixed-dim"
            >
              Edit
            </button>
          </>
        )
      }
    >
      {editing ? (
        <form id="edit-guest-form" onSubmit={save} className="space-y-5">
          {err && (
            <div className="bg-error-container text-on-error-container p-3 rounded text-sm">
              {err}
            </div>
          )}
          <FormField label="Full name" required>
            <input
              required
              value={form.full_name || ""}
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
              className={FIELD_CLASS}
            />
          </FormField>
          <FormField label="Email">
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={FIELD_CLASS}
            />
          </FormField>
          <FormField label="Phone">
            <input
              type="tel"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={FIELD_CLASS}
            />
          </FormField>
          <FormField label="Country">
            <input
              value={form.country || ""}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className={FIELD_CLASS}
            />
          </FormField>
          <FormField label="Loyalty tier">
            <select
              value={form.loyalty_tier || ""}
              onChange={(e) =>
                setForm({ ...form, loyalty_tier: e.target.value })
              }
              className={FIELD_CLASS}
            >
              <option value="">None</option>
              <option value="bronze">Bronze</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>
          </FormField>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.is_vip}
              onChange={(e) => setForm({ ...form, is_vip: e.target.checked })}
              className="w-4 h-4 accent-red"
            />
            <span className="text-on-surface text-sm">VIP guest</span>
          </label>
          <FormField label="Notes">
            <textarea
              rows="4"
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={`${FIELD_CLASS} resize-none`}
            />
          </FormField>
        </form>
      ) : (
        <div className="space-y-6">
          {guest.is_vip && (
            <span className="inline-block text-[10px] uppercase tracking-widest text-red border border-red rounded px-2 py-1">
              VIP guest
            </span>
          )}
          <DrawerSection label="Contact">
            {guest.email && (
              <p className="text-on-surface text-sm">{guest.email}</p>
            )}
            {guest.phone && (
              <p className="text-on-surface-variant text-sm font-mono">
                {guest.phone}
              </p>
            )}
            {guest.country && (
              <p className="text-on-surface-variant text-sm">{guest.country}</p>
            )}
            {!guest.email && !guest.phone && !guest.country && (
              <p className="text-on-surface-variant text-sm">—</p>
            )}
          </DrawerSection>

          <DrawerSection label="Loyalty">
            <p className="text-on-surface capitalize">
              {guest.loyalty_tier || "Not a member"}
            </p>
          </DrawerSection>

          <DrawerSection label="Stay history">
            <p className="text-on-surface">
              {guest.total_stays} {guest.total_stays === 1 ? "stay" : "stays"}
            </p>
            {guest.last_stay_at && (
              <p className="text-on-surface-variant text-sm">
                Last: {new Date(guest.last_stay_at).toLocaleDateString()}
              </p>
            )}
          </DrawerSection>

          {guest.notes && (
            <DrawerSection label="Notes">
              <p className="text-sm text-on-surface whitespace-pre-wrap">
                {guest.notes}
              </p>
            </DrawerSection>
          )}

          <DrawerSection label="Created">
            <p className="text-xs text-on-surface-variant font-mono">
              {new Date(guest.created_at).toLocaleString()}
            </p>
          </DrawerSection>
        </div>
      )}
    </Drawer>
  );
}

function NewGuestDrawer({ onClose, onCreated }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    loyalty_tier: "",
    is_vip: false,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErr("");
    const { error } = await supabase.from("guests").insert({
      full_name: form.full_name,
      email: form.email || null,
      phone: form.phone || null,
      country: form.country || null,
      loyalty_tier: form.loyalty_tier || null,
      is_vip: !!form.is_vip,
      notes: form.notes || null,
    });
    setSubmitting(false);
    if (error) {
      setErr(error.message);
      return;
    }
    onCreated();
  }

  return (
    <Drawer
      open
      onClose={onClose}
      eyebrow="New"
      title="New guest"
      actions={
        <>
          <button
            type="button"
            onClick={onClose}
            className="text-cta-label uppercase px-4 py-2 text-on-surface-variant hover:text-ink"
          >
            Cancel
          </button>
          <button
            form="new-guest-form"
            type="submit"
            disabled={submitting}
            className="text-cta-label uppercase px-4 py-2 bg-red text-white rounded hover:bg-secondary-fixed-dim disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create guest"}
          </button>
        </>
      }
    >
      <form id="new-guest-form" onSubmit={submit} className="space-y-5">
        {err && (
          <div className="bg-error-container text-on-error-container p-3 rounded text-sm">
            {err}
          </div>
        )}
        <FormField label="Full name" required>
          <input
            required
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className={FIELD_CLASS}
            placeholder="As it appears on ID"
          />
        </FormField>
        <FormField label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={FIELD_CLASS}
            placeholder="you@example.com"
          />
        </FormField>
        <FormField label="Phone">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={FIELD_CLASS}
            placeholder="+251 …"
          />
        </FormField>
        <FormField label="Country">
          <input
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className={FIELD_CLASS}
          />
        </FormField>
        <FormField label="Loyalty tier">
          <select
            value={form.loyalty_tier}
            onChange={(e) =>
              setForm({ ...form, loyalty_tier: e.target.value })
            }
            className={FIELD_CLASS}
          >
            <option value="">None</option>
            <option value="bronze">Bronze</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </FormField>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_vip}
            onChange={(e) => setForm({ ...form, is_vip: e.target.checked })}
            className="w-4 h-4 accent-red"
          />
          <span className="text-on-surface text-sm">VIP guest</span>
        </label>
        <FormField label="Notes">
          <textarea
            rows="4"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className={`${FIELD_CLASS} resize-none`}
          />
        </FormField>
      </form>
    </Drawer>
  );
}

function FormField({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-label-caps text-outline uppercase block mb-1.5">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
