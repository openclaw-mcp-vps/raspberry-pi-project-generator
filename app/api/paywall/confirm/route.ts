import { NextResponse } from "next/server";
import { hasPaidOrder } from "@/lib/database";

export async function POST(request: Request): Promise<NextResponse> {
  const { orderId } = (await request.json()) as { orderId?: string };
  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const paid = await hasPaidOrder(orderId);
  if (!paid) {
    return NextResponse.json({ error: "Order not found yet" }, { status: 404 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("rpig_paid", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
