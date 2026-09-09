import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Footer, MobileHeader, NAV_ITEMS, SideRail, pathToId } from "./components/Shell";
import { ReservationModal, Toast } from "./components/ReservationModal";
import { HostWidget } from "./components/HostWidget";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { ClubPage } from "./pages/ClubPage";
import { EventsPage } from "./pages/EventsPage";
import { HirePage } from "./pages/HirePage";
import { ToursPage } from "./pages/ToursPage";
import { GettingHerePage } from "./pages/GettingHerePage";
import { YourTermsPage } from "./pages/YourTermsPage";
import { ArtistsPage } from "./pages/ArtistsPage";
import { CareersPage } from "./pages/CareersPage";
import { ContactPage } from "./pages/ContactPage";

export default function PublicApp() {
  const location = useLocation();
  const nav = useNavigate();
  const active = pathToId(location.pathname);

  useEffect(() => { document.body.setAttribute("data-density", "spacious"); }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [location.pathname]);

  // Brass spotlight that follows the pointer over hero sections.
  useEffect(() => {
    const handlers = new Map();
    function attach() {
      document.querySelectorAll('section[data-screen-label*="Hero"]').forEach((el) => {
        if (handlers.has(el)) return;
        const onMove = (e) => { const r = el.getBoundingClientRect(); el.style.setProperty("--mx", `${e.clientX - r.left}px`); el.style.setProperty("--my", `${e.clientY - r.top}px`); el.style.setProperty("--blob-opacity", "1"); };
        const onLeave = () => el.style.setProperty("--blob-opacity", "0");
        el.addEventListener("mousemove", onMove); el.addEventListener("mouseleave", onLeave);
        handlers.set(el, { onMove, onLeave });
      });
    }
    attach();
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { mo.disconnect(); handlers.forEach(({ onMove, onLeave }, el) => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); }); };
  }, []);

  function navigate(id) {
    const item = NAV_ITEMS.find((n) => n.id === id);
    nav(item ? item.path : "/");
  }

  const [modal, setModal] = useState({ open: false, prefill: null });
  const [toast, setToast] = useState("");
  const openReserve = (prefill) => setModal({ open: true, prefill: prefill || null });
  const props = { onNavigate: navigate, onReserve: openReserve, onToast: setToast };

  return (
    <div className="min-h-screen bg-paper">
      <SideRail active={active} onNavigate={navigate} onReserve={() => openReserve()} />
      <MobileHeader active={active} onNavigate={navigate} onReserve={() => openReserve()} />
      <main className="md:ml-[88px] xl:ml-[104px] pt-14 md:pt-0">
        <Routes>
          <Route path="/" element={<HomePage {...props} />} />
          <Route path="/menu" element={<MenuPage {...props} />} />
          <Route path="/club" element={<ClubPage {...props} />} />
          <Route path="/events" element={<EventsPage {...props} />} />
          <Route path="/events/:slug" element={<EventsPage {...props} />} />
          <Route path="/hire" element={<HirePage {...props} />} />
          <Route path="/tours" element={<ToursPage {...props} />} />
          <Route path="/tours/:slug" element={<ToursPage {...props} />} />
          <Route path="/getting-here" element={<GettingHerePage {...props} />} />
          <Route path="/your-terms" element={<YourTermsPage {...props} />} />
          <Route path="/artists" element={<ArtistsPage {...props} />} />
          <Route path="/careers" element={<CareersPage {...props} />} />
          <Route path="/contact" element={<ContactPage {...props} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer onNavigate={navigate} />
      </main>
      <ReservationModal open={modal.open} prefill={modal.prefill} onClose={() => setModal({ open: false, prefill: null })} onConfirm={() => setToast("Reservation request received")} />
      <Toast message={toast} onDone={() => setToast("")} />
      <HostWidget />
    </div>
  );
}
