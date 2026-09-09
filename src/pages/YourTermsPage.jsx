import { CTA, Hero, Kicker, SectionHead } from "../components/primitives";
import { POLICIES, VENUE } from "../data/venue";

export function YourTermsPage({ onReserve }) {
  const answered = POLICIES.filter((p) => p.answers);
  const more = POLICIES.filter((p) => !p.answers);
  return (
    <div className="page-enter page-enter-active">
      <Hero kicker="Your night, your terms" title="They said." outline="We changed." em="" label="Your terms hero · floor manager at the door"
        intro="Public reviews of Vardas praised the room, the music and the food — and named four problems. Here they are, unedited, with what we do about each. This page is on every reservation confirmation and every table QR." />
      <section className="density-sect max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
        <ol className="divide-y divide-line border-y border-line">
          {answered.map((p, i) => (
            <li key={p.slug} className="py-10 grid md:grid-cols-12 gap-6">
              <div className="md:col-span-5">
                <p className="label !tracking-[0.2em] text-red">They said</p>
                <p className="font-display text-2xl text-ink mt-2 leading-snug">“{p.answers}”</p>
              </div>
              <div className="md:col-span-7 md:pl-8 md:border-l border-line">
                <p className="label !tracking-[0.2em] text-ink">We do</p>
                <h2 className="font-display text-2xl text-ink mt-2">{p.title}</h2>
                <p className="mt-3 text-[15px] text-grey-1 leading-relaxed">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {more.map((p) => (
            <div key={p.slug} className="border border-line bg-paper-2 p-6">
              <h3 className="font-display text-2xl text-ink">{p.title}</h3>
              <p className="mt-3 text-sm text-grey-1 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 bg-ink text-paper p-8 md:p-12 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <Kicker inverse>If we fall short</Kicker>
            <p className="font-display text-3xl mt-3 leading-snug">Ask for the floor manager by name, or message {VENUE.whatsapp}. Feedback is answered within 24 hours — by a person.</p>
          </div>
          <div className="md:col-span-4 md:text-right"><CTA variant="brass" onClick={() => onReserve()}>Reserve on these terms</CTA></div>
        </div>
      </section>
    </div>
  );
}
