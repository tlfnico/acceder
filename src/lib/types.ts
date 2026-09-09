/**
 * ACCEDER - Definiciones de Tipos de Datos (Interfaces TypeScript)
 * 
 * Estas interfaces coinciden exactamente con la estructura de las tablas de PostgreSQL
 * definidas en database/schema.sql y docs/modelo-de-datos.md.
 */

export interface Modulo {
  id: number;
  nombre: string;
  activo: boolean;
  orden: number;
}

export interface Categoria {
  id: number;
  id_modulo: number;
  nombre: string;
  descripcion: string;
  orden: number;
  activo: boolean;
}

export interface Contenido {
  id: number;
  id_categoria: number;
  titulo: string;
  descripcion: string;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  enlace: string | null;
  horario: string | null;
  activo: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
}

/**
 * Tipo auxiliar para Breadcrumbs de navegación accesible
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Roles del sistema (coincidentes con la tabla 'rol')
 */
export type RolNombre = "ADMINISTRADOR" | "PERSONAL_ACCESIBILIDAD";

export interface Rol {
  id: number;
  nombre: RolNombre;
}

/**
 * Entidad Usuario de PostgreSQL (incluye hash de contraseña)
 * NOTA: Solo debe usarse internamente en el proceso de autenticación.
 */
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  activo: boolean;
  id_rol: number;
  rol_nombre?: RolNombre;
}

/**
 * Entidad Usuario Seguro (excluye contraseña) para consultas administrativas y vistas
 */
export interface UsuarioSeguro {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
  id_rol: number;
  rol_nombre?: RolNombre;
}

/**
 * Payload contenido en la cookie de sesión cifrada (acceder_session)
 */
export interface SessionPayload {
  userId: number;
  email: string;
  nombre: string;
  apellido: string;
  rolId: number;
  rolNombre: RolNombre;
  exp?: number;
}

