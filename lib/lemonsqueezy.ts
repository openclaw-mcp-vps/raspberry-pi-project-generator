import crypto from "node:crypto";
import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

lemonSqueezySetup({
  apiKey: process.env.LEMON_SQUEEZY_API_KEY,
  onError: (error) => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Lemon Squeezy setup warning:", error.message);
    }
  }
});

export function verifyLemonSqueezySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) {
    return false;
  }

  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export function buildCheckoutUrl(): string {
  const raw = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID ?? "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  if (!raw) {
    return "";
  }

  return `https://app.lemonsqueezy.com/checkout/buy/${raw}`;
}
