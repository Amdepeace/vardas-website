import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import PublicApp from "./PublicApp";
import { AdminGuard } from "./admin/AdminGuard";
import { AdminLayout } from "./admin/AdminLayout";
import { AdminLogin } from "./admin/AdminLogin";
import { ReservationsPage } from "./admin/pages/ReservationsPage";
import { MenuAdminPage } from "./admin/pages/MenuAdminPage";
import { EventsAdminPage } from "./admin/pages/EventsAdminPage";
import { EnquiriesPage } from "./admin/pages/EnquiriesPage";
import { AdminComingSoon } from "./admin/AdminComingSoon";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<Navigate to="/admin/reservations" replace />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="menu" element={<MenuAdminPage />} />
            <Route path="events" element={<EventsAdminPage />} />
            <Route path="enquiries" element={<EnquiriesPage />} />
            <Route path=":section" element={<AdminComingSoon />} />
          </Route>
          <Route path="/*" element={<PublicApp />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
