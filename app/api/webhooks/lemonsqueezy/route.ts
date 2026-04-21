import { NextRequest, NextResponse } from "next/server";
import { verifyLemonSqueezySignature, verifyStripeSignature } from "@/lib/lemonsqueezy";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret is not configured." },
      { status: 500 }
    );
  }

  const rawBody = await request.text();
  const stripeSignature = request.headers.get("stripe-signature");
  const lemonSignature = request.headers.get("x-signature");

  let provider: "stripe" | "lemonsqueezy" | "unknown" = "unknown";
  let verified = false;

  if (stripeSignature) {
    provider = "stripe";
    verified = verifyStripeSignature(rawBody, stripeSignature, webhookSecret);
  } else if (lemonSignature) {
    provider = "lemonsqueezy";
    verified = verifyLemonSqueezySignature(rawBody, lemonSignature, webhookSecret);
  }

  if (!verified) {
    return NextResponse.json(
      { error: "Webhook signature verification failed.", provider },
      { status: 400 }
    );
  }

  let payload: Record<string, unknown> | null = null;

  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      {
        error: "Webhook payload is not valid JSON.",
        provider
      },
      { status: 400 }
    );
  }

  const eventType =
    typeof payload.type === "string"
      ? payload.type
      : typeof payload.meta === "object" && payload.meta !== null
        ? String((payload.meta as { event_name?: string }).event_name ?? "unknown")
        : "unknown";

  return NextResponse.json({
    received: true,
    provider,
    eventType
  });
}
