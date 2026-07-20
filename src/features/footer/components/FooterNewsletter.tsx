"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Check, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { z } from "zod";

type NewsletterStatus = "idle" | "loading" | "success" | "error";

/**
 * Glass newsletter signup, same visual family as the contact card. Reuses
 * the /api/contact relay (tagged as a newsletter signup) so no extra
 * endpoint — and no third-party service — is exposed to the client.
 */
export default function FooterNewsletter() {
  const t = useTranslations("footer");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;
    if (!z.email().safeParse(email).success) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter",
          email,
          subject: "Newsletter subscription",
          message: `Please add ${email} to the Eprox Studio newsletter list.`,
          website: "",
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        success?: boolean;
      } | null;
      if (response.ok && result?.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-espresso/60">
        {t("newsletterTitle")}
      </span>
      <form onSubmit={submit} noValidate className="mt-4">
        <div className="flex items-center gap-2 rounded-full border border-copper/40 bg-espresso/[0.05] py-1.5 pl-5 pr-1.5 backdrop-blur-[12px] transition-colors focus-within:border-copper">
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status !== "idle") setStatus("idle");
            }}
            placeholder={t("newsletterPlaceholder")}
            aria-label={t("newsletterPlaceholder")}
            className="w-full min-w-0 bg-transparent font-subtitle text-sm text-espresso outline-none placeholder:text-espresso/40"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            aria-label={t("subscribe")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-copper to-rust-dark text-linen transition-shadow hover:shadow-[0_6px_18px_-6px_rgba(212,152,110,0.8)] disabled:cursor-default"
          >
            {status === "loading" ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : status === "success" ? (
              <Check aria-hidden="true" className="h-4 w-4" />
            ) : (
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        </div>
        <p
          role="status"
          aria-live="polite"
          className={`mt-2 min-h-[1.25rem] font-subtitle text-xs ${
            status === "success"
              ? "text-espresso/70"
              : status === "error"
                ? "text-rust-dark"
                : "text-transparent"
          }`}
        >
          {status === "success"
            ? t("newsletterSuccess")
            : status === "error"
              ? t("newsletterError")
              : " "}
        </p>
      </form>
    </div>
  );
}
