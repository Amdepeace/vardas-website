export function Stat({ label, value, hint }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
      <p className="text-label-caps text-outline uppercase">{label}</p>
      <p className="display text-3xl text-ink mt-2">{value}</p>
      {hint && (
        <p className="text-xs text-on-surface-variant mt-1">{hint}</p>
      )}
    </div>
  );
}
