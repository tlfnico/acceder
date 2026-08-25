import { Modulo } from "@/lib/types";

/**
 * Datos Mock de Módulos
 * Coinciden con los campos de la tabla PostgreSQL 'modulo':
 * - id (number)
 * - nombre (string)
 * - activo (boolean)
 * - orden (number)
 *
 * Incluye un módulo con activo: false para verificar el filtrado de registros inactivos.
 */
export const MOCK_MODULOS: Modulo[] = [
  {
    id: 1,
    nombre: "Derechos y CUD",
    activo: true,
    orden: 1,
  },
  {
    id: 2,
    nombre: "Salud y Rehabilitación",
    activo: true,
    orden: 2,
  },
  {
    id: 3,
    nombre: "Educación e Inclusión",
    activo: true,
    orden: 3,
  },
  {
    id: 4,
    nombre: "Trabajo y Empleo",
    activo: true,
    orden: 4,
  },
  {
    id: 5,
    nombre: "Transporte y Movilidad",
    activo: true,
    orden: 5,
  },
  {
    id: 6,
    nombre: "Módulo En Mantenimiento",
    activo: false, // Inactivo: NO debe mostrarse públicamente
    orden: 6,
  },
];
