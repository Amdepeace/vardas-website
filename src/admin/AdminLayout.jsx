import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV = [
  { to: "/admin/reservations", icon: "table_restaurant", label: "Tables", live: true },
  { to: "/admin/menu", icon: "restaurant_menu", label: "Menu", live: true },
  { to: "/admin/events", icon: "event", label: "Events", live: true },
  { to: "/admin/enquiries", icon: "inbox", label: "Enquiries", live: true },
  { to: "/admin/places", icon: "map", label: "Places", live: false },
  { to: "/admin/tours", icon: "360", label: "Tours", live: false },
  { to: "/admin/advisories", icon: "campaign", label: "Advisories", live: false },
  { to: "/admin/policies", icon: "verified_user", label: "Pledge", live: false, divider: true },
];

export function AdminLayout() {
  const { signOut, role, user } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  const initials = (role?.display_name || user?.email || "?")
    .split(/[\s@]/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background text-on-background flex">
      <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 py-8 items-center w-[120px] bg-ink border-r border-outline-variant">
        <div className="mb-10 flex flex-col items-center text-center px-2">
          <span className="material-symbols-outlined ms-fill text-red text-4xl mb-2">
            nightlife
          </span>
          <h1 className="display text-red tracking-tight uppercase text-xl leading-tight">
            Vardas
          </h1>
          <span className="text-[11px] tracking-[0.18em] text-on-primary-container mt-1 uppercase opacity-80">
            Staff Portal
          </span>
        </div>

        <div className="flex flex-col w-full gap-3 px-3 flex-grow">
          {NAV.map((item) => (
            <div key={item.to}>
              {item.divider && (
                <div className="h-px bg-on-primary-container/20 mx-3 my-1" />
              )}
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `nav-item w-full block ${isActive ? "active" : ""} ${
                    item.live ? "" : "opacity-60"
                  }`
                }
                title={item.live ? item.label : `${item.label} (coming soon)`}
              >
                <div className="nav-inner flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300">
                  <span className="material-symbols-outlined mb-1 text-2xl">
                    {item.icon}
                  </span>
                  <span className="text-label-caps">{item.label}</span>
                </div>
              </NavLink>
            </div>
          ))}
        </div>

        <div className="flex flex-col w-full gap-2 px-3 mt-auto">
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center p-2 text-on-primary-container opacity-70 hover:text-red hover:bg-primary-container/50 transition-all duration-300 rounded-lg w-full"
          >
            <span className="material-symbols-outlined text-xl mb-1">logout</span>
            <span className="text-[10px] tracking-[0.15em] uppercase font-semibold">
              Exit
            </span>
          </button>
        </div>
      </nav>

      <main className="flex-1 md:ml-[120px] min-h-screen flex flex-col">
        <header className="flex justify-between items-center h-20 w-full px-5 md:px-10 bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-30">
          <h1 className="display text-headline-lg font-medium text-ink">
            Vardas · Staff console
          </h1>
          <div className="flex items-center gap-6">
            <button className="text-on-surface-variant hover:text-red transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red"></span>
            </button>
            <div
              title={role?.display_name || user?.email}
              className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant bg-primary-container flex items-center justify-center text-red display text-sm font-semibold"
            >
              {initials || "?"}
            </div>
          </div>
        </header>

        <div className="px-5 md:px-10 py-10 flex-1 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
