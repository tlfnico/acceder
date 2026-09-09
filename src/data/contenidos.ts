import { Contenido } from "@/lib/types";
import { query } from "./db";

/**
 * Capa de Acceso a Datos de Contenidos
 * 
 * Consultas reales a la base de datos PostgreSQL mediante driver 'pg'.
 */

// ==========================================
// CONSULTAS PÚBLICAS (Solo activos)
// ==========================================

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

// ==========================================
// CONSULTAS ADMINISTRATIVAS (Activos e inactivos)
// ==========================================

export interface ContenidoAdmin extends Contenido {
  categoria_nombre?: string;
  modulo_nombre?: string;
  id_modulo?: number;
}

/**
 * Obtiene todos los contenidos (activos e inactivos) para el panel de administración,
 * uniendo nombres de categoría y módulo.
 */
export async function getAllContenidosAdmin(): Promise<ContenidoAdmin[]> {
  const result = await query<ContenidoAdmin>(
    `SELECT c.id, c.id_categoria, c.titulo, c.descripcion, c.direccion, c.telefono, c.email, c.enlace, c.horario, c.activo, 
            c.fecha_creacion::text, c.fecha_modificacion::text,
            cat.nombre AS categoria_nombre, cat.id_modulo,
            m.nombre AS modulo_nombre
     FROM contenido c
     INNER JOIN categoria cat ON c.id_categoria = cat.id
     INNER JOIN modulo m ON cat.id_modulo = m.id
     ORDER BY m.orden ASC, cat.orden ASC, c.id ASC;`
  );
  return result.rows;
}

/**
 * Obtiene un contenido por su ID sin filtrar por estado activo (panel admin).
 */
export async function getContenidoByIdAdmin(idContenido: number): Promise<ContenidoAdmin | undefined> {
  const result = await query<ContenidoAdmin>(
    `SELECT c.id, c.id_categoria, c.titulo, c.descripcion, c.direccion, c.telefono, c.email, c.enlace, c.horario, c.activo, 
            c.fecha_creacion::text, c.fecha_modificacion::text,
            cat.nombre AS categoria_nombre, cat.id_modulo,
            m.nombre AS modulo_nombre
     FROM contenido c
     INNER JOIN categoria cat ON c.id_categoria = cat.id
     INNER JOIN modulo m ON cat.id_modulo = m.id
     WHERE c.id = $1
     LIMIT 1;`,
    [idContenido]
  );
  return result.rows[0] || undefined;
}

/**
 * Crea un nuevo contenido en PostgreSQL.
 * Admite valores NULL explícitos en campos de contacto opcionales.
 */
export async function createContenido(data: {
  id_categoria: number;
  titulo: string;
  descripcion: string;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
  enlace?: string | null;
  horario?: string | null;
  activo?: boolean;
}): Promise<Contenido> {
  const result = await query<Contenido>(
    `INSERT INTO contenido (
       id_categoria, titulo, descripcion, direccion, telefono, email, enlace, horario, activo
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, id_categoria, titulo, descripcion, direccion, telefono, email, enlace, horario, activo,
               fecha_creacion::text, fecha_modificacion::text;`,
    [
      data.id_categoria,
      data.titulo.trim(),
      data.descripcion.trim(),
      data.direccion?.trim() || null,
      data.telefono?.trim() || null,
      data.email?.trim() || null,
      data.enlace?.trim() || null,
      data.horario?.trim() || null,
      data.activo !== undefined ? data.activo : true,
    ]
  );
  return result.rows[0];
}

/**
 * Actualiza un contenido existente.
 */
export async function updateContenido(
  id: number,
  data: {
    id_categoria: number;
    titulo: string;
    descripcion: string;
    direccion?: string | null;
    telefono?: string | null;
    email?: string | null;
    enlace?: string | null;
    horario?: string | null;
    activo: boolean;
  }
): Promise<Contenido | undefined> {
  const result = await query<Contenido>(
    `UPDATE contenido
     SET id_categoria = $1, titulo = $2, descripcion = $3, direccion = $4, telefono = $5,
         email = $6, enlace = $7, horario = $8, activo = $9
     WHERE id = $10
     RETURNING id, id_categoria, titulo, descripcion, direccion, telefono, email, enlace, horario, activo,
               fecha_creacion::text, fecha_modificacion::text;`,
    [
      data.id_categoria,
      data.titulo.trim(),
      data.descripcion.trim(),
      data.direccion?.trim() || null,
      data.telefono?.trim() || null,
      data.email?.trim() || null,
      data.enlace?.trim() || null,
      data.horario?.trim() || null,
      data.activo,
      id,
    ]
  );
  return result.rows[0] || undefined;
}

/**
 * Conmuta el estado lógico (activo = true/false) de un contenido.
 */
export async function toggleActivoContenido(
  id: number,
  activo: boolean
): Promise<Contenido | undefined> {
  const result = await query<Contenido>(
    `UPDATE contenido
     SET activo = $1
     WHERE id = $2
     RETURNING id, id_categoria, titulo, descripcion, direccion, telefono, email, enlace, horario, activo,
               fecha_creacion::text, fecha_modificacion::text;`,
    [activo, id]
  );
  return result.rows[0] || undefined;
}

/**
 * Obtiene estadísticas de contenidos para el dashboard administrativo.
 */
export async function getContenidosStats(): Promise<{ total: number; activos: number; inactivos: number }> {
  const result = await query<{ total: string; activos: string; inactivos: string }>(
    `SELECT 
       COUNT(*)::text AS total,
       COUNT(*) FILTER (WHERE activo = true)::text AS activos,
       COUNT(*) FILTER (WHERE activo = false)::text AS inactivos
     FROM contenido;`
  );
  const row = result.rows[0];
  return {
    total: parseInt(row?.total || "0", 10),
    activos: parseInt(row?.activos || "0", 10),
    inactivos: parseInt(row?.inactivos || "0", 10),
  };
}
