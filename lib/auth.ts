import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextResponse } from "next/server";

export const ACCESS_COOKIE_NAME = "rppg_paid_access";

const ACCESS_DURATION_SECONDS = 60 * 60 * 24 * 30;

type CookieStore = {
  get: (name: string) => { value: string } | undefined;
};

interface AccessPayload {
  grantedAt: number;
  expiresAt: number;
  plan: "maker-monthly";
}

function getSigningSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET || "local-dev-signing-secret";
}

function sign(value: string): string {
  return createHmac("sha256", getSigningSecret()).update(value).digest("base64url");
}

function safeCompare(a: string, b: string): boolean {
  const first = Buffer.from(a);
  const second = Buffer.from(b);

  if (first.length !== second.length) {
    return false;
  }

  return timingSafeEqual(first, second);
}

export function createAccessToken(): string {
  const payload: AccessPayload = {
    grantedAt: Date.now(),
    expiresAt: Date.now() + ACCESS_DURATION_SECONDS * 1000,
    plan: "maker-monthly"
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAccessToken(token: string): boolean {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = sign(encodedPayload);
  if (!safeCompare(signature, expectedSignature)) {
    return false;
  }

  try {
    const decoded = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const payload = JSON.parse(decoded) as AccessPayload;
    return payload.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export function hasPaidAccess(cookieStore: CookieStore): boolean {
  const cookie = cookieStore.get(ACCESS_COOKIE_NAME)?.value;

  if (!cookie) {
    return false;
  }

  return verifyAccessToken(cookie);
}

export function attachAccessCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: createAccessToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ACCESS_DURATION_SECONDS,
    path: "/"
  });

  return response;
}

export function clearAccessCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/"
  });

  return response;
}
