import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Footer, TopNav } from "./components/Shell";
import { SupportDock } from "./components/SupportDock";
import { Toast } from "./components/vx";
import { HomePage } from "./pages/HomePage";
import { VardasPage } from "./pages/VardasPage";
import { EventsPage } from "./pages/EventsPage";
import { TablesPage } from "./pages/TablesPage";
import { MenuPage } from "./pages/MenuPage";
import { GettingHerePage } from "./pages/GettingHerePage";
import { YourTermsPage } from "./pages/YourTermsPage";
import { FaqPage } from "./pages/FaqPage";
import { VenuePage } from "./pages/VenuePage";
import { VenueEnquirePage } from "./pages/VenueEnquirePage";
import { GalleryPage } from "./pages/GalleryPage";
import { ContactPage } from "./pages/ContactPage";
import { WorkWithUsPage } from "./pages/WorkWithUsPage";

const TITLES = {
  "/": "Vardas Entertainment — Vardas · Vardas Venue · Addis Ababa",
  "/vardas": "Vardas — Lounge & Club · Bole", "/vardas/events": "Events — Vardas", "/vardas/tables": "VIP tables — Vardas",
  "/vardas/menu": "Menu & prices — Vardas", "/vardas/getting-here": "Getting here — Vardas", "/vardas/your-terms": "Your terms — Vardas", "/vardas/faq": "FAQ — Vardas",
  "/venue": "Vardas Venue — Premium event space", "/venue/enquire": "Plan your event — Vardas Venue",
  "/gallery": "Gallery — Vardas Entertainment", "/contact": "Contact — Vardas Entertainment", "/work-with-us": "Work with us — Vardas Entertainment",
};

export default function PublicApp() {
  const { pathname } = useLocation();
  const [toast, setToast] = useState("");
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); document.title = TITLES[pathname] || "Vardas Entertainment"; }, [pathname]);
  const p = { onToast: setToast };
  return (
    <div className="min-h-screen bg-ink text-paper">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] cta-fill text-ink px-4 py-2">Skip to content</a>
      <TopNav />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage {...p} />} />
          <Route path="/vardas" element={<VardasPage {...p} />} />
          <Route path="/vardas/events" element={<EventsPage {...p} />} />
          <Route path="/vardas/events/:slug" element={<EventsPage {...p} />} />
          <Route path="/vardas/tables" element={<TablesPage {...p} />} />
          <Route path="/vardas/menu" element={<MenuPage {...p} />} />
          <Route path="/vardas/getting-here" element={<GettingHerePage {...p} />} />
          <Route path="/vardas/your-terms" element={<YourTermsPage {...p} />} />
          <Route path="/vardas/faq" element={<FaqPage {...p} />} />
          <Route path="/venue" element={<VenuePage {...p} />} />
          <Route path="/venue/enquire" element={<VenueEnquirePage {...p} />} />
          <Route path="/gallery" element={<GalleryPage {...p} />} />
          <Route path="/contact" element={<ContactPage {...p} />} />
          <Route path="/work-with-us" element={<WorkWithUsPage {...p} />} />
          {/* old MVP routes */}
          <Route path="/menu" element={<Navigate to="/vardas/menu" replace />} />
          <Route path="/club" element={<Navigate to="/vardas" replace />} />
          <Route path="/events" element={<Navigate to="/vardas/events" replace />} />
          <Route path="/hire" element={<Navigate to="/venue/enquire" replace />} />
          <Route path="/tours" element={<Navigate to="/venue" replace />} />
          <Route path="/getting-here" element={<Navigate to="/vardas/getting-here" replace />} />
          <Route path="/your-terms" element={<Navigate to="/vardas/your-terms" replace />} />
          <Route path="/artists" element={<Navigate to="/work-with-us" replace />} />
          <Route path="/careers" element={<Navigate to="/work-with-us" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer onToast={setToast} />
      <SupportDock />
      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}
