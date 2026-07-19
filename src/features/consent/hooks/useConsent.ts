"use client";

import { useCallback, useEffect, useState } from "react";

export type ConsentChoice = "accepted" | "declined";

const COOKIE_NAME = "eprox-consent";
/** How long a choice is remembered: 180 days, in seconds. */
const COOKIE_MAX_AGE = 180 * 24 * 60 * 60;
/** Small delay before the modal enters, so it doesn't fight the hero's own intro. */
const OPEN_DELAY_MS = 900;

// The choice is persisted in a first-party cookie — the semantically right
// store for cookie consent (and the project bans localStorage).
function readStoredChoice(): ConsentChoice | null {
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_NAME}=`));
  const value = match?.split("=")[1];
  return value === "accepted" || value === "declined" ? value : null;
}

function storeChoice(choice: ConsentChoice) {
  document.cookie = `${COOKIE_NAME}=${choice}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
}

/**
 * Drives the privacy/cookie consent modal: opens shortly after first load
 * when no stored choice exists, and closes for 180 days once the visitor
 * accepts or declines.
 */
export function useConsent() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!readStoredChoice()) setIsOpen(true);
    }, OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const choose = useCallback((choice: ConsentChoice) => {
    storeChoice(choice);
    setIsOpen(false);
  }, []);

  return { isOpen, choose };
}
