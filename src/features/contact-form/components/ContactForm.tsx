"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useContactForm } from "../hooks/useContactForm";
import FloatingField from "./FloatingField";
import SubmitButton from "./SubmitButton";

/**
 * The glassmorphism form card, tuned for the light linen base: a faint
 * espresso-tinted glass fill with backdrop blur inside a 1px copper-gradient
 * border. Talks exclusively to the internal /api/contact relay — this
 * component has no knowledge of the real upstream form endpoint.
 */
export default function ContactForm() {
  const t = useTranslations("contact");
  const { values, fieldErrors, status, setValue, submit } = useContactForm();

  const errorText = (field: "name" | "email" | "subject" | "message") => {
    const code = fieldErrors[field];
    return code ? t(`errors.${code}`) : undefined;
  };

  return (
    <motion.form
      onSubmit={submit}
      noValidate
      animate={status === "error" ? { x: [0, -9, 9, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="relative rounded-3xl bg-gradient-to-br from-copper-light/40 via-copper/25 to-copper/10 px-7 py-9 shadow-[0_30px_80px_-30px_rgba(43,36,32,0.3)] backdrop-blur-[20px] sm:px-10 sm:py-11"
    >
      {/* Copper glass: the same warm tint as the brand gradient, but
          translucent — the parallax shapes stay visible through the blur.
          The 1px ring below is painted separately via mask so the border
          reads crisper than the fill. */}
      <span aria-hidden="true" className="glass-border-copper" />

      <div className="grid gap-7 sm:grid-cols-2">
        <FloatingField
          id="contact-name"
          label={t("fields.name")}
          value={values.name}
          onChange={(value) => setValue("name", value)}
          error={errorText("name")}
          autoComplete="name"
        />
        <FloatingField
          id="contact-email"
          label={t("fields.email")}
          type="email"
          value={values.email}
          onChange={(value) => setValue("email", value)}
          error={errorText("email")}
          autoComplete="email"
        />
      </div>

      <div className="mt-7">
        <FloatingField
          id="contact-subject"
          label={t("fields.subject")}
          value={values.subject}
          onChange={(value) => setValue("subject", value)}
          error={errorText("subject")}
        />
      </div>

      <div className="mt-7">
        <FloatingField
          id="contact-message"
          label={t("fields.message")}
          multiline
          value={values.message}
          onChange={(value) => setValue("message", value)}
          error={errorText("message")}
        />
      </div>

      {/* Honeypot — invisible to humans (and skipped by keyboard/screen
            readers); bots that fill every field give themselves away. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => setValue("website", event.target.value)}
        />
      </div>

      <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton
          status={status}
          idleLabel={t("submit")}
          loadingLabel={t("sending")}
        />
        <p
          role="status"
          aria-live="polite"
          className={`font-subtitle text-sm ${
            status === "success"
              ? "text-espresso/80"
              : status === "error"
                ? "text-rust-dark"
                : "text-transparent"
          }`}
        >
          {status === "success"
            ? t("success")
            : status === "error"
              ? t("error")
              : " "}
        </p>
      </div>
    </motion.form>
  );
}
