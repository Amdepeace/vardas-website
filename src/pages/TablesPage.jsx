import { useSearchParams } from "react-router-dom";
import { Heading, Label, PageHero, Section } from "../components/vx";
import { RequestForm } from "../components/RequestForm";
import { TABLE_ZONES } from "../data/site";

export function TablesPage({ onToast }) {
  const [q] = useSearchParams();
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div>
      <PageHero image="/gallery/vardas-night-23.jpg" label="Vardas · VIP tables" title="Request a" gold="table" intro="Pick the night, the zone and your party size. A host confirms by phone with any minimum spend and your arrival time — nothing is charged online." />
      <Section>
        <div className="grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5">
            <Label>Zones</Label>
            <ul className="mt-6 border-t border-edge">
              {TABLE_ZONES.map((z) => (
                <li key={z.id} className="border-b border-edge py-6">
                  <div className="flex justify-between gap-4"><p className="vx-display text-lg text-cream">{z.name}</p><p className="text-sm text-gold whitespace-nowrap">{z.seats}</p></div>
                  <p className="text-sm text-mute mt-2">{z.note}</p>
                </li>
              ))}
            </ul>
            <p className="text-xs text-mute-2 mt-6 leading-relaxed">Bottle service is only ever on request, and its price is on the menu. Valid ID required.</p>
          </div>
          <div className="lg:col-span-7">
            <Heading title="Your" gold="night" className="mb-8" />
            <RequestForm onToast={onToast} cta="Request table →" doneTitle="Table request received"
              initial={{ date: today, time: "22:30", zone: "club-floor", party: 6, name: "", phone: "", email: "", ride: false, notes: q.get("event") ? `For ${q.get("event").replace(/-/g, " ")}` : "" }}
              fields={[
                { name: "date", label: "Date", type: "date", min: today, required: true },
                { name: "time", label: "Arrival", type: "time", required: true },
                { name: "zone", label: "Zone", type: "select", options: TABLE_ZONES.map((z) => [z.id, `${z.name} · ${z.seats}`]) },
                { name: "party", label: "Party size", type: "number", min: 1, required: true },
                { name: "name", label: "Name", required: true },
                { name: "phone", label: "Phone (WhatsApp)", type: "tel", required: true, placeholder: "+251 9…" },
                { name: "email", label: "Email", type: "email", wide: true },
                { name: "notes", label: "Notes", type: "textarea", wide: true, placeholder: "Birthday, celebration, anything we should know" },
                { name: "ride", label: "Arrange a safe ride home for us", type: "checkbox", wide: true },
              ]}
              build={(f) => ({
                fn: "reserve",
                payload: { guest_name: f.name, phone: f.phone, email: f.email || undefined, party_size: Number(f.party), service: "club", zone_id: f.zone, starts_at: new Date(`${f.date}T${f.time}:00`).toISOString(), ride_home_requested: !!f.ride, notes: f.notes || undefined },
                subject: `VIP table request — ${f.date} · ${f.party} guests`,
                summary: { Date: f.date, Arrival: f.time, Zone: f.zone, "Party size": f.party, Name: f.name, Phone: f.phone, Email: f.email, "Ride home": f.ride ? "Yes" : "No", Notes: f.notes },
              })} />
          </div>
        </div>
      </Section>
    </div>
  );
}
