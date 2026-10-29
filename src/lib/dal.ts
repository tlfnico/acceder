import { redirect } from "next/navigation";
import { deleteSessionCookie, getSession } from "./session";
import { RolNombre, SessionPayload, UsuarioSeguro } from "./types";
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
function isRolNombre(rol: string | undefined): rol is RolNombre {
  return rol === "ADMINISTRADOR" || rol === "PERSONAL_ACCESIBILIDAD";
}

function toSessionPayload(user: UsuarioSeguro): SessionPayload | null {
  if (!user.activo || !isRolNombre(user.rol_nombre)) return null;
  return {
    userId: user.id,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    rolId: user.id_rol,
    rolNombre: user.rol_nombre,
  };
}

/** Obtiene la identidad vigente desde la base de datos, no desde el JWT. */
export async function getVerifiedSession(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    const user = await getUsuarioById(session.userId);
    return user ? toSessionPayload(user) : null;
  } catch {
    return null;
  }
}

export async function verifySession(): Promise<SessionPayload> {
  const session = await getVerifiedSession();
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
  const session = await getVerifiedSession();
  if (!session || !session.userId) {
    await deleteSessionCookie();
    throw new Error("No autenticado. Inicie sesión para continuar.");
  }
  return session;
}

/**
 * Retorna los datos seguros del usuario autenticado actual desde la base de datos
 * garantizando que la cuenta siga activa en tiempo real.
 */
export async function getCurrentUser() {
  const session = await getVerifiedSession();
  if (!session) return null;
  return getUsuarioById(session.userId);
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
