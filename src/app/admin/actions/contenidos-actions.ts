"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySessionAction } from "@/lib/dal";
import { createContenido, updateContenido, toggleActivoContenido, getContenidoByIdAdmin } from "@/data/contenidos";
import { validarCategoriaModulo } from "@/data/categorias";
import { normalizePhone, validateContentFields } from "@/lib/validation";

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

  const idModuloStr = formData.get("id_modulo")?.toString().trim();
  const idCategoriaStr = formData.get("id_categoria")?.toString().trim();
  const titulo = formData.get("titulo")?.toString().trim();
  const descripcion = formData.get("descripcion")?.toString().trim();
  const direccion = formData.get("direccion")?.toString().trim() || null;
  const telefono = formData.get("telefono")?.toString().trim() || null;
  const email = formData.get("email")?.toString().trim() || null;
  const enlace = formData.get("enlace")?.toString().trim() || null;
  const horario = formData.get("horario")?.toString().trim() || null;
  const ordenStr = formData.get("orden")?.toString().trim();
  const orden = parseInt(ordenStr || "0", 10);
  const activo = formData.get("activo") === "on";

  if (!idModuloStr || !idCategoriaStr || !titulo || !descripcion) {
    return { error: "Por favor seleccione el módulo, categoría y complete título y descripción." };
  }

  const validationError = validateContentFields({
    titulo,
    descripcion,
    direccion,
    telefono,
    email,
    enlace,
    horario,
  });
  if (validationError) return { error: validationError };

  const idModulo = parseInt(idModuloStr, 10);
  const idCategoria = parseInt(idCategoriaStr, 10);
  if (isNaN(idModulo) || idModulo <= 0 || isNaN(idCategoria) || idCategoria <= 0) {
    return { error: "Debe seleccionar un módulo y una categoría válida." };
  }

  // Validación de seguridad en servidor: la categoría debe existir, estar activa y pertenecer al módulo
  const esValida = await validarCategoriaModulo(idCategoria, idModulo, true);
  if (!esValida) {
    return { error: "La categoría seleccionada no existe, no está activa o no pertenece al módulo indicado." };
  }

  try {
    await createContenido({
      id_categoria: idCategoria,
      titulo,
      descripcion,
      direccion,
      telefono: telefono ? normalizePhone(telefono) : null,
      email,
      enlace,
      horario,
      orden: isNaN(orden) || orden < 0 ? 0 : orden,
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

  const idModuloStr = formData.get("id_modulo")?.toString().trim();
  const idCategoriaStr = formData.get("id_categoria")?.toString().trim();
  const titulo = formData.get("titulo")?.toString().trim();
  const descripcion = formData.get("descripcion")?.toString().trim();
  const direccion = formData.get("direccion")?.toString().trim() || null;
  const telefono = formData.get("telefono")?.toString().trim() || null;
  const email = formData.get("email")?.toString().trim() || null;
  const enlace = formData.get("enlace")?.toString().trim() || null;
  const horario = formData.get("horario")?.toString().trim() || null;
  const ordenStr = formData.get("orden")?.toString().trim();
  const orden = parseInt(ordenStr || "0", 10);
  const activo = formData.get("activo") === "on";

  if (!idModuloStr || !idCategoriaStr || !titulo || !descripcion) {
    return { error: "Por favor seleccione el módulo, categoría y complete título y descripción." };
  }

  const validationError = validateContentFields({
    titulo,
    descripcion,
    direccion,
    telefono,
    email,
    enlace,
    horario,
  });
  if (validationError) return { error: validationError };

  const idModulo = parseInt(idModuloStr, 10);
  const idCategoria = parseInt(idCategoriaStr, 10);
  if (isNaN(idModulo) || idModulo <= 0 || isNaN(idCategoria) || idCategoria <= 0) {
    return { error: "Debe seleccionar un módulo y una categoría válida." };
  }

  // Obtener contenido actual para saber si mantiene su categoría histórica o la está cambiando
  const contenidoActual = await getContenidoByIdAdmin(id);
  const esMismaCategoria = contenidoActual?.id_categoria === idCategoria;

  // Validación de seguridad en servidor: si cambia de categoría debe ser activa; si mantiene la misma, debe pertenecer al módulo
  const esValida = await validarCategoriaModulo(idCategoria, idModulo, !esMismaCategoria);
  if (!esValida) {
    return { error: "La categoría seleccionada no pertenece al módulo indicado o no se encuentra disponible." };
  }

  try {
    const updated = await updateContenido(id, {
      id_categoria: idCategoria,
      titulo,
      descripcion,
      direccion,
      telefono: telefono ? normalizePhone(telefono) : null,
      email,
      enlace,
      horario,
      orden: isNaN(orden) || orden < 0 ? 0 : orden,
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
