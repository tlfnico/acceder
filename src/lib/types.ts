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
