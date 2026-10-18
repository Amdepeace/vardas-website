import { Heading, PageHero, Section } from "../components/vx";
import { RequestForm } from "../components/RequestForm";
import { SITE, VENUES } from "../data/site";
import { tgLink, waLink } from "../lib/contact";

export function ContactPage({ onToast }) {
  const channels = [
    ["WhatsApp", "Fastest — a host replies", waLink("Hi Vardas, "), "bg-wa text-night"],
    ["Telegram", "Same team, same number", tgLink(), "bg-tg text-white"],
    ["Email", SITE.email, `mailto:${SITE.email}`, "gold-fill text-night"],
    ["Call", SITE.phoneDisplay, `tel:${SITE.phoneE164}`, "bg-night-3 text-cream border border-edge"],
  ];
  return (
    <div>
      <PageHero image="/gallery/vardas-night-6.jpg" label="Contact" title="Talk to" gold="Vardas" intro="Tables, events, press, partnerships — every message reaches the same team." />
      <Section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {channels.map(([t, d, href, cls]) => (
            <a key={t} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="group vx-focus block bg-night-2 border border-edge p-7 hover:border-gold/60 transition-colors">
              <span className={`inline-block vx-label !text-[0.58rem] px-3 py-2 ${cls}`}>{t}</span>
              <p className="text-cream mt-5 break-words">{d}</p>
              <p className="text-gold text-sm mt-4">Open →</p>
            </a>
          ))}
        </div>
        <div className="grid lg:grid-cols-12 gap-14 mt-20">
          <div className="lg:col-span-4 space-y-10">
            {[VENUES.vardas, VENUES.venue].map((v) => <div key={v.id}><p className="vx-display text-lg gold-text">{v.name}</p><p className="text-sm text-mute mt-3 leading-relaxed">{v.address}</p></div>)}
          </div>
          <div className="lg:col-span-8">
            <Heading title="Send a" gold="message" className="mb-8" />
            <RequestForm onToast={onToast} cta="Send message →" doneTitle="Message received"
              initial={{ topic: "general", name: "", phone: "", email: "", message: "" }}
              fields={[
                { name: "topic", label: "Topic", type: "select", wide: true, options: [["general", "General question"], ["tables", "Tables & guest list"], ["venue", "Vardas Venue event"], ["press", "Press & partnerships"], ["feedback", "Feedback"]] },
                { name: "name", label: "Name", required: true },
                { name: "phone", label: "Phone (WhatsApp)", type: "tel", placeholder: "+251 9…" },
                { name: "email", label: "Email", type: "email", wide: true, required: true },
                { name: "message", label: "Message", type: "textarea", wide: true, required: true },
              ]}
              build={(f) => ({ fn: "enquire", payload: { kind: "contact", topic: f.topic, name: f.name, phone: f.phone || undefined, email: f.email, message: f.message }, subject: `Website message — ${f.topic}`, summary: { Topic: f.topic, Name: f.name, Phone: f.phone, Email: f.email, Message: f.message } })} />
          </div>
        </div>
      </Section>
    </div>
  );
}
