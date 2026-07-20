import type { ReactElement } from "react";
import { NextIntlClientProvider } from "next-intl";
import { render, type RenderOptions } from "@testing-library/react";
import en from "@/lib/i18n/dictionaries/en.json";

/**
 * Renders with the REAL English dictionary (not a mock translator), so a
 * missing/renamed message key fails the test the same way it would fail in
 * the app — not silently pass because the mock echoed the key back.
 */
export function renderWithIntl(ui: ReactElement, options?: RenderOptions) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      {ui}
    </NextIntlClientProvider>,
    options
  );
}

export {
  screen,
  within,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
