"use client";

interface FloatingFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
  /** Renders a textarea instead of an input. */
  multiline?: boolean;
  error?: string;
  autoComplete?: string;
}

const CONTROL_CLASSNAME =
  "peer w-full border-b border-espresso/25 bg-transparent pb-2.5 pt-6 font-subtitle text-sm text-espresso caret-copper outline-none transition-colors placeholder:text-transparent";

const LABEL_CLASSNAME =
  "pointer-events-none absolute left-0 top-5 origin-left font-mono text-xs uppercase tracking-[0.2em] text-espresso/95 transition-all duration-300 " +
  "peer-focus:top-0 peer-focus:scale-90 peer-focus:text-espresso " +
  "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-90";

/**
 * Floating-label field on the light glass card: the label starts inline and
 * lifts/shrinks on focus or once filled; an accent underline sweeps in from
 * the left while focused. Error state swaps the underline and message to the
 * bronze tone.
 */
export default function FloatingField({
  id,
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  error,
  autoComplete,
}: FloatingFieldProps) {
  const describedBy = error ? `${id}-error` : undefined;

  const control = multiline ? (
    <textarea
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={label}
      rows={4}
      aria-invalid={Boolean(error)}
      aria-describedby={describedBy}
      className={`${CONTROL_CLASSNAME} resize-none`}
    />
  ) : (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={label}
      autoComplete={autoComplete}
      aria-invalid={Boolean(error)}
      aria-describedby={describedBy}
      className={CONTROL_CLASSNAME}
    />
  );

  return (
    <div className="relative">
      {control}
      <label htmlFor={id} className={LABEL_CLASSNAME}>
        {label}
      </label>
      {/* Accent underline — sweeps in on focus, holds bronze while errored. */}
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r transition-transform duration-300 ${
          error
            ? "scale-x-100 from-rust-dark to-rust-dark"
            : "scale-x-0 from-copper-light to-copper peer-focus:scale-x-100"
        }`}
      />
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-rust-dark"
        >
          {error}
        </p>
      )}
    </div>
  );
}
