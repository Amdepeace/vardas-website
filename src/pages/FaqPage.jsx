import { Accordion, Button, PageHero, Section } from "../components/vx";
import { FAQ } from "../data/site";
import { waLink } from "../lib/contact";
export function FaqPage() {
  return (
    <div>
      <PageHero label="Vardas · FAQ" title="Before you" accent="come" intro="Dress code, ID, tables, cover, smoking and getting home." />
      <Section><div className="max-w-3xl"><Accordion items={FAQ} /><div className="mt-12 flex flex-wrap gap-3"><Button href={waLink("Hi Vardas, I have a question: ")} target="_blank">Ask on WhatsApp</Button><Button to="/contact" variant="ghost">Contact</Button></div></div></Section>
    </div>
  );
}
