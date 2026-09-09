const etbFmt = new Intl.NumberFormat("en-ET", { maximumFractionDigits: 0 });
/** Format a price in birr: 1600 -> "ETB 1,600" */
export function etb(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "—";
  return `ETB ${etbFmt.format(Number(n))}`;
}
export function etbRange([min, max]) {
  return `${etb(min)} – ${etbFmt.format(max)}`;
}
