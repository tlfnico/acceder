"use server";

import { redirect } from "next/navigation";
import { getUsuarioAuthByEmail } from "@/data/usuarios";
import { verifyPassword } from "@/lib/auth-helpers";
import { createSessionCookie, deleteSessionCookie } from "@/lib/session";
import { RolNombre } from "@/lib/types";
import {
  clearLoginFailures,
  getLoginRateLimitKeys,
  isLoginRateLimited,
  registerLoginFailure,
} from "@/data/login-rate-limit";
import { headers } from "next/headers";

export interface AuthState {
  error?: string;
}

/**
 * Server Action para inicio de sesión en el panel administrativo.
 */
export async function loginAction(
  _prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState | undefined> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const contrasenia = formData.get("contrasenia")?.toString();

  if (!email || !contrasenia) {
    return { error: "Por favor, complete todos los campos obligatorios." };
  }

  const requestHeaders = await headers();
  const ipAddress = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim()
    || requestHeaders.get("x-real-ip")
    || "unknown";
  const rateLimitKeys = getLoginRateLimitKeys(email, ipAddress);
  const genericErrorMessage = "Credenciales inválidas o cuenta inactiva.";

  try {
    if (await isLoginRateLimited(rateLimitKeys)) {
      return { error: "Demasiados intentos. Espere unos minutos antes de volver a intentarlo." };
    }

    const usuario = await getUsuarioAuthByEmail(email);

    // Mensaje genérico para prevenir enumeración de usuarios
    if (!usuario || !usuario.activo) {
      await registerLoginFailure(rateLimitKeys);
      return { error: genericErrorMessage };
    }

    const passwordMatch = await verifyPassword(contrasenia, usuario.contrasenia);
    if (!passwordMatch) {
      await registerLoginFailure(rateLimitKeys);
      return { error: genericErrorMessage };
    }

    await clearLoginFailures(rateLimitKeys);

    // Establecer sesión segura en cookie HttpOnly
    await createSessionCookie({
      userId: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rolId: usuario.id_rol,
      rolNombre: (usuario.rol_nombre || "PERSONAL_ACCESIBILIDAD") as RolNombre,
    });
  } catch (err) {
    console.error("[AUTH ERROR] Error en proceso de login:", err);
    return { error: "Ocurrió un error inesperado al procesar la solicitud." };
  }

  // Redirección al dashboard administrativo
  redirect("/admin");
}

/**
 * Server Action para cierre de sesión.
 */
export async function logoutAction(): Promise<void> {
  await deleteSessionCookie();
  redirect("/admin/login");
}
