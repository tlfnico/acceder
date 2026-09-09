"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminAction } from "@/lib/dal";
import { hashPassword } from "@/lib/auth-helpers";
import {
  createUsuario,
  updateUsuario,
  toggleActivoUsuario,
  getUsuarioByEmail,
} from "@/data/usuarios";

export interface UsuarioFormState {
  error?: string;
}

/**
 * Server Action para crear un nuevo usuario.
 * PROTECCIÓN ESTRICTA: Exclusivo rol ADMINISTRADOR en el servidor.
 */
export async function crearUsuarioAction(
  _prevState: UsuarioFormState | undefined,
  formData: FormData
): Promise<UsuarioFormState | undefined> {
  await requireAdminAction();

  const nombre = formData.get("nombre")?.toString().trim();
  const apellido = formData.get("apellido")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const contrasenia = formData.get("contrasenia")?.toString();
  const idRolStr = formData.get("id_rol")?.toString().trim();
  const activo = formData.get("activo") === "on";

  if (!nombre || !apellido || !email || !contrasenia || !idRolStr) {
    return { error: "Por favor complete todos los campos obligatorios." };
  }

  // Validación de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "El formato del correo electrónico es inválido." };
  }

  // Validación de longitud mínima de contraseña
  if (contrasenia.length < 6) {
    return { error: "La contraseña debe contener al menos 6 caracteres." };
  }

  const idRol = parseInt(idRolStr, 10);
  if (isNaN(idRol) || idRol <= 0) {
    return { error: "Debe seleccionar un rol válido." };
  }

  try {
    // Comprobar si el email ya se encuentra registrado
    const existing = await getUsuarioByEmail(email);
    if (existing) {
      return { error: "El correo electrónico ya se encuentra registrado en el sistema." };
    }

    // Hash criptográfico con bcryptjs
    const contraseniaHash = await hashPassword(contrasenia);

    await createUsuario({
      nombre,
      apellido,
      email,
      contraseniaHash,
      id_rol: idRol,
      activo,
    });
  } catch (error) {
    console.error("[ERROR] Al crear usuario:", error);
    return { error: "Ocurrió un error al guardar el usuario en la base de datos." };
  }

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin");
  redirect("/admin/usuarios");
}

/**
 * Server Action para editar un usuario existente.
 * PROTECCIÓN ESTRICTA: Exclusivo rol ADMINISTRADOR en el servidor.
 */
export async function editarUsuarioAction(
  id: number,
  _prevState: UsuarioFormState | undefined,
  formData: FormData
): Promise<UsuarioFormState | undefined> {
  await requireAdminAction();

  const nombre = formData.get("nombre")?.toString().trim();
  const apellido = formData.get("apellido")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const contrasenia = formData.get("contrasenia")?.toString();
  const idRolStr = formData.get("id_rol")?.toString().trim();
  const activo = formData.get("activo") === "on";

  if (!nombre || !apellido || !email || !idRolStr) {
    return { error: "Por favor complete todos los campos obligatorios." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "El formato del correo electrónico es inválido." };
  }

  const idRol = parseInt(idRolStr, 10);
  if (isNaN(idRol) || idRol <= 0) {
    return { error: "Debe seleccionar un rol válido." };
  }

  try {
    // Si se especificó una nueva contraseña, validarla y hashearla
    let contraseniaHash: string | undefined = undefined;
    if (contrasenia && contrasenia.trim().length > 0) {
      if (contrasenia.length < 6) {
        return { error: "La nueva contraseña debe contener al menos 6 caracteres." };
      }
      contraseniaHash = await hashPassword(contrasenia);
    }

    const updated = await updateUsuario(id, {
      nombre,
      apellido,
      email,
      id_rol: idRol,
      activo,
      contraseniaHash,
    });

    if (!updated) {
      return { error: "No se encontró el usuario especificado para actualizar." };
    }
  } catch (error) {
    console.error("[ERROR] Al actualizar usuario:", error);
    return { error: "Ocurrió un error al actualizar el usuario en la base de datos." };
  }

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin");
  redirect("/admin/usuarios");
}

/**
 * Server Action para conmutar el estado lógico (activo = true/false) de un usuario.
 * PROTECCIÓN ESTRICTA: Exclusivo rol ADMINISTRADOR en el servidor.
 */
export async function toggleActivoUsuarioAction(
  id: number,
  activoActual: boolean
): Promise<void> {
  await requireAdminAction();

  try {
    await toggleActivoUsuario(id, !activoActual);
    revalidatePath("/admin/usuarios");
    revalidatePath("/admin");
  } catch (error) {
    console.error("[ERROR] Al cambiar estado de usuario:", error);
    throw new Error("No se pudo conmutar el estado del usuario.");
  }
}
