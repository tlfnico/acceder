import fs from 'fs';
import path from 'path';
import { Pool, QueryResult, QueryResultRow } from 'pg';

/**
 * Cliente de conexión a PostgreSQL mediante Pool reutilizable.
 * 
 * Este módulo opera exclusivamente del lado del servidor y gestiona
 * la conexión reutilizando el Pool durante el ciclo de vida de la aplicación.
 */

if (!process.env.DATABASE_URL) {
  // En entornos fuera del servidor de Next.js (como scripts de prueba),
  // intentar cargar .env.local nativamente si existe.
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    if (typeof process.loadEnvFile === 'function') {
      try {
        process.loadEnvFile(envPath);
      } catch {
        // Continuar con validación
      }
    }
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    'Error de configuración: La variable de entorno DATABASE_URL no está definida. ' +
    'Por favor, asegúrese de declarar DATABASE_URL en el archivo .env.local'
  );
}

// Preserva la conexión en globalThis para evitar múltiples instancias de Pool en desarrollo (Hot Reload)
const globalForDb = globalThis as unknown as {
  connPool: Pool | undefined;
};

export const pool =
  globalForDb.connPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.connPool = pool;
}

/**
 * Ejecuta una consulta SQL parametrizada reutilizando el Pool de conexiones.
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}
