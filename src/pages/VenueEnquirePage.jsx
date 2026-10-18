import { useSearchParams } from "react-router-dom";
import { PageHero, Section } from "../components/vx";
import { RequestForm } from "../components/RequestForm";

const TYPES = [["corporate", "Corporate event"], ["private", "Private party"], ["concert", "Concert or show"], ["wedding", "Wedding or celebration"], ["other", "Something else"]];
const DB_KIND = { corporate: "corporate", private: "birthday", concert: "launch", wedding: "wedding", other: "other" };

export function VenueEnquirePage({ onToast }) {
  const [q] = useSearchParams();
  const type = TYPES.some(([v]) => v === q.get("type")) ? q.get("type") : "corporate";
  const label = TYPES.find(([v]) => v === type)[1];
  return (
    <div>
      <PageHero image="/gallery/venue-hero.jpg" label="Vardas Venue · enquiry" title="Plan your" accent="event" intro={`${label}s and more. Share the basics — the events team replies with availability and a proposal.`} />
      <Section>
        <div className="max-w-3xl">
          <RequestForm key={type} onToast={onToast} cta="Send enquiry →" doneTitle="Event enquiry received"
            initial={{ type, date: "", guests: 100, company: "", name: "", phone: "", email: "", budget: "", brief: "" }}
            fields={[
              { name: "type", label: "Event type", type: "select", options: TYPES, wide: true },
              { name: "date", label: "Preferred date", type: "date", min: new Date().toISOString().slice(0, 10) },
              { name: "guests", label: "Guests", type: "number", min: 1, required: true },
              { name: "name", label: "Your name", required: true },
              { name: "company", label: "Company / organiser" },
              { name: "phone", label: "Phone (WhatsApp)", type: "tel", required: true, placeholder: "+251 9…" },
              { name: "email", label: "Email", type: "email" },
              { name: "budget", label: "Budget (ETB, optional)", type: "number", min: 0, wide: true },
              { name: "brief", label: "Tell us about it", type: "textarea", wide: true, placeholder: "Occasion, timings, music, food and drink, anything special" },
            ]}
            build={(f) => ({
              fn: "enquire",
              payload: { kind: "hire", venue: "vardas-venue", contact_name: f.name, company: f.company || undefined, phone: f.phone, email: f.email || undefined, event_kind: DB_KIND[f.type], preferred_date: f.date || undefined, guests: Number(f.guests) || undefined, budget_etb: f.budget ? Number(f.budget) : undefined, brief: `[${TYPES.find(([v]) => v === f.type)[1]}] ${f.brief || ""}`.trim() },
              subject: `Vardas Venue enquiry — ${TYPES.find(([v]) => v === f.type)[1]}${f.date ? ` · ${f.date}` : ""}`,
              summary: { Type: TYPES.find(([v]) => v === f.type)[1], Date: f.date, Guests: f.guests, Name: f.name, Company: f.company, Phone: f.phone, Email: f.email, "Budget (ETB)": f.budget, Brief: f.brief },
            })} />
        </div>
      </Section>
    </div>
  );
}
