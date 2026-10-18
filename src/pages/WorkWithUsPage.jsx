import { Heading, PageHero, Section } from "../components/vx";
import { RequestForm } from "../components/RequestForm";
export function WorkWithUsPage({ onToast }) {
  return (
    <div>
      <PageHero image="/gallery/vardas-night-18.jpg" label="Artists · careers · suppliers" title="Work with" accent="Vardas" intro="DJs, live acts and promoters; floor, bar and door staff; suppliers. Tell us who you are." />
      <Section>
        <div className="grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-4 space-y-6 text-sm text-grey-4 leading-relaxed">
            <p><span className="text-paper">Artists &amp; promoters</span> — club floor and lounge stage, resident and guest slots, co-hosted nights.</p>
            <p><span className="text-paper">Team</span> — no commission on bottles, ever. Every hire is trained on our guest pledge.</p>
            <p><span className="text-paper">Suppliers</span> — drinks, food, production, security.</p>
          </div>
          <div className="lg:col-span-8">
            <Heading title="Introduce" accent="yourself" className="mb-8" />
            <RequestForm onToast={onToast} cta="Send →" doneTitle="Thanks — we'll be in touch"
              initial={{ who: "artist", name: "", phone: "", email: "", links: "", message: "" }}
              fields={[
                { name: "who", label: "I am", type: "select", wide: true, options: [["artist", "Artist / DJ / promoter"], ["job", "Looking for a job"], ["supplier", "Supplier"]] },
                { name: "name", label: "Name / act", required: true },
                { name: "phone", label: "Phone (WhatsApp)", type: "tel", required: true, placeholder: "+251 9…" },
                { name: "email", label: "Email", type: "email" },
                { name: "links", label: "Links (Instagram, SoundCloud, CV…)" },
                { name: "message", label: "Message", type: "textarea", wide: true },
              ]}
              build={(f) => f.who === "artist"
                ? { fn: "enquire", payload: { kind: "artist", name: f.name, act_kind: "dj", phone: f.phone, links: f.links ? { url: f.links } : {}, bio: f.message || undefined }, subject: `Artist intro — ${f.name}`, summary: { Name: f.name, Phone: f.phone, Email: f.email, Links: f.links, Message: f.message } }
                : { fn: "enquire", payload: { kind: "application", applicant_kind: f.who, name: f.name, phone: f.phone, email: f.email || undefined, message: [f.links, f.message].filter(Boolean).join("\n") || undefined }, subject: `${f.who === "job" ? "Job application" : "Supplier"} — ${f.name}`, summary: { Type: f.who, Name: f.name, Phone: f.phone, Email: f.email, Links: f.links, Message: f.message } }} />
          </div>
        </div>
      </Section>
    </div>
  );
}
