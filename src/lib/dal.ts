import { redirect } from "next/navigation";
import { getSession } from "./session";
import { SessionPayload } from "./types";
import { getUsuarioById } from "@/data/usuarios";

/**
 * Data Access Layer (DAL) para seguridad y autorización.
 * 
 * Centraliza la verificación de sesiones y roles en el servidor.
 */

/**
 * Verifica la existencia y validez de la sesión actual.
 * Si no está autenticado, redirige automáticamente a /admin/login.
 * 
 * Uso en Server Components y Layouts protegidos.
 */
export async function verifySession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || !session.userId) {
    redirect("/admin/login");
  }
  return session;
}

/**
 * Verifica la sesión dentro de Server Actions.
 * Si no está autenticado, arroja un error controlado para evitar ejecuciones no autorizadas.
 */
export async function verifySessionAction(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || !session.userId) {
    throw new Error("No autenticado. Inicie sesión para continuar.");
  }
  return session;
}

/**
 * Retorna los datos seguros del usuario autenticado actual desde la base de datos
 * garantizando que la cuenta siga activa en tiempo real.
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    const user = await getUsuarioById(session.userId);
    if (!user || !user.activo) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

/**
 * Exige que el usuario tenga rol ADMINISTRADOR.
 * Si el usuario no tiene rol ADMINISTRADOR:
 * - En Server Actions arroja un Error de autorización.
 * - En Server Components redirige al dashboard administrativo (/admin).
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await verifySession();
  if (session.rolNombre !== "ADMINISTRADOR") {
    redirect("/admin");
  }
  return session;
}

/**
 * Exige rol ADMINISTRADOR específicamente para Server Actions.
 */
export async function requireAdminAction(): Promise<SessionPayload> {
  const session = await verifySessionAction();
  if (session.rolNombre !== "ADMINISTRADOR") {
    throw new Error("Acceso no autorizado: Se requiere rol ADMINISTRADOR para realizar esta acción.");
  }
  return session;
}
