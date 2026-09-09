import { pool, query } from "../src/data/db";
import { hashPassword } from "../src/lib/auth-helpers";

/**
 * Script de Utilidad: Creación Segura de Usuario Administrador Inicial
 * 
 * Permite sembrar de forma segura el primer usuario con rol ADMINISTRADOR
 * en el entorno local de desarrollo.
 * 
 * Parámetros opcionales vía variables de entorno:
 * - ADMIN_EMAIL (default: admin@acceder.gob.ar)
 * - ADMIN_PASSWORD (default: Admin1234!)
 * - ADMIN_NOMBRE (default: Administrador)
 * - ADMIN_APELLIDO (default: General)
 */
async function main() {
  console.log("=================================================");
  console.log("ACCEDER — Creación de Usuario Administrador Inicial");
  console.log("=================================================");

  const email = (process.env.ADMIN_EMAIL || "admin@acceder.gob.ar").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin1234!";
  const nombre = (process.env.ADMIN_NOMBRE || "Administrador").trim();
  const apellido = (process.env.ADMIN_APELLIDO || "General").trim();

  try {
    // 1. Obtener el ID del rol ADMINISTRADOR
    const rolResult = await query<{ id: number; nombre: string }>(
      "SELECT id, nombre FROM rol WHERE nombre = 'ADMINISTRADOR' LIMIT 1;"
    );

    if (rolResult.rows.length === 0) {
      throw new Error("No se encontró el rol 'ADMINISTRADOR' en la tabla rol.");
    }

    const idRolAdmin = rolResult.rows[0].id;

    // 2. Verificar si el usuario ya existe
    const existingUser = await query<{ id: number; email: string }>(
      "SELECT id, email FROM usuario WHERE LOWER(email) = LOWER($1) LIMIT 1;",
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log(`[INFO] El usuario administrador con email '${email}' ya existe (ID: ${existingUser.rows[0].id}).`);
      console.log("[INFO] No se realizaron modificaciones para evitar sobrescribir credenciales existentes.");
      return;
    }

    // 3. Generar hash seguro de contraseña (bcryptjs)
    const contraseniaHash = await hashPassword(password);

    // 4. Insertar nuevo usuario administrador
    const insertResult = await query<{ id: number; nombre: string; apellido: string; email: string; id_rol: number }>(
      `INSERT INTO usuario (nombre, apellido, email, contrasenia, id_rol, activo)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, nombre, apellido, email, id_rol;`,
      [nombre, apellido, email, contraseniaHash, idRolAdmin]
    );

    const newUser = insertResult.rows[0];
    console.log("[ÉXITO] Usuario Administrador creado exitosamente:");
    console.log(`- ID: ${newUser.id}`);
    console.log(`- Nombre: ${newUser.nombre} ${newUser.apellido}`);
    console.log(`- Email: ${newUser.email}`);
    console.log(`- Rol ID: ${newUser.id_rol} (ADMINISTRADOR)`);
    console.log(`- Estado: Activo (true)`);
    console.log("=================================================");
  } catch (error) {
    console.error("[ERROR] No se pudo crear el usuario administrador:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
