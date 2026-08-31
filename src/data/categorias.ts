import { Categoria } from "@/lib/types";
import { query } from "./db";

/**
 * Capa de Acceso a Datos de Categorías
 * 
 * Consultas reales a la base de datos PostgreSQL mediante driver 'pg'.
 * Filtra únicamente registros donde 'activo' = true.
 */

/**
 * Obtiene la lista de categorías activas pertenecientes a un módulo específico,
 * ordenadas por el campo 'orden'.
 */
export async function getCategoriasPorModulo(idModulo: number): Promise<Categoria[]> {
  const result = await query<Categoria>(
    "SELECT id, id_modulo, nombre, descripcion, orden, activo FROM categoria WHERE id_modulo = $1 AND activo = true ORDER BY orden ASC;",
    [idModulo]
  );
  return result.rows;
}

/**
 * Obtiene una categoría específica por su ID, únicamente si está activa.
 */
export async function getCategoriaById(idCategoria: number): Promise<Categoria | undefined> {
  const result = await query<Categoria>(
    "SELECT id, id_modulo, nombre, descripcion, orden, activo FROM categoria WHERE id = $1 AND activo = true LIMIT 1;",
    [idCategoria]
  );
  return result.rows[0] || undefined;
}
