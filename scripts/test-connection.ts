import { probarConexionPostgres } from '../src/data/db-test';
import { pool } from '../src/data/db';

async function main() {
  console.log('Probando conexión con PostgreSQL local...');
  try {
    const roles = await probarConexionPostgres();
    console.log('Resultado obtenido de la consulta real:');
    console.log(JSON.stringify(roles, null, 2));
  } catch (error) {
    console.error('Error al ejecutar la consulta de prueba:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
