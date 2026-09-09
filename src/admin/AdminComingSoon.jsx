import { useParams } from "react-router-dom";

export function AdminComingSoon() {
  const { section } = useParams();
  const label = (section || "section").replace(/^\w/, (c) => c.toUpperCase());
  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-label-caps text-outline uppercase mb-2">Module</p>
          <h2 className="display text-headline-xl text-ink">{label}</h2>
        </div>
      </div>
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-10 text-on-surface-variant">
        <p className="text-body-md">
          This module is part of the admin console but isn't built out yet. The
          first build pass covers <strong>Bookings</strong> and{" "}
          <strong>Guests</strong>; the others will follow.
        </p>
      </div>
    </div>
  );
}
