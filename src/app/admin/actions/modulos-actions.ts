"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySessionAction } from "@/lib/dal";
import { createModulo, updateModulo, toggleActivoModulo } from "@/data/modulos";

export interface ModuloFormState {
  error?: string;
}

/**
 * Server Action para crear un nuevo módulo.
 */
export async function crearModuloAction(
  _prevState: ModuloFormState | undefined,
  formData: FormData
): Promise<ModuloFormState | undefined> {
  await verifySessionAction();

  const nombre = formData.get("nombre")?.toString().trim();
  const ordenStr = formData.get("orden")?.toString().trim();
  const activo = formData.get("activo") === "on";

  if (!nombre) {
    return { error: "El nombre del módulo es obligatorio." };
  }

  const orden = parseInt(ordenStr || "0", 10);
  if (isNaN(orden) || orden < 0) {
    return { error: "El orden debe ser un número entero mayor o igual a 0." };
  }

  try {
    await createModulo({
      nombre,
      orden,
      activo,
    });
  } catch (error) {
    console.error("[ERROR] Al crear módulo:", error);
    return { error: "Ocurrió un error al guardar el módulo en la base de datos." };
  }

  revalidatePath("/admin/modulos");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/modulos");
}

/**
 * Server Action para editar un módulo existente.
 */
export async function editarModuloAction(
  id: number,
  _prevState: ModuloFormState | undefined,
  formData: FormData
): Promise<ModuloFormState | undefined> {
  await verifySessionAction();

  const nombre = formData.get("nombre")?.toString().trim();
  const ordenStr = formData.get("orden")?.toString().trim();
  const activo = formData.get("activo") === "on";

  if (!nombre) {
    return { error: "El nombre del módulo es obligatorio." };
  }

  const orden = parseInt(ordenStr || "0", 10);
  if (isNaN(orden) || orden < 0) {
    return { error: "El orden debe ser un número entero mayor o igual a 0." };
  }

  try {
    const updated = await updateModulo(id, {
      nombre,
      orden,
      activo,
    });

    if (!updated) {
      return { error: "No se encontró el módulo especificado para actualizar." };
    }
  } catch (error) {
    console.error("[ERROR] Al actualizar módulo:", error);
    return { error: "Ocurrió un error al actualizar el módulo en la base de datos." };
  }

  revalidatePath("/admin/modulos");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/modulos/${id}`);
  redirect("/admin/modulos");
}

/**
 * Server Action para conmutar el estado lógico (activo = true/false) de un módulo.
 */
export async function toggleActivoModuloAction(id: number, activoActual: boolean): Promise<void> {
  await verifySessionAction();

  try {
    await toggleActivoModulo(id, !activoActual);
    revalidatePath("/admin/modulos");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/modulos/${id}`);
  } catch (error) {
    console.error("[ERROR] Al cambiar estado de módulo:", error);
    throw new Error("No se pudo conmutar el estado del módulo.");
  }
}
