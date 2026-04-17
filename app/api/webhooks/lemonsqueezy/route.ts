import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { savePurchase } from "@/lib/database";
import { verifyLemonSqueezySignature } from "@/lib/lemonsqueezy";

interface LemonPayload {
  data?: {
    id?: string;
    attributes?: {
      status?: string;
      user_email?: string;
    };
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  const rawBody = await request.text();
  const signature = (await headers()).get("x-signature");

  if (!verifyLemonSqueezySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as LemonPayload;
  const orderId = payload.data?.id;
  const status = payload.data?.attributes?.status;

  if (!orderId || status !== "paid") {
    return NextResponse.json({ received: true });
  }

  await savePurchase({
    orderId,
    email: payload.data?.attributes?.user_email,
    status: "paid",
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ received: true });
}
