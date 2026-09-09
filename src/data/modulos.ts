import { Modulo } from "@/lib/types";
import { query } from "./db";

/**
 * Capa de Acceso a Datos de Módulos
 * 
 * Consultas reales a la base de datos PostgreSQL mediante driver 'pg'.
 */

// ==========================================
// CONSULTAS PÚBLICAS (Solo activos)
// ==========================================

/**
 * Obtiene la lista de todos los módulos activos ordenados por el campo 'orden'.
 */
export async function getModulosActivos(): Promise<Modulo[]> {
  const result = await query<Modulo>(
    "SELECT id, nombre, activo, orden FROM modulo WHERE activo = true ORDER BY orden ASC, id ASC;"
  );
  return result.rows;
}

/**
 * Obtiene un módulo por su ID único, únicamente si está activo.
 */
export async function getModuloById(id: number): Promise<Modulo | undefined> {
  const result = await query<Modulo>(
    "SELECT id, nombre, activo, orden FROM modulo WHERE id = $1 AND activo = true LIMIT 1;",
    [id]
  );
  return result.rows[0] || undefined;
}

// ==========================================
// CONSULTAS ADMINISTRATIVAS (Activos e inactivos)
// ==========================================

/**
 * Obtiene todos los módulos (activos e inactivos) para el panel de administración.
 */
export async function getAllModulosAdmin(): Promise<Modulo[]> {
  const result = await query<Modulo>(
    "SELECT id, nombre, activo, orden FROM modulo ORDER BY orden ASC, id ASC;"
  );
  return result.rows;
}

/**
 * Obtiene un módulo por su ID sin filtrar por estado activo (panel admin).
 */
export async function getModuloByIdAdmin(id: number): Promise<Modulo | undefined> {
  const result = await query<Modulo>(
    "SELECT id, nombre, activo, orden FROM modulo WHERE id = $1 LIMIT 1;",
    [id]
  );
  return result.rows[0] || undefined;
}

/**
 * Crea un nuevo módulo en PostgreSQL.
 */
export async function createModulo(data: {
  nombre: string;
  orden: number;
  activo?: boolean;
}): Promise<Modulo> {
  const result = await query<Modulo>(
    `INSERT INTO modulo (nombre, orden, activo)
     VALUES ($1, $2, $3)
     RETURNING id, nombre, orden, activo;`,
    [data.nombre.trim(), data.orden, data.activo !== undefined ? data.activo : true]
  );
  return result.rows[0];
}

/**
 * Actualiza un módulo existente.
 */
export async function updateModulo(
  id: number,
  data: {
    nombre: string;
    orden: number;
    activo: boolean;
  }
): Promise<Modulo | undefined> {
  const result = await query<Modulo>(
    `UPDATE modulo
     SET nombre = $1, orden = $2, activo = $3
     WHERE id = $4
     RETURNING id, nombre, orden, activo;`,
    [data.nombre.trim(), data.orden, data.activo, id]
  );
  return result.rows[0] || undefined;
}

/**
 * Conmuta el estado lógico (activo = true/false) de un módulo.
 */
export async function toggleActivoModulo(
  id: number,
  activo: boolean
): Promise<Modulo | undefined> {
  const result = await query<Modulo>(
    `UPDATE modulo
     SET activo = $1
     WHERE id = $2
     RETURNING id, nombre, orden, activo;`,
    [activo, id]
  );
  return result.rows[0] || undefined;
}

/**
 * Obtiene estadísticas de módulos para el dashboard administrativo.
 */
export async function getModulosStats(): Promise<{ total: number; activos: number; inactivos: number }> {
  const result = await query<{ total: string; activos: string; inactivos: string }>(
    `SELECT 
       COUNT(*)::text AS total,
       COUNT(*) FILTER (WHERE activo = true)::text AS activos,
       COUNT(*) FILTER (WHERE activo = false)::text AS inactivos
     FROM modulo;`
  );
  const row = result.rows[0];
  return {
    total: parseInt(row?.total || "0", 10),
    activos: parseInt(row?.activos || "0", 10),
    inactivos: parseInt(row?.inactivos || "0", 10),
  };
}
