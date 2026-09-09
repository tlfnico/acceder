"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySessionAction } from "@/lib/dal";
import { createContenido, updateContenido, toggleActivoContenido } from "@/data/contenidos";

export interface ContenidoFormState {
  error?: string;
}

/**
 * Server Action para crear un nuevo contenido.
 */
export async function crearContenidoAction(
  _prevState: ContenidoFormState | undefined,
  formData: FormData
): Promise<ContenidoFormState | undefined> {
  await verifySessionAction();

  const idCategoriaStr = formData.get("id_categoria")?.toString().trim();
  const titulo = formData.get("titulo")?.toString().trim();
  const descripcion = formData.get("descripcion")?.toString().trim();
  const direccion = formData.get("direccion")?.toString().trim() || null;
  const telefono = formData.get("telefono")?.toString().trim() || null;
  const email = formData.get("email")?.toString().trim() || null;
  const enlace = formData.get("enlace")?.toString().trim() || null;
  const horario = formData.get("horario")?.toString().trim() || null;
  const activo = formData.get("activo") === "on";

  if (!idCategoriaStr || !titulo || !descripcion) {
    return { error: "Por favor complete la categoría, título y descripción del contenido." };
  }

  const idCategoria = parseInt(idCategoriaStr, 10);
  if (isNaN(idCategoria) || idCategoria <= 0) {
    return { error: "Debe seleccionar una categoría válida." };
  }

  try {
    await createContenido({
      id_categoria: idCategoria,
      titulo,
      descripcion,
      direccion,
      telefono,
      email,
      enlace,
      horario,
      activo,
    });
  } catch (error) {
    console.error("[ERROR] Al crear contenido:", error);
    return { error: "Ocurrió un error al guardar el contenido en la base de datos." };
  }

  revalidatePath("/admin/contenidos");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/contenidos");
}

/**
 * Server Action para editar un contenido existente.
 */
export async function editarContenidoAction(
  id: number,
  _prevState: ContenidoFormState | undefined,
  formData: FormData
): Promise<ContenidoFormState | undefined> {
  await verifySessionAction();

  const idCategoriaStr = formData.get("id_categoria")?.toString().trim();
  const titulo = formData.get("titulo")?.toString().trim();
  const descripcion = formData.get("descripcion")?.toString().trim();
  const direccion = formData.get("direccion")?.toString().trim() || null;
  const telefono = formData.get("telefono")?.toString().trim() || null;
  const email = formData.get("email")?.toString().trim() || null;
  const enlace = formData.get("enlace")?.toString().trim() || null;
  const horario = formData.get("horario")?.toString().trim() || null;
  const activo = formData.get("activo") === "on";

  if (!idCategoriaStr || !titulo || !descripcion) {
    return { error: "Por favor complete la categoría, título y descripción del contenido." };
  }

  const idCategoria = parseInt(idCategoriaStr, 10);
  if (isNaN(idCategoria) || idCategoria <= 0) {
    return { error: "Debe seleccionar una categoría válida." };
  }

  try {
    const updated = await updateContenido(id, {
      id_categoria: idCategoria,
      titulo,
      descripcion,
      direccion,
      telefono,
      email,
      enlace,
      horario,
      activo,
    });

    if (!updated) {
      return { error: "No se encontró el contenido especificado para actualizar." };
    }
  } catch (error) {
    console.error("[ERROR] Al actualizar contenido:", error);
    return { error: "Ocurrió un error al actualizar el contenido en la base de datos." };
  }

  revalidatePath("/admin/contenidos");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/contenidos");
}

/**
 * Server Action para conmutar el estado lógico (activo = true/false) de un contenido.
 */
export async function toggleActivoContenidoAction(
  id: number,
  activoActual: boolean
): Promise<void> {
  await verifySessionAction();

  try {
    await toggleActivoContenido(id, !activoActual);
    revalidatePath("/admin/contenidos");
    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error) {
    console.error("[ERROR] Al cambiar estado de contenido:", error);
    throw new Error("No se pudo conmutar el estado del contenido.");
  }
}
