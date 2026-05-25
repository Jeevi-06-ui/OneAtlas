import { SignJWT, jwtVerify } from "jose";

import { SESSION_MAX_AGE_SECONDS } from "@/lib/auth/constants";

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
}

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET must be set and at least 16 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: { id: string; email: string; name: string }) {
  return new SignJWT({
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== "string" || typeof payload.name !== "string") {
      return null;
    }
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}
