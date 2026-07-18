"use client";

import { useCallback, useState, type FormEvent } from "react";
import {
  contactSchema,
  type ContactField,
  type ContactResponse,
} from "../schema";

export type ContactStatus = "idle" | "loading" | "success" | "error";

/** i18n-agnostic error codes — the component maps them to localized copy. */
export type FieldErrorCode = "required" | "email" | "tooShort";

interface ContactValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot — never surfaced in the UI, submitted along for the server check. */
  website: string;
}

const EMPTY_VALUES: ContactValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

function toErrorCode(field: ContactField, value: string): FieldErrorCode {
  if (field === "email") return value.trim() ? "email" : "required";
  if (field === "message" && value.trim()) return "tooShort";
  return "required";
}

/**
 * Orchestrates the contact form: field values, per-field validation against
 * the shared zod schema, and the idle → loading → success/error submit
 * lifecycle against the internal /api/contact relay (the client never knows
 * the real upstream endpoint).
 */
export function useContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ContactField, FieldErrorCode>>
  >({});
  const [status, setStatus] = useState<ContactStatus>("idle");

  const setValue = useCallback((field: keyof ContactValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) =>
      field in current ? { ...current, [field]: undefined } : current,
    );
    // Editing after a result restarts the cycle.
    setStatus((current) =>
      current === "success" || current === "error" ? "idle" : current,
    );
  }, []);

  const validate = useCallback((): boolean => {
    const parsed = contactSchema.safeParse(values);
    if (parsed.success) {
      setFieldErrors({});
      return true;
    }

    const errors: Partial<Record<ContactField, FieldErrorCode>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (
        field === "name" ||
        field === "email" ||
        field === "subject" ||
        field === "message"
      ) {
        errors[field] ??= toErrorCode(field, values[field]);
      }
    }
    setFieldErrors(errors);
    return false;
  }, [values]);

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === "loading") return;
      if (!validate()) return;

      setStatus("loading");
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const result = (await response
          .json()
          .catch(() => null)) as ContactResponse | null;

        if (response.ok && result?.success) {
          setStatus("success");
          setValues(EMPTY_VALUES);
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    },
    [status, validate, values],
  );

  return { values, fieldErrors, status, setValue, submit };
}
