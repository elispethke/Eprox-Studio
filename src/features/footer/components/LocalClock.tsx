"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Berlin",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * Studio local time — the small "we're a real place" signature. Rendered
 * empty on the server (no hydration mismatch), ticking every 30s after.
 */
export default function LocalClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    const interval = setInterval(tick, 30_000);
    tick();
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-xs tracking-[0.15em] text-espresso/50">
      Berlin{time && ` — ${time} CET`}
    </span>
  );
}
