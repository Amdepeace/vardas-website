import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function AdminGuard({ children }) {
  const { user, isStaff, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-outline font-mono text-[11px] uppercase tracking-[0.25em]">
          Loading…
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8 text-center">
        <div className="max-w-md">
          <h1 className="playfair text-headline-lg text-ink mb-3">
            No staff access
          </h1>
          <p className="text-on-surface-variant text-body-md">
            Your account is signed in but has no staff role assigned. Ask an
            administrator to add a row to{" "}
            <code className="font-mono text-[12px] bg-surface-container px-1.5 py-0.5 rounded">
              staff_roles
            </code>{" "}
            for your user id.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
