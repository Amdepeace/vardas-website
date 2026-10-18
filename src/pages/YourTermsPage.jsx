import { Button, PageHero, Section } from "../components/vx";
import { POLICIES } from "../data/venue";
export function YourTermsPage() {
  return (
    <div>
      <PageHero label="Vardas · your night, your terms" title="What guests told us." accent="What we changed." intro="Reviews praised the room, the music and the food — and named four problems. Here they are, with our answer to each." />
      <Section>
        <ol className="border-t border-line-dark max-w-5xl">
          {POLICIES.filter((p) => p.answers).map((p) => (
            <li key={p.slug} className="border-b border-line-dark py-10 grid md:grid-cols-2 gap-8">
              <div><p className="vx-label text-grey-2">They said</p><p className="font-serif italic text-[1.5rem] text-quote mt-3 leading-snug">“{p.answers}”</p></div>
              <div><p className="vx-label text-red">We do</p><p className="vx-display text-xl text-paper mt-3">{p.title}</p><p className="text-grey-4 mt-3 leading-relaxed">{p.body}</p></div>
            </li>
          ))}
        </ol>
        <div className="grid md:grid-cols-2 gap-5 mt-14 max-w-5xl">
          {POLICIES.filter((p) => !p.answers).map((p) => <div key={p.slug} className="bg-ink-2 border border-line-dark p-7"><p className="vx-display text-lg text-paper">{p.title}</p><p className="text-sm text-grey-4 mt-3 leading-relaxed">{p.body}</p></div>)}
        </div>
        <div className="mt-14"><Button to="/vardas/tables">Book on these terms</Button></div>
      </Section>
    </div>
  );
}
