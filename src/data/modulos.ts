import { Modulo } from "@/lib/types";
import { MOCK_MODULOS } from "./mock/modulos";

/**
 * Capa de Acceso a Datos de Módulos
 * 
 * Actualmente consulta los datos mock en src/data/mock/modulos.ts.
 * En la siguiente etapa, estas funciones serán reemplazadas para realizar
 * consultas a la base de datos PostgreSQL sin necesidad de alterar los componentes visuales ni la UI.
 */

/**
 * Obtiene la lista de todos los módulos activos ordenados por el campo 'orden'.
 */
export function getModulosActivos(): Modulo[] {
  return MOCK_MODULOS
    .filter((modulo) => modulo.activo)
    .sort((a, b) => a.orden - b.orden);
}

/**
 * Obtiene un módulo por su ID único, únicamente si está activo.
 */
export function getModuloById(id: number): Modulo | undefined {
  const modulo = MOCK_MODULOS.find((m) => m.id === id);
  return modulo && modulo.activo ? modulo : undefined;
}
