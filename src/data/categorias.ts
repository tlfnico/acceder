import { Categoria } from "@/lib/types";
import { MOCK_CATEGORIAS } from "./mock/categorias";

/**
 * Capa de Acceso a Datos de Categorías
 * 
 * Actualmente consulta los datos mock en src/data/mock/categorias.ts.
 * Filtra únicamente los registros donde 'activo' === true.
 */

/**
 * Obtiene la lista de categorías activas pertenecientes a un módulo específico,
 * ordenadas por el campo 'orden'.
 */
export function getCategoriasPorModulo(idModulo: number): Categoria[] {
  return MOCK_CATEGORIAS
    .filter((categoria) => categoria.id_modulo === idModulo && categoria.activo)
    .sort((a, b) => a.orden - b.orden);
}

/**
 * Obtiene una categoría específica por su ID, únicamente si está activa.
 */
export function getCategoriaById(idCategoria: number): Categoria | undefined {
  const categoria = MOCK_CATEGORIAS.find((c) => c.id === idCategoria);
  return categoria && categoria.activo ? categoria : undefined;
}
