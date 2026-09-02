import fs from 'fs';
import path from 'path';
import { query, pool } from '../src/data/db';

/**
 * Script para inicializar el esquema de base de datos en Supabase / PostgreSQL.
 * Ejecuta el contenido de database/schema.sql.
 */
async function main() {
  console.log('--- ACCEDER: Inicializando Esquema de Base de Datos en Supabase ---');

  const schemaFilePath = path.resolve(process.cwd(), 'database', 'schema.sql');
  if (!fs.existsSync(schemaFilePath)) {
    console.error(`Error: No se encontró el archivo de esquema en: ${schemaFilePath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaFilePath, 'utf-8');

  try {
    console.log('Ejecutando sentencias de database/schema.sql...');
    await query(sql);
    console.log('¡Esquema de base de datos creado exitosamente!');

    // Verificar tablas creadas
    const tablesRes = await query<{ table_name: string }>(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\nTablas disponibles en public schema:');
    tablesRes.rows.forEach(r => console.log(` - ${r.table_name}`));
  } catch (error) {
    console.error('Error al inicializar el esquema:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
