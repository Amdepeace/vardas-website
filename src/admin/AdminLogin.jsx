import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function AdminLogin() {
  const { user, signIn, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (loading) return null;
  if (user) {
    const to = location.state?.from?.pathname || "/admin/bookings";
    return <Navigate to={to} replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    const to = location.state?.from?.pathname || "/admin/bookings";
    navigate(to, { replace: true });
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <div className="hidden md:flex flex-col justify-between bg-deep-navy text-warm-gold p-12">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined ms-fill text-warm-gold text-4xl">
            hotel_class
          </span>
          <div>
            <h1 className="display text-3xl tracking-tight uppercase">Vardas</h1>
            <p className="text-[11px] tracking-[0.18em] uppercase opacity-70">
              Staff Portal
            </p>
          </div>
        </div>
        <blockquote className="display text-2xl text-cream/85 leading-relaxed max-w-md">
          "There is an unhurried generosity to the place — the way coffee arrives,
          the way the light moves through the corridor at four o'clock."
        </blockquote>
        <p className="text-[11px] tracking-[0.25em] uppercase opacity-60">
          Management Console · v0.1
        </p>
      </div>

      <div className="flex items-center justify-center p-8">
        <form onSubmit={onSubmit} className="w-full max-w-sm">
          <h2 className="display text-headline-lg text-deep-navy mb-2">
            Sign in
          </h2>
          <p className="text-on-surface-variant text-body-md mb-8">
            Use your Vardas staff credentials.
          </p>

          <label className="block mb-5">
            <span className="text-label-caps text-outline uppercase block mb-1">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-warm-gold focus:border-warm-gold"
              placeholder="you@bellevue.com"
            />
          </label>

          <label className="block mb-6">
            <span className="text-label-caps text-outline uppercase block mb-1">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-warm-gold focus:border-warm-gold"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <div className="mb-5 px-3 py-2 bg-error-container text-on-error-container text-sm rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-warm-gold text-white text-cta-label uppercase py-3 rounded hover:bg-secondary-fixed-dim transition-colors disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-[11px] text-outline mt-6 leading-relaxed">
            Staff accounts are created in Supabase Auth and authorised via the{" "}
            <code className="font-mono">staff_roles</code> table.
          </p>
        </form>
      </div>
    </div>
  );
}
