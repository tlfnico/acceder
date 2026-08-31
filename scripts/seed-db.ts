import fs from 'fs';
import path from 'path';
import { query, pool } from '../src/data/db';

/**
 * Script ejecutor de seed para entorno local de desarrollo.
 * 
 * Lee el archivo database/seed.sql y lo ejecuta sobre la base de datos PostgreSQL
 * conectada mediante el cliente Pool de src/data/db.ts.
 */
async function main() {
  console.log('--- ACCEDER: Ejecutando Seed de Datos de Prueba (PostgreSQL Local) ---');
  
  const seedFilePath = path.resolve(process.cwd(), 'database', 'seed.sql');
  if (!fs.existsSync(seedFilePath)) {
    console.error(`Error: No se encontró el archivo de seed en: ${seedFilePath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(seedFilePath, 'utf-8');

  try {
    console.log('Ejecutando sentencias SQL de database/seed.sql...');
    await query(sql);
    console.log('¡Seed ejecutado exitosamente en PostgreSQL!');

    // Verificación de conteo no destructiva
    const modulosActivos = (await query('SELECT COUNT(*) FROM modulo WHERE activo = true;')).rows[0].count;
    const modulosInactivos = (await query('SELECT COUNT(*) FROM modulo WHERE activo = false;')).rows[0].count;
    const categoriasActivas = (await query('SELECT COUNT(*) FROM categoria WHERE activo = true;')).rows[0].count;
    const categoriasInactivas = (await query('SELECT COUNT(*) FROM categoria WHERE activo = false;')).rows[0].count;
    const contenidosActivos = (await query('SELECT COUNT(*) FROM contenido WHERE activo = true;')).rows[0].count;
    const contenidosInactivos = (await query('SELECT COUNT(*) FROM contenido WHERE activo = false;')).rows[0].count;

    console.log('\n--- Resumen de Datos Cargados en PostgreSQL ---');
    console.log(`Módulos:    ${modulosActivos} activos, ${modulosInactivos} inactivos (Total: ${parseInt(modulosActivos, 10) + parseInt(modulosInactivos, 10)})`);
    console.log(`Categorías: ${categoriasActivas} activas, ${categoriasInactivas} inactivas (Total: ${parseInt(categoriasActivas, 10) + parseInt(categoriasInactivas, 10)})`);
    console.log(`Contenidos: ${contenidosActivos} activos, ${contenidosInactivos} inactivos (Total: ${parseInt(contenidosActivos, 10) + parseInt(contenidosInactivos, 10)})`);
  } catch (error) {
    console.error('Error al ejecutar el seed en PostgreSQL:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
