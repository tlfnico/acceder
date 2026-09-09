import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "./types";

const COOKIE_NAME = "acceder_session";
const SESSION_DURATION_DAYS = 7;

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || "acceder_dev_secret_key_minimum_32_chars_long_123456";
  return new TextEncoder().encode(secret);
}

/**
 * Cifra y firma el payload de sesión utilizando HMAC SHA-256 (HS256).
 */
export async function encryptSession(payload: Omit<SessionPayload, "exp">): Promise<string> {
  const key = getSecretKey();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(key);
}

/**
 * Desencripta y valida la firma y vigencia del token de sesión.
 * Si el token es inválido o expiró, retorna null sin lanzar excepciones hacia el cliente.
 */
export async function decryptSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Crea la sesión, genera el token firmado y establece la cookie HttpOnly en el cliente.
 */
export async function createSessionCookie(payload: Omit<SessionPayload, "exp">): Promise<void> {
  const token = await encryptSession(payload);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/**
 * Obtiene la sesión actual a partir de la cookie HttpOnly.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;
  return decryptSession(cookie.value);
}

/**
 * Elimina la cookie de sesión en el navegador.
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
