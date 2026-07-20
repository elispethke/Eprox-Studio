import { NextResponse } from "next/server";
import {
  contactSchema,
  type ContactResponse,
} from "@/features/contact-form/schema";
import { getServerEnv } from "@/shared/lib/env.server";
import { isRateLimited } from "@/shared/lib/rate-limit.server";

function json(body: ContactResponse, status: number) {
  return NextResponse.json(body, { status });
}

/**
 * Server-side relay for the contact form. The real form endpoint lives ONLY
 * in the non-public FORMSPREE_ENDPOINT env var, so it never reaches the
 * client bundle or the browser's network tab. Client-facing errors stay
 * generic; details go to the server log only.
 */
export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";

    if (await isRateLimited(ip)) {
      return json({ success: false }, 429);
    }

    const body: unknown = await request.json().catch(() => null);
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return json({ success: false }, 400);
    }

    // Honeypot filled → bot. Answer with a fake success so the bot learns
    // nothing, and never forward the payload.
    if (parsed.data.website) {
      return json({ success: true }, 200);
    }

    const endpoint = getServerEnv().FORMSPREE_ENDPOINT;
    if (!endpoint) {
      console.error("[contact] FORMSPREE_ENDPOINT is not configured");
      return json({ success: false }, 500);
    }

    const { name, email, subject, message } = parsed.data;
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, email, subject, message }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "<unreadable body>");
      console.error(
        "[contact] upstream rejected submission",
        upstream.status,
        detail
      );
      return json({ success: false }, 502);
    }

    return json({ success: true }, 200);
  } catch (error) {
    console.error("[contact] unexpected failure", error);
    return json({ success: false }, 500);
  }
}
