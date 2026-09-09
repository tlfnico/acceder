import { query } from "./db";
import { Usuario, UsuarioSeguro, Rol } from "@/lib/types";

/**
 * Capa de Acceso a Datos de Usuarios
 * 
 * Consultas SQL parametrizadas a PostgreSQL mediante 'pg.Pool'.
 * IMPORTANTE: Las consultas regulares NO seleccionan el campo 'contrasenia'.
 */

/**
 * Obtiene la lista de todos los roles disponibles en el sistema.
 */
export async function getRoles(): Promise<Rol[]> {
  const result = await query<Rol>(
    "SELECT id, nombre FROM rol ORDER BY id ASC;"
  );
  return result.rows;
}

/**
 * Obtiene un usuario por email con su contraseña hasheada.
 * USO EXCLUSIVO: Proceso de autenticación y verificación de credenciales en el servidor.
 */
export async function getUsuarioAuthByEmail(email: string): Promise<Usuario | undefined> {
  const result = await query<Usuario>(
    `SELECT u.id, u.nombre, u.apellido, u.email, u.contrasenia, u.activo, u.id_rol, r.nombre AS rol_nombre
     FROM usuario u
     INNER JOIN rol r ON u.id_rol = r.id
     WHERE LOWER(u.email) = LOWER($1)
     LIMIT 1;`,
    [email.trim()]
  );
  return result.rows[0] || undefined;
}

/**
 * Obtiene un usuario seguro por email (sin contraseña).
 */
export async function getUsuarioByEmail(email: string): Promise<UsuarioSeguro | undefined> {
  const result = await query<UsuarioSeguro>(
    `SELECT u.id, u.nombre, u.apellido, u.email, u.activo, u.id_rol, r.nombre AS rol_nombre
     FROM usuario u
     INNER JOIN rol r ON u.id_rol = r.id
     WHERE LOWER(u.email) = LOWER($1)
     LIMIT 1;`,
    [email.trim()]
  );
  return result.rows[0] || undefined;
}

/**
 * Obtiene todos los usuarios del sistema (activos e inactivos) para el panel administrativo.
 * Excluye estrictamente el campo 'contrasenia'.
 */
export async function getUsuariosAdmin(): Promise<UsuarioSeguro[]> {
  const result = await query<UsuarioSeguro>(
    `SELECT u.id, u.nombre, u.apellido, u.email, u.activo, u.id_rol, r.nombre AS rol_nombre
     FROM usuario u
     INNER JOIN rol r ON u.id_rol = r.id
     ORDER BY u.id ASC;`
  );
  return result.rows;
}

/**
 * Obtiene un usuario por su ID (sin contraseña).
 */
export async function getUsuarioById(id: number): Promise<UsuarioSeguro | undefined> {
  const result = await query<UsuarioSeguro>(
    `SELECT u.id, u.nombre, u.apellido, u.email, u.activo, u.id_rol, r.nombre AS rol_nombre
     FROM usuario u
     INNER JOIN rol r ON u.id_rol = r.id
     WHERE u.id = $1
     LIMIT 1;`,
    [id]
  );
  return result.rows[0] || undefined;
}

/**
 * Crea un nuevo usuario en la base de datos guardando el hash de contraseña.
 * Retorna el usuario seguro creado (sin hash de contraseña).
 */
export async function createUsuario(data: {
  nombre: string;
  apellido: string;
  email: string;
  contraseniaHash: string;
  id_rol: number;
  activo?: boolean;
}): Promise<UsuarioSeguro> {
  const result = await query<UsuarioSeguro>(
    `INSERT INTO usuario (nombre, apellido, email, contrasenia, id_rol, activo)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, nombre, apellido, email, activo, id_rol;`,
    [
      data.nombre.trim(),
      data.apellido.trim(),
      data.email.trim().toLowerCase(),
      data.contraseniaHash,
      data.id_rol,
      data.activo !== undefined ? data.activo : true,
    ]
  );
  return result.rows[0];
}

/**
 * Actualiza los datos de un usuario existente.
 * Si se especifica 'contraseniaHash', actualiza también la contraseña.
 */
export async function updateUsuario(
  id: number,
  data: {
    nombre: string;
    apellido: string;
    email: string;
    id_rol: number;
    activo: boolean;
    contraseniaHash?: string;
  }
): Promise<UsuarioSeguro | undefined> {
  let result;
  if (data.contraseniaHash) {
    result = await query<UsuarioSeguro>(
      `UPDATE usuario
       SET nombre = $1, apellido = $2, email = $3, id_rol = $4, activo = $5, contrasenia = $6
       WHERE id = $7
       RETURNING id, nombre, apellido, email, activo, id_rol;`,
      [
        data.nombre.trim(),
        data.apellido.trim(),
        data.email.trim().toLowerCase(),
        data.id_rol,
        data.activo,
        data.contraseniaHash,
        id,
      ]
    );
  } else {
    result = await query<UsuarioSeguro>(
      `UPDATE usuario
       SET nombre = $1, apellido = $2, email = $3, id_rol = $4, activo = $5
       WHERE id = $6
       RETURNING id, nombre, apellido, email, activo, id_rol;`,
      [
        data.nombre.trim(),
        data.apellido.trim(),
        data.email.trim().toLowerCase(),
        data.id_rol,
        data.activo,
        id,
      ]
    );
  }
  return result.rows[0] || undefined;
}

/**
 * Conmuta el estado lógico (activo = true/false) de un usuario.
 */
export async function toggleActivoUsuario(id: number, activo: boolean): Promise<UsuarioSeguro | undefined> {
  const result = await query<UsuarioSeguro>(
    `UPDATE usuario
     SET activo = $1
     WHERE id = $2
     RETURNING id, nombre, apellido, email, activo, id_rol;`,
    [activo, id]
  );
  return result.rows[0] || undefined;
}
