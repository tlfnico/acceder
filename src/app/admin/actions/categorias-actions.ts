"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySessionAction } from "@/lib/dal";
import { createCategoria, updateCategoria, toggleActivoCategoria } from "@/data/categorias";

export interface CategoriaFormState {
  error?: string;
}

/**
 * Server Action para crear una nueva categoría.
 */
export async function crearCategoriaAction(
  _prevState: CategoriaFormState | undefined,
  formData: FormData
): Promise<CategoriaFormState | undefined> {
  await verifySessionAction();

  const idModuloStr = formData.get("id_modulo")?.toString().trim();
  const nombre = formData.get("nombre")?.toString().trim();
  const descripcion = formData.get("descripcion")?.toString().trim();
  const ordenStr = formData.get("orden")?.toString().trim();
  const activo = formData.get("activo") === "on";

  if (!idModuloStr || !nombre || !descripcion) {
    return { error: "Por favor complete el módulo, nombre y descripción de la categoría." };
  }

  const idModulo = parseInt(idModuloStr, 10);
  if (isNaN(idModulo) || idModulo <= 0) {
    return { error: "Debe seleccionar un módulo válido." };
  }

  const orden = parseInt(ordenStr || "0", 10);
  if (isNaN(orden) || orden < 0) {
    return { error: "El orden debe ser un número entero mayor o igual a 0." };
  }

  try {
    await createCategoria({
      id_modulo: idModulo,
      nombre,
      descripcion,
      orden,
      activo,
    });
  } catch (error) {
    console.error("[ERROR] Al crear categoría:", error);
    return { error: "Ocurrió un error al guardar la categoría en la base de datos." };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/modulos/${idModulo}`);
  redirect("/admin/categorias");
}

/**
 * Server Action para editar una categoría existente.
 */
export async function editarCategoriaAction(
  id: number,
  _prevState: CategoriaFormState | undefined,
  formData: FormData
): Promise<CategoriaFormState | undefined> {
  await verifySessionAction();

  const idModuloStr = formData.get("id_modulo")?.toString().trim();
  const nombre = formData.get("nombre")?.toString().trim();
  const descripcion = formData.get("descripcion")?.toString().trim();
  const ordenStr = formData.get("orden")?.toString().trim();
  const activo = formData.get("activo") === "on";

  if (!idModuloStr || !nombre || !descripcion) {
    return { error: "Por favor complete el módulo, nombre y descripción de la categoría." };
  }

  const idModulo = parseInt(idModuloStr, 10);
  if (isNaN(idModulo) || idModulo <= 0) {
    return { error: "Debe seleccionar un módulo válido." };
  }

  const orden = parseInt(ordenStr || "0", 10);
  if (isNaN(orden) || orden < 0) {
    return { error: "El orden debe ser un número entero mayor o igual a 0." };
  }

  try {
    const updated = await updateCategoria(id, {
      id_modulo: idModulo,
      nombre,
      descripcion,
      orden,
      activo,
    });

    if (!updated) {
      return { error: "No se encontró la categoría especificada para actualizar." };
    }
  } catch (error) {
    console.error("[ERROR] Al actualizar categoría:", error);
    return { error: "Ocurrió un error al actualizar la categoría en la base de datos." };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/modulos/${idModulo}`);
  revalidatePath(`/modulos/${idModulo}/categorias/${id}`);
  redirect("/admin/categorias");
}

/**
 * Server Action para conmutar el estado lógico (activo = true/false) de una categoría.
 */
export async function toggleActivoCategoriaAction(
  id: number,
  activoActual: boolean
): Promise<void> {
  await verifySessionAction();

  try {
    await toggleActivoCategoria(id, !activoActual);
    revalidatePath("/admin/categorias");
    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error) {
    console.error("[ERROR] Al cambiar estado de categoría:", error);
    throw new Error("No se pudo conmutar el estado de la categoría.");
  }
}
