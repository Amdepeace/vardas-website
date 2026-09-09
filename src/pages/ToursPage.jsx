import { useParams } from "react-router-dom";
import { CTA, Hero, Kicker, Placeholder, SectionHead } from "../components/primitives";
import { ZONES } from "../data/venue";

/**
 * <Tour /> is the only public API for 360° previews. Phase 2 swaps the body for
 * Photo Sphere Viewer (panoramas from Supabase Storage, hotspots from tour_hotspots);
 * a Matterport embed can later implement the same props without touching callers.
 */
export function Tour({ slug, title }) {
  return (
    <div className="relative border border-line bg-ink aspect-video overflow-hidden" data-tour={slug}>
      <Placeholder tone="dark" aspect="auto" label={`${title} · equirectangular`} className="absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-paper">
        <span className="material-symbols-outlined text-5xl text-red">360</span>
        <p className="mt-3 label !tracking-[0.25em] text-paper/80">360° tour · {title}</p>
        <p className="mt-1 text-[12px] text-paper/60">Panoramas are captured in Phase 2 · auto-rotate walkthrough</p>
      </div>
    </div>
  );
}

export function ToursPage({ onReserve }) {
  const { slug } = useParams();
  const zones = slug ? ZONES.filter((z) => z.tour === slug) : ZONES;
  return (
    <div className="page-enter page-enter-active">
      <Hero kicker="360° previews" title="Walk the fifth floor" em="from anywhere." label="Tours hero · terrace panorama"
        intro="Every zone, shot in 360°. Tap through terrace, lounge, club floor and the private room like a walkthrough video — then reserve the table you were standing at." />
      <section className="density-sect max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 space-y-16">
        {zones.map((z) => (
          <div key={z.id} className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8"><Tour slug={z.tour} title={z.title} /></div>
            <div className="md:col-span-4">
              <Kicker>{z.smoking ? "Smoking · marked areas" : "Smoke-free"}</Kicker>
              <h2 className="font-display text-3xl text-ink mt-3">{z.title}</h2>
              <p className="text-sm text-grey-1 mt-3 leading-relaxed">{z.blurb}</p>
              <p className="label !tracking-[0.16em] text-grey-2 mt-4">Capacity · {z.capacity}</p>
              <CTA variant="ghost" className="mt-6" onClick={() => onReserve({ zone: z.id })}>Reserve here</CTA>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
