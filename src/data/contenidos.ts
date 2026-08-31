import { Contenido } from "@/lib/types";
import { query } from "./db";

/**
 * Capa de Acceso a Datos de Contenidos
 * 
 * Consultas reales a la base de datos PostgreSQL mediante driver 'pg'.
 * Filtra únicamente los registros donde 'activo' = true.
 */

/**
 * Obtiene la lista de contenidos activos pertenecientes a una categoría específica.
 */
export async function getContenidosPorCategoria(idCategoria: number): Promise<Contenido[]> {
  const result = await query<Contenido>(
    `SELECT id, id_categoria, titulo, descripcion, direccion, telefono, email, enlace, horario, activo, 
            fecha_creacion::text, fecha_modificacion::text 
     FROM contenido 
     WHERE id_categoria = $1 AND activo = true 
     ORDER BY id ASC;`,
    [idCategoria]
  );
  return result.rows;
}

/**
 * Obtiene un contenido por su ID, únicamente si está activo.
 */
export async function getContenidoById(idContenido: number): Promise<Contenido | undefined> {
  const result = await query<Contenido>(
    `SELECT id, id_categoria, titulo, descripcion, direccion, telefono, email, enlace, horario, activo, 
            fecha_creacion::text, fecha_modificacion::text 
     FROM contenido 
     WHERE id = $1 AND activo = true 
     LIMIT 1;`,
    [idContenido]
  );
  return result.rows[0] || undefined;
}
