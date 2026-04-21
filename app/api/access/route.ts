import { NextRequest, NextResponse } from "next/server";
import { attachAccessCookie, clearAccessCookie } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const purchaseStatus = request.nextUrl.searchParams.get("purchase");

  if (purchaseStatus !== "complete") {
    return NextResponse.redirect(new URL("/generator", request.url));
  }

  const response = NextResponse.redirect(new URL("/generator", request.url));
  return attachAccessCookie(response);
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  return clearAccessCookie(response);
}
