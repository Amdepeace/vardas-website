import { useEffect, useRef } from "react";
/**
 * Fade-and-rise when scrolled into view. Content is visible by default: it is only
 * hidden once we know it starts below the fold and the observer is running, and a
 * timer reveals it regardless, so nothing can stay invisible.
 */
export function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.classList.add("fade-up");
    const show = () => el.classList.add("in");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { setTimeout(show, delay); io.disconnect(); } }), { rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    const t = setTimeout(show, 4000);
    return () => { io.disconnect(); clearTimeout(t); };
  }, [delay]);
  return <div ref={ref} className={className}>{children}</div>;
}
