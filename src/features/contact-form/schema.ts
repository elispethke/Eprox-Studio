import { z } from "zod";

/**
 * Shared by the client (field validation) and the API route handler (request
 * validation) so the two can never drift.
 *
 * `website` is a honeypot: the field is invisible to humans, so any value in
 * it marks the submission as bot traffic. It must be ALLOWED here (not
 * rejected) — the route handler answers it with a fake success instead of an
 * error, so bots get no signal that they were caught.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(200).optional().default(""),
});

export type ContactPayload = z.infer<typeof contactSchema>;

export type ContactField = Exclude<keyof ContactPayload, "website">;

/** Response contract of POST /api/contact — the client never sees more than this. */
export interface ContactResponse {
  success: boolean;
  message?: string;
}
