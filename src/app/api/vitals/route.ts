import { NextResponse } from "next/server";
import { z } from "zod";

const vitalSchema = z.object({
  name: z.enum(["CLS", "FCP", "INP", "LCP", "TTFB", "FID"]),
  value: z.number(),
  rating: z.enum(["good", "needs-improvement", "poor"]).optional(),
  id: z.string().max(120),
  path: z.string().max(300),
});

/**
 * Web Vitals sink: the client beacons real-user metrics here; they land in
 * the server log as structured JSON, ready to be shipped to any
 * observability backend (Datadog, Grafana, Sentry metrics, …) by swapping
 * the console call for a client of choice.
 */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = vitalSchema.safeParse(body);
  if (!parsed.success) {
    return new NextResponse(null, { status: 400 });
  }

  console.info("[web-vitals]", JSON.stringify(parsed.data));
  return new NextResponse(null, { status: 204 });
}
