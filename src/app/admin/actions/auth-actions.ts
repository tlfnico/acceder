"use server";

import { redirect } from "next/navigation";
import { getUsuarioAuthByEmail } from "@/data/usuarios";
import { verifyPassword } from "@/lib/auth-helpers";
import { createSessionCookie, deleteSessionCookie } from "@/lib/session";
import { RolNombre } from "@/lib/types";

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

  try {
    const usuario = await getUsuarioAuthByEmail(email);

    // Mensaje genérico para prevenir enumeración de usuarios
    const genericErrorMessage = "Credenciales inválidas o cuenta inactiva.";

    if (!usuario || !usuario.activo) {
      return { error: genericErrorMessage };
    }

    const passwordMatch = await verifyPassword(contrasenia, usuario.contrasenia);
    if (!passwordMatch) {
      return { error: genericErrorMessage };
    }

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
