import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Drawer, DrawerSection } from "../components/Drawer";
import { Stat } from "../components/Stat";
import { StatusBadge } from "../components/StatusBadge";

const BOOKING_SELECT =
  "id, ref, checkin, checkout, status, adults, children, total_etb, special_requests, source, created_at, guests(id, full_name, email, phone, country, is_vip, loyalty_tier), rooms(id, number, room_type, view, base_rate_etb)";

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "checked_in", label: "In-house" },
  { id: "checked_out", label: "Checked out" },
  { id: "cancelled", label: "Cancelled" },
];

const STATUS_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["checked_in", "cancelled"],
  checked_in: ["checked_out"],
  checked_out: [],
  cancelled: [],
  no_show: [],
};

const TRANSITION_LABEL = {
  confirmed: "Confirm",
  checked_in: "Check in",
  checked_out: "Check out",
  cancelled: "Cancel",
};

export function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select(BOOKING_SELECT)
      .order("checkin", { ascending: false });
    if (error) setError(error.message);
    else {
      setBookings(data || []);
      setError("");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const stats = useMemo(
    () => ({
      todayCheckIn: bookings.filter(
        (b) => b.checkin === today && b.status !== "cancelled"
      ).length,
      todayCheckOut: bookings.filter(
        (b) => b.checkout === today && b.status === "checked_in"
      ).length,
      inHouse: bookings.filter((b) => b.status === "checked_in").length,
      pending: bookings.filter((b) => b.status === "pending").length,
    }),
    [bookings, today]
  );

  const visible =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  async function updateBooking(id, changes) {
    const { data, error } = await supabase
      .from("bookings")
      .update(changes)
      .eq("id", id)
      .select(BOOKING_SELECT)
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
          <p className="text-label-caps text-outline uppercase mb-2">Today</p>
          <h2 className="playfair text-headline-xl text-ink">Bookings</h2>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="bg-red text-white text-cta-label uppercase px-5 py-2.5 rounded hover:bg-secondary-fixed-dim flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New booking
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Today's check-ins" value={stats.todayCheckIn} />
        <Stat label="Today's check-outs" value={stats.todayCheckOut} />
        <Stat label="In house" value={stats.inHouse} />
        <Stat label="Pending" value={stats.pending} />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
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
            {bookings.length === 0
              ? 'No bookings yet. Click "New booking" to create one, or run the optional seed in supabase/seed.sql.'
              : "No bookings match this filter."}
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="border-b border-outline-variant bg-surface-container-low">
                <tr>
                  <th className="text-left px-4 py-3 text-label-caps text-outline uppercase">
                    Ref
                  </th>
                  <th className="text-left px-4 py-3 text-label-caps text-outline uppercase">
                    Guest
                  </th>
                  <th className="text-left px-4 py-3 text-label-caps text-outline uppercase">
                    Room
                  </th>
                  <th className="text-left px-4 py-3 text-label-caps text-outline uppercase">
                    Check-in
                  </th>
                  <th className="text-left px-4 py-3 text-label-caps text-outline uppercase">
                    Check-out
                  </th>
                  <th className="text-left px-4 py-3 text-label-caps text-outline uppercase">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-label-caps text-outline uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelected(b)}
                    className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-sm text-ink">
                      {b.ref}
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface">
                      <span className="font-medium">
                        {b.guests?.full_name || "—"}
                      </span>
                      {b.guests?.is_vip && (
                        <span className="ml-2 text-[10px] uppercase tracking-widest text-red">
                          VIP
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface">
                      {b.rooms?.number}{" "}
                      <span className="text-on-surface-variant capitalize">
                        · {b.rooms?.room_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface">
                      {b.checkin}
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface">
                      {b.checkout}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface text-right">
                      {b.total_etb
                        ? `${Number(b.total_etb).toLocaleString()} ETB`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <BookingDrawer
          booking={selected}
          onClose={() => setSelected(null)}
          onUpdate={(changes) => updateBooking(selected.id, changes)}
        />
      )}

      {showNew && (
        <NewBookingDrawer
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

function BookingDrawer({ booking, onClose, onUpdate }) {
  const nextStatuses = STATUS_TRANSITIONS[booking.status] || [];
  const nights =
    booking.checkin && booking.checkout
      ? Math.max(
          1,
          Math.round(
            (new Date(booking.checkout) - new Date(booking.checkin)) / 86400000
          )
        )
      : 0;

  return (
    <Drawer
      open
      onClose={onClose}
      eyebrow="Reservation"
      title={booking.ref}
      actions={
        <>
          <button
            onClick={onClose}
            className="text-cta-label uppercase px-4 py-2 text-on-surface-variant hover:text-ink"
          >
            Close
          </button>
          {nextStatuses.map((s) => (
            <button
              key={s}
              onClick={() => onUpdate({ status: s })}
              className={`text-cta-label uppercase px-4 py-2 rounded ${
                s === "cancelled"
                  ? "border border-outline-variant text-error hover:bg-error-container"
                  : "bg-red text-white hover:bg-secondary-fixed-dim"
              }`}
            >
              {TRANSITION_LABEL[s] || s.replace("_", " ")}
            </button>
          ))}
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <StatusBadge status={booking.status} />
        </div>

        <DrawerSection label="Guest">
          <p className="text-on-surface font-medium">
            {booking.guests?.full_name}
            {booking.guests?.is_vip && (
              <span className="ml-2 text-[10px] uppercase tracking-widest text-red">
                VIP
              </span>
            )}
          </p>
          {booking.guests?.email && (
            <p className="text-on-surface-variant text-sm">
              {booking.guests.email}
            </p>
          )}
          {booking.guests?.phone && (
            <p className="text-on-surface-variant text-sm font-mono">
              {booking.guests.phone}
            </p>
          )}
          {booking.guests?.country && (
            <p className="text-on-surface-variant text-sm">
              {booking.guests.country}
            </p>
          )}
          {booking.guests?.loyalty_tier && (
            <p className="text-on-surface-variant text-sm capitalize mt-1">
              Tier: {booking.guests.loyalty_tier}
            </p>
          )}
        </DrawerSection>

        <DrawerSection label="Room">
          <p className="text-on-surface">
            {booking.rooms?.number}{" "}
            <span className="capitalize">· {booking.rooms?.room_type}</span>
          </p>
          {booking.rooms?.view && (
            <p className="text-on-surface-variant text-sm capitalize">
              {booking.rooms.view}
            </p>
          )}
        </DrawerSection>

        <DrawerSection label="Stay">
          <p className="text-on-surface">
            {booking.checkin} → {booking.checkout}{" "}
            <span className="text-on-surface-variant text-sm">
              ({nights} {nights === 1 ? "night" : "nights"})
            </span>
          </p>
          <p className="text-on-surface-variant text-sm">
            {booking.adults} {booking.adults === 1 ? "adult" : "adults"}
            {booking.children > 0 && ` · ${booking.children} children`}
          </p>
        </DrawerSection>

        {booking.total_etb && (
          <DrawerSection label="Total">
            <p className="playfair text-2xl text-ink">
              {Number(booking.total_etb).toLocaleString()} ETB
            </p>
          </DrawerSection>
        )}

        {booking.source && (
          <DrawerSection label="Source">
            <p className="text-sm text-on-surface-variant capitalize">
              {booking.source}
            </p>
          </DrawerSection>
        )}

        {booking.special_requests && (
          <DrawerSection label="Special requests">
            <p className="text-sm text-on-surface whitespace-pre-wrap">
              {booking.special_requests}
            </p>
          </DrawerSection>
        )}

        <DrawerSection label="Created">
          <p className="text-xs text-on-surface-variant font-mono">
            {new Date(booking.created_at).toLocaleString()}
          </p>
        </DrawerSection>
      </div>
    </Drawer>
  );
}

const FIELD_CLASS =
  "w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-red focus:border-red";

function NewBookingDrawer({ onClose, onCreated }) {
  const today = new Date().toISOString().slice(0, 10);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    guest_id: "",
    room_id: "",
    checkin: today,
    checkout: "",
    adults: 2,
    children: 0,
    total_etb: "",
    special_requests: "",
    source: "direct",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("guests")
      .select("id, full_name, email")
      .order("full_name")
      .then(({ data }) => setGuests(data || []));
    supabase
      .from("rooms")
      .select("id, number, room_type, view, base_rate_etb")
      .eq("active", true)
      .order("number")
      .then(({ data }) => setRooms(data || []));
  }, []);

  // Auto-suggest total from room rate + nights
  useEffect(() => {
    if (!form.room_id || !form.checkin || !form.checkout) return;
    const room = rooms.find((r) => r.id === form.room_id);
    if (!room) return;
    const nights = Math.max(
      1,
      Math.round(
        (new Date(form.checkout) - new Date(form.checkin)) / 86400000
      )
    );
    setForm((f) => ({ ...f, total_etb: String(nights * room.base_rate_etb) }));
  }, [form.room_id, form.checkin, form.checkout, rooms]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const ref = "BEL-" + Math.floor(Math.random() * 90000 + 10000);
    const { error } = await supabase.from("bookings").insert({
      ref,
      guest_id: form.guest_id,
      room_id: form.room_id,
      checkin: form.checkin,
      checkout: form.checkout,
      adults: Number(form.adults),
      children: Number(form.children),
      total_etb: form.total_etb ? Number(form.total_etb) : null,
      special_requests: form.special_requests || null,
      source: form.source || null,
      status: "confirmed",
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    onCreated();
  }

  return (
    <Drawer
      open
      onClose={onClose}
      eyebrow="New"
      title="New booking"
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
            form="new-booking-form"
            type="submit"
            disabled={submitting}
            className="text-cta-label uppercase px-4 py-2 bg-red text-white rounded hover:bg-secondary-fixed-dim disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create booking"}
          </button>
        </>
      }
    >
      <form id="new-booking-form" onSubmit={submit} className="space-y-5">
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded text-sm">
            {error}
          </div>
        )}

        <FormField label="Guest" required>
          <select
            required
            value={form.guest_id}
            onChange={(e) => setForm({ ...form, guest_id: e.target.value })}
            className={FIELD_CLASS}
          >
            <option value="">Choose a guest…</option>
            {guests.map((g) => (
              <option key={g.id} value={g.id}>
                {g.full_name}
                {g.email ? ` · ${g.email}` : ""}
              </option>
            ))}
          </select>
          {guests.length === 0 && (
            <p className="text-xs text-on-surface-variant mt-1">
              No guests yet. Add one on the Guests page first.
            </p>
          )}
        </FormField>

        <FormField label="Room" required>
          <select
            required
            value={form.room_id}
            onChange={(e) => setForm({ ...form, room_id: e.target.value })}
            className={FIELD_CLASS}
          >
            <option value="">Choose a room…</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.number} · {r.room_type}
                {r.view ? ` · ${r.view}` : ""} (
                {Number(r.base_rate_etb).toLocaleString()} ETB/night)
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Check-in" required>
            <input
              type="date"
              required
              value={form.checkin}
              onChange={(e) => setForm({ ...form, checkin: e.target.value })}
              className={FIELD_CLASS}
            />
          </FormField>
          <FormField label="Check-out" required>
            <input
              type="date"
              required
              min={form.checkin}
              value={form.checkout}
              onChange={(e) => setForm({ ...form, checkout: e.target.value })}
              className={FIELD_CLASS}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Adults">
            <input
              type="number"
              min="1"
              value={form.adults}
              onChange={(e) => setForm({ ...form, adults: e.target.value })}
              className={FIELD_CLASS}
            />
          </FormField>
          <FormField label="Children">
            <input
              type="number"
              min="0"
              value={form.children}
              onChange={(e) => setForm({ ...form, children: e.target.value })}
              className={FIELD_CLASS}
            />
          </FormField>
        </div>

        <FormField label="Total (ETB)">
          <input
            type="number"
            value={form.total_etb}
            onChange={(e) => setForm({ ...form, total_etb: e.target.value })}
            className={FIELD_CLASS}
            placeholder="Auto-calculated from room rate × nights"
          />
        </FormField>

        <FormField label="Source">
          <select
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className={FIELD_CLASS}
          >
            <option value="direct">Direct</option>
            <option value="phone">Phone</option>
            <option value="ota">OTA</option>
            <option value="walk-in">Walk-in</option>
          </select>
        </FormField>

        <FormField label="Special requests">
          <textarea
            rows="3"
            value={form.special_requests}
            onChange={(e) =>
              setForm({ ...form, special_requests: e.target.value })
            }
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
