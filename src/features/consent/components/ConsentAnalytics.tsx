"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_EVENT, readStoredChoice } from "../hooks/useConsent";

// Analytics script origin (e.g. Plausible/Umami embed). Inlined at build
// time; when unset, this component renders nothing at all.
const ANALYTICS_SRC = process.env.NEXT_PUBLIC_ANALYTICS_SRC;

/**
 * The consent dialog's teeth: the analytics script only ever loads after an
 * explicit "accept" — read from the stored cookie on mount, or live via the
 * consent event when the visitor accepts during the session. Declining (or
 * never answering) keeps the page entirely script-free.
 */
export default function ConsentAnalytics() {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const sync = () => {
      if (readStoredChoice() === "accepted") setIsAllowed(true);
    };
    const timer = setTimeout(sync, 0);
    window.addEventListener(CONSENT_EVENT, sync);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(CONSENT_EVENT, sync);
    };
  }, []);

  if (!ANALYTICS_SRC || !isAllowed) return null;

  return <Script src={ANALYTICS_SRC} strategy="lazyOnload" />;
}
