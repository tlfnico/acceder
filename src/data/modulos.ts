import { Modulo } from "@/lib/types";
import { query } from "./db";

/**
 * Capa de Acceso a Datos de Módulos
 * 
 * Consultas reales a la base de datos PostgreSQL mediante driver 'pg'.
 * Mantiene exactamente los nombres de funciones e interfaz esperada.
 */

/**
 * Obtiene la lista de todos los módulos activos ordenados por el campo 'orden'.
 */
export async function getModulosActivos(): Promise<Modulo[]> {
  const result = await query<Modulo>(
    "SELECT id, nombre, activo, orden FROM modulo WHERE activo = true ORDER BY orden ASC;"
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
