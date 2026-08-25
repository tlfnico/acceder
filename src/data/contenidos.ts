import { Contenido } from "@/lib/types";
import { MOCK_CONTENIDOS } from "./mock/contenidos";

/**
 * Capa de Acceso a Datos de Contenidos
 * 
 * Actualmente consulta los datos mock en src/data/mock/contenidos.ts.
 * Filtra únicamente los registros donde 'activo' === true.
 */

/**
 * Obtiene la lista de contenidos activos pertenecientes a una categoría específica.
 */
export function getContenidosPorCategoria(idCategoria: number): Contenido[] {
  return MOCK_CONTENIDOS.filter(
    (contenido) => contenido.id_categoria === idCategoria && contenido.activo
  );
}

/**
 * Obtiene un contenido por su ID, únicamente si está activo.
 */
export function getContenidoById(idContenido: number): Contenido | undefined {
  const contenido = MOCK_CONTENIDOS.find((c) => c.id === idContenido);
  return contenido && contenido.activo ? contenido : undefined;
}
