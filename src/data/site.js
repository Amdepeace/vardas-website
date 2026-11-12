// Vardas Entertainment — single source of truth for the public site.
// Edit here: venues, contact channels, nav, starter events, FAQ, gallery.

export const SITE = {
  name: "Vardas Entertainment",
  domain: "vardasentertainment.com",
  email: "vardasvenue@gmail.com",
  // Ethiopian mobile in E.164. Supplied as +251 0911 522 856; the trunk "0" is dropped internationally.
  phoneE164: "+251911522856",
  phoneDisplay: "+251 911 522 856",
  whatsapp: "251911522856",
  telegram: "+251911522856",
  city: "Addis Ababa, Ethiopia",
  // RSVP lines printed on every Vardas poster.
  rsvp: [["+251948665620", "+251 948 66 56 20"], ["+251911771480", "+251 911 77 14 80"]],
};

export const VENUES = {
  vardas: {
    id: "vardas",
    name: "Vardas",
    kind: "Lounge & club",
    path: "/vardas",
    tagline: "Fifth floor. Lasers, live sets and the Bole night.",
    address: "5th floor, Getu Commercial Building, Africa Avenue, Bole, Addis Ababa",
    hours: [["Lounge & dinner", "Daily · 18:00 – late"], ["Club nights", "Thu – Sat · 22:00 – late"], ["Business lunch", "Mon – Fri · 12:00 – 15:00"]],
    instagram: { handle: "vardaslounge", url: "https://www.instagram.com/vardaslounge/" },
    image: "/gallery/vardas-night-13.jpg",
  },
  venue: {
    id: "vardas-venue",
    name: "Vardas Venue",
    kind: "Premium event space",
    path: "/venue",
    tagline: "Corporate events, private parties, concerts, shows and weddings.",
    address: "Welo Sefer, Addis Ababa — the former Kana Studio",
    offerings: [
      ["Premium Event Space", "A full-production room for the nights that have to be remembered."],
      ["Corporate Events", "Launches, galas, award nights and end-of-year parties, run to your brief."],
      ["Private Parties", "Birthdays and milestones with your guest list, your music, your bar."],
      ["Concerts & Shows", "Stage, sound and light for live acts, DJs and touring shows."],
      ["Weddings & Celebrations", "Receptions and after-parties, styled and staffed end to end."],
    ],
    instagram: { handle: "vardas_venue", url: "https://www.instagram.com/vardas_venue/" },
    image: "/gallery/venue-hero.jpg",
    card: "/gallery/gold-mark-3d.jpg",
  },
};

// Top nav, LIV-style: logo · venue switcher pill · centred links (Events has a dropdown).
export const NAV_LINKS = [
  { label: "Events", to: "/vardas/events", items: [["Upcoming events", "/vardas/events"], ["Aura Thursday", "/vardas/events/aura-thursday"], ["Afro Verse Friday", "/vardas/events/afro-verse"], ["Frenzy Saturday", "/vardas/events/frenzy-saturday"], ["The Sunday Jam", "/vardas/events/sunday-jam"]] },
  { label: "Venue", to: "/vardas" },
  { label: "Corporate", to: "/venue" },
  { label: "Menu", to: "/vardas/menu" },
  { label: "Reserve", to: "/vardas/tables" },
  { label: "Gallery", to: "/gallery" },
  { label: "FAQs", to: "/vardas/faq" },
];
export const SWITCHER = [["Vardas", "Lounge & club · Bole", "/vardas"], ["Vardas Venue", "Event space · Welo Sefer", "/venue"]];

// Weekly programme from the Vardas posters; published Supabase events replace it.
export const STARTER_EVENTS = [
  { slug: "aura-thursday", title: "Aura Thursday", kind: "Live & DJs", weekday: 4, time: "21:00", lineup: ["Titem", "Eyu", "Teddy", "Sol Romeyo", "Henok"], cover: null, dress: "Smart", image: "/events/aura-thursday.jpg" },
  { slug: "afro-verse", title: "Afro Verse", kind: "Afro night", weekday: 5, time: "22:00", lineup: ["Donat", "JJ Kassa", "Gerum", "Sayimne", "Bini", "Sol Romeyo", "Henok"], cover: null, dress: "Smart", image: "/events/afro-verse.jpg" },
  { slug: "frenzy-saturday", title: "Frenzy Saturday", kind: "Club night", weekday: 6, time: "22:00", lineup: ["Upon", "Titem", "Foxx", "Henok", "Leul", "Sol Romeyo"], cover: null, dress: "Smart", image: "/events/frenzy-saturday.jpg" },
  { slug: "sunday-jam", title: "The Sunday Jam", kind: "Live band", weekday: 0, time: "20:00", lineup: ["Abdu Kiar", "Jhonny", "Jojo"], cover: null, dress: "Smart casual", image: "/events/sunday-jam.jpg" },
];

// Next date for a weekly starter event, formatted for display.
export function nextDate(weekday, time) {
  const d = new Date(); const [h, m] = time.split(":").map(Number);
  const add = (weekday - d.getDay() + 7) % 7; d.setDate(d.getDate() + add); d.setHours(h, m, 0, 0);
  return d;
}

export const TABLE_ZONES = [
  { id: "club-floor", name: "Club floor", seats: "6 – 12", note: "Next to the booth. Smoke-free." },
  { id: "lounge", name: "Lounge", seats: "4 – 10", note: "Low light, conversation, live sets. Smoke-free." },
  { id: "terrace", name: "Terrace", seats: "4 – 8", note: "Open air above Africa Avenue. Hookah here." },
  { id: "private-1", name: "Private room", seats: "up to 24", note: "Closed door, own service and sound." },
];

export const FAQ = [
  ["Is there a dress code?", "Smart. No sportswear, flip-flops or caps on club nights. The door team has the final say."],
  ["Do I need ID?", "Yes — bring a valid government ID or passport. Entry may be refused without one."],
  ["How do VIP tables work?", "Request a table on the VIP tables page, WhatsApp or Telegram. A host confirms by phone with the zone, any minimum spend and your arrival time. Bottle service is only ever on request."],
  ["Is there a cover charge?", "Cover is published on each event. If it isn't listed, it isn't charged."],
  ["Can I smoke?", "The lounge and club floor are smoke-free. Hookah and smoking are on the terrace only."],
  ["How do I get home safely?", "Ask any staff member, scan the table QR, or tick “ride home” when you book — we use vetted drivers and partners."],
  ["Can I book Vardas Venue for a private event?", "Yes — corporate events, private parties, concerts and shows, weddings and celebrations. Send your date and guest count on the Plan your event page."],
];

export const GALLERY = [
  { src: "/gallery/vardas-night-13.jpg", alt: "Red lasers over the crowd under the Vardas sign", venue: "vardas", wide: true },
  { src: "/gallery/vardas-night-3.jpg", alt: "Vardas club floor at night", venue: "vardas" },
  { src: "/gallery/vardas-night-18.jpg", alt: "Green beams and lasers across the room", venue: "vardas" },
  { src: "/gallery/vardas-night-23.jpg", alt: "The booth and the crowd at Vardas", venue: "vardas" },
  { src: "/gallery/venue-hero.jpg", alt: "The Vardas mark over a crowd at Vardas Venue", venue: "vardas-venue", wide: true },
  { src: "/gallery/crowd-hands.jpg", alt: "Hands up under the lights at a show", venue: "vardas-venue" },
  { src: "/gallery/gold-particles.jpg", alt: "Gold light and particles", venue: "vardas-venue" },
  { src: "/gallery/vardas-night-6.jpg", alt: "Green beams over the dance floor", venue: "vardas" },
  { src: "/gallery/vardas-night-26.jpg", alt: "Lasers across the Vardas room", venue: "vardas" },
  { src: "/brand/vardas-venue-wordmark.jpg", alt: "Vardas Venue wordmark in gold", venue: "vardas-venue", fit: "contain" },
  { src: "/gallery/gold-mark-3d.jpg", alt: "The Vardas mark in gold", venue: "vardas-venue" },
];
