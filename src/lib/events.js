import { useEffect, useState } from "react";
import { backendReady } from "./api";
import { supabase } from "./supabase";
import { STARTER_EVENTS, nextDate } from "../data/site";

const IMAGES = ["/gallery/vardas-night-13.jpg", "/gallery/vardas-night-3.jpg", "/gallery/vardas-night-18.jpg", "/gallery/vardas-night-23.jpg"];
const starter = () => STARTER_EVENTS.map((e) => ({ ...e, date: nextDate(e.weekday, e.time) })).sort((a, b) => a.date - b.date);

/** Upcoming events: published rows from Supabase, else the weekly starter programme. */
export function useEvents() {
  const [events, setEvents] = useState(starter);
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (!backendReady) return;
    supabase.from("events").select("*").eq("published", true).gte("starts_at", new Date(Date.now() - 6 * 3600e3).toISOString()).order("starts_at").limit(24)
      .then(({ data }) => {
        if (!data?.length) return;
        setLive(true);
        setEvents(data.map((r, i) => {
          const d = new Date(r.starts_at);
          return { slug: r.slug, title: r.title, kind: r.kind.replace("-", " "), date: d, time: d.toTimeString().slice(0, 5), lineup: r.lineup || [], cover: r.cover_etb ?? 0, dress: r.dress_code || "Smart", image: r.poster_path || IMAGES[i % IMAGES.length] };
        }));
      });
  }, []);
  return { events, live };
}
