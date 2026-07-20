"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Streams real-user Core Web Vitals to /api/vitals via sendBeacon (falls
 * back to keepalive fetch), so field performance is observable in
 * production logs rather than guessed at.
 */
export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const payload = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      path: window.location.pathname,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/vitals", payload);
    } else {
      void fetch("/api/vitals", {
        method: "POST",
        body: payload,
        keepalive: true,
        headers: { "Content-Type": "application/json" },
      });
    }
  });

  return null;
}
