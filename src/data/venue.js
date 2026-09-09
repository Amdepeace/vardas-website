// Vardas venue constants used across pages. Facts come from the source table
// (see places.json → vardas_facts); zones/policies mirror supabase/seed_vardas.sql.
export const VENUE = {
  name: "Vardas",
  address: "5th floor, Getu Commercial Building, Africa Avenue, Bole, Addis Ababa",
  altitude_m: 2355,
  phone: "+251 11 000 0000",
  whatsapp: "+251 11 000 0000",
  hours: [
    { label: "Business lunch", time: "Mon – Fri · 12:00 – 15:00" },
    { label: "Dinner & terrace", time: "Daily · 18:00 – 23:00" },
    { label: "Club", time: "Thu – Sat · 22:00 – late" },
  ],
  emergency: [{ label: "Police", number: "991" }, { label: "Ambulance", number: "907" }, { label: "Floor manager", number: "+251 11 000 0000" }],
};

export const ZONES = [
  { id: "terrace", title: "Terrace", capacity: 80, smoking: true, blurb: "Open air above Africa Avenue. Hookah and smoking live here, in marked areas.", tour: "terrace" },
  { id: "lounge", title: "Lounge", capacity: 60, smoking: false, blurb: "Smoke-free, low-lit, the interior the city talks about. Dinner, cocktails, live sets.", tour: "lounge" },
  { id: "club-floor", title: "Club floor", capacity: 200, smoking: false, blurb: "DJs Thursday to Saturday. Smoke-free. Dress smart.", tour: "club-floor" },
  { id: "private-1", title: "Private room I", capacity: 24, smoking: false, blurb: "Closed door, own sound, own service. Dinners, launches, birthdays.", tour: "private-1" },
];

export const POLICIES = [
  { slug: "no-pressure", title: "No pressure, ever", answers: "Pressure to buy expensive liquor — up to ETB 19,200", body: "Every price on this site is the price you pay. Bottle service is available only when you ask for it, and its minimum is printed on the zone page. Ask for a bill preview at any time." },
  { slug: "smoke-free-zones", title: "Smoke-free zones", answers: "Smoking allowed indoors", body: "The lounge and club floor are smoke-free. Hookah and smoking are on the terrace, in marked areas only." },
  { slug: "staff-standards", title: "Our staff standards", answers: "Some reports of unprofessional staff", body: "A named floor manager is on duty every night. Every team member is trained on our pledge. Feedback is answered within 24 hours." },
  { slug: "altitude", title: "You are at 2,355 m", answers: "High altitude may increase the effects of alcohol", body: "Addis Ababa sits at 2,355 m. Alcohol works faster and harder here. Water is free, always — just ask." },
  { slug: "ride-home", title: "A safe ride home", answers: null, body: "We work only with vetted drivers and partners. Ask any staff member, scan the table QR, or tick \"ride home\" when you reserve." },
  { slug: "womens-safety", title: "Women's safety", answers: null, body: "Our door and floor teams are trained to intervene. If anyone makes you uncomfortable, tell any staff member — we will handle it quietly and immediately." },
];
