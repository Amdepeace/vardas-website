import { Button, Heading, Label, PageHero, Section, Tier } from "../components/vx";
import { VENUES, SITE } from "../data/site";
import { waLink } from "../lib/contact";
import places from "../data/places.json";

const bole = places.places.find((p) => p.id === "bole");
const building = places.places.filter((p) => p.relation === "in-building");
const MAP = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Getu Commercial Building, Africa Avenue, Bole, Addis Ababa");

export function GettingHerePage() {
  return (
    <div>
      <PageHero image="/gallery/vardas-night-23.jpg" label="Vardas · getting here" title="Fifth floor," accent="Africa Avenue" intro={VENUES.vardas.address}>
        <Button href={MAP} target="_blank">Open in Google Maps</Button>
        <Button href={waLink("Hi Vardas, please send me your location pin.")} target="_blank" variant="ghost">Get the pin on WhatsApp</Button>
      </PageHero>
      <Section>
        <div className="grid lg:grid-cols-2 gap-14">
          <div>
            <Label>Arriving</Label>
            <ul className="mt-6 border-t border-line-dark">
              {[["Entrance", "Africa Avenue side of the Getu Commercial Building — take the lift to the 5th floor."], ["Drop-off", "Kerbside at the entrance. Tell your driver: “Getu building, Vardas.”"], ["Parking", "Building parking — ask the door team on arrival."], ["From Bole International", "About 9 minutes by car along Africa Avenue."]].map(([k, v]) => (
                <li key={k} className="border-b border-line-dark py-5"><p className="text-paper">{k}</p><p className="text-sm text-grey-4 mt-1">{v}</p></li>
              ))}
            </ul>
          </div>
          <div className="space-y-5">
            <div className="bg-ink-2 border border-line-dark p-7">
              <div className="flex items-center justify-between gap-4"><Label>Bole after dark</Label><Tier tier={bole.safety_tier} /></div>
              <p className="text-sm text-grey-4 mt-4 leading-relaxed">{bole.safety_notes}</p>
              <p className="text-xs text-grey-2 mt-3">Source: published safety guide · rating {bole.rating}/5</p>
            </div>
            <div className="bg-ink-2 border border-red/40 p-7">
              <Label>Going home</Label>
              <p className="text-sm text-grey-4 mt-4 leading-relaxed">Vetted drivers and partners only. Ask any staff member, scan the table QR, or tick “ride home” when you book. The driver gets your first name and pickup — nothing else.</p>
            </div>
          </div>
        </div>
        <div className="mt-20">
          <Heading center={false} title="In the" accent="building" intro="Neighbours in the Getu Commercial Center — handy if you're early." />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {building.map((p) => <li key={p.id} className="bg-ink-2 border border-line-dark p-6"><p className="text-paper">{p.name}</p><p className="vx-label !text-[0.55rem] text-grey-2 mt-2">{p.category}</p></li>)}
          </ul>
          <p className="text-xs text-grey-2 mt-8">Emergency: Police 991 · Ambulance 907 · Vardas {SITE.phoneDisplay}</p>
        </div>
      </Section>
    </div>
  );
}
