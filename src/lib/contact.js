import { SITE } from "../data/site";

export const waLink = (text = "") => `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const tgLink = () => `https://t.me/${SITE.telegram}`;
export const telLink = () => `tel:${SITE.phoneE164}`;
export function mailtoLink(subject, fields = {}) {
  const body = Object.entries(fields).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => `${k}: ${v}`).join("\n");
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
