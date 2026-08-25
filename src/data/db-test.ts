import { query } from "./db";

export interface RolRecord {
  id: number;
  nombre: string;
}

/**
 * Función de prueba para verificar la conectividad con la base de datos PostgreSQL.
 * Ejecuta una consulta real SELECT id, nombre FROM rol ORDER BY id.
 */
export async function probarConexionPostgres(): Promise<RolRecord[]> {
  const result = await query<RolRecord>(
    "SELECT id, nombre FROM rol ORDER BY id;"
  );
  return result.rows;
}
