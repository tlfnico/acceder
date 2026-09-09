import { Categoria } from "@/lib/types";
import { query } from "./db";

/**
 * Capa de Acceso a Datos de Categorías
 * 
 * Consultas reales a la base de datos PostgreSQL mediante driver 'pg'.
 */

// ==========================================
// CONSULTAS PÚBLICAS (Solo activas)
// ==========================================

/**
 * Obtiene la lista de categorías activas pertenecientes a un módulo específico,
 * ordenadas por el campo 'orden'.
 */
export async function getCategoriasPorModulo(idModulo: number): Promise<Categoria[]> {
  const result = await query<Categoria>(
    "SELECT id, id_modulo, nombre, descripcion, orden, activo FROM categoria WHERE id_modulo = $1 AND activo = true ORDER BY orden ASC, id ASC;",
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

// ==========================================
// CONSULTAS ADMINISTRATIVAS (Activas e inactivas)
// ==========================================

export interface CategoriaAdmin extends Categoria {
  modulo_nombre?: string;
}

/**
 * Obtiene todas las categorías (activas e inactivas) para el panel de administración,
 * incluyendo el nombre del módulo al que pertenecen.
 */
export async function getAllCategoriasAdmin(): Promise<CategoriaAdmin[]> {
  const result = await query<CategoriaAdmin>(
    `SELECT c.id, c.id_modulo, c.nombre, c.descripcion, c.orden, c.activo, m.nombre AS modulo_nombre
     FROM categoria c
     INNER JOIN modulo m ON c.id_modulo = m.id
     ORDER BY m.orden ASC, c.orden ASC, c.id ASC;`
  );
  return result.rows;
}

/**
 * Obtiene todas las categorías de un módulo (activas e inactivas) para el panel admin.
 */
export async function getCategoriasPorModuloAdmin(idModulo: number): Promise<Categoria[]> {
  const result = await query<Categoria>(
    "SELECT id, id_modulo, nombre, descripcion, orden, activo FROM categoria WHERE id_modulo = $1 ORDER BY orden ASC, id ASC;",
    [idModulo]
  );
  return result.rows;
}

/**
 * Obtiene una categoría por su ID sin filtrar por estado activo (panel admin).
 */
export async function getCategoriaByIdAdmin(idCategoria: number): Promise<CategoriaAdmin | undefined> {
  const result = await query<CategoriaAdmin>(
    `SELECT c.id, c.id_modulo, c.nombre, c.descripcion, c.orden, c.activo, m.nombre AS modulo_nombre
     FROM categoria c
     INNER JOIN modulo m ON c.id_modulo = m.id
     WHERE c.id = $1
     LIMIT 1;`,
    [idCategoria]
  );
  return result.rows[0] || undefined;
}

/**
 * Crea una nueva categoría en PostgreSQL.
 */
export async function createCategoria(data: {
  id_modulo: number;
  nombre: string;
  descripcion: string;
  orden: number;
  activo?: boolean;
}): Promise<Categoria> {
  const result = await query<Categoria>(
    `INSERT INTO categoria (id_modulo, nombre, descripcion, orden, activo)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, id_modulo, nombre, descripcion, orden, activo;`,
    [
      data.id_modulo,
      data.nombre.trim(),
      data.descripcion.trim(),
      data.orden,
      data.activo !== undefined ? data.activo : true,
    ]
  );
  return result.rows[0];
}

/**
 * Actualiza una categoría existente.
 */
export async function updateCategoria(
  id: number,
  data: {
    id_modulo: number;
    nombre: string;
    descripcion: string;
    orden: number;
    activo: boolean;
  }
): Promise<Categoria | undefined> {
  const result = await query<Categoria>(
    `UPDATE categoria
     SET id_modulo = $1, nombre = $2, descripcion = $3, orden = $4, activo = $5
     WHERE id = $6
     RETURNING id, id_modulo, nombre, descripcion, orden, activo;`,
    [
      data.id_modulo,
      data.nombre.trim(),
      data.descripcion.trim(),
      data.orden,
      data.activo,
      id,
    ]
  );
  return result.rows[0] || undefined;
}

/**
 * Conmuta el estado lógico (activo = true/false) de una categoría.
 */
export async function toggleActivoCategoria(
  id: number,
  activo: boolean
): Promise<Categoria | undefined> {
  const result = await query<Categoria>(
    `UPDATE categoria
     SET activo = $1
     WHERE id = $2
     RETURNING id, id_modulo, nombre, descripcion, orden, activo;`,
    [activo, id]
  );
  return result.rows[0] || undefined;
}

/**
 * Obtiene estadísticas de categorías para el dashboard administrativo.
 */
export async function getCategoriasStats(): Promise<{ total: number; activas: number; inactivas: number }> {
  const result = await query<{ total: string; activas: string; inactivas: string }>(
    `SELECT 
       COUNT(*)::text AS total,
       COUNT(*) FILTER (WHERE activo = true)::text AS activas,
       COUNT(*) FILTER (WHERE activo = false)::text AS inactivas
     FROM categoria;`
  );
  const row = result.rows[0];
  return {
    total: parseInt(row?.total || "0", 10),
    activas: parseInt(row?.activas || "0", 10),
    inactivas: parseInt(row?.inactivas || "0", 10),
  };
}
