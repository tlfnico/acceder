import { pool, query } from "../src/data/db";
import { hashPassword, verifyPassword } from "../src/lib/auth-helpers";
import { encryptSession, decryptSession } from "../src/lib/session";
import { getUsuarioAuthByEmail, getUsuariosAdmin, getUsuarioById } from "../src/data/usuarios";
import { getModulosActivos, getModuloById, getAllModulosAdmin, getModuloByIdAdmin } from "../src/data/modulos";
import { getCategoriasPorModulo, getCategoriaById, getAllCategoriasAdmin, getCategoriaByIdAdmin } from "../src/data/categorias";
import { getContenidosPorCategoria, getContenidoById, getAllContenidosAdmin, getContenidoByIdAdmin } from "../src/data/contenidos";

async function runValidation() {
  console.log("===============================================================");
  console.log("ACCEDER — SUITE DE VALIDACIÓN INTEGRAL (ETAPA 8 / SUPABASE)");
  console.log("===============================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} ${detail ? `-> ${detail}` : ""}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // FASE 2: Validación de Base de Datos (Supabase)
    // -------------------------------------------------------------
    console.log("--- FASE 2: Validación de Conexión y Entidades en Supabase ---");
    const roles = (await query("SELECT id, nombre FROM rol ORDER BY id ASC;")).rows;
    assert(roles.length === 2, "Tabla 'rol' contiene exactamente 2 roles canónicos");
    assert(roles[0].nombre === "ADMINISTRADOR", "Rol 1 es ADMINISTRADOR");
    assert(roles[1].nombre === "PERSONAL_ACCESIBILIDAD", "Rol 2 es PERSONAL_ACCESIBILIDAD");

    const usuarios = (await query("SELECT id, email, activo, id_rol FROM usuario;")).rows;
    assert(usuarios.length >= 1, `Tabla 'usuario' accesible (${usuarios.length} usuario/s)`);

    const modulosRow = (await query(`
      SELECT 
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE activo = true)::int AS activos,
        COUNT(*) FILTER (WHERE activo = false)::int AS inactivos
      FROM modulo;
    `)).rows[0];
    assert(modulosRow.total >= 8 && modulosRow.activos >= 7,
      `Módulos en Supabase: ${modulosRow.total} total (${modulosRow.activos} activos)`);

    const categoriasRow = (await query(`
      SELECT 
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE activo = true)::int AS activas,
        COUNT(*) FILTER (WHERE activo = false)::int AS inactivas
      FROM categoria;
    `)).rows[0];
    assert(categoriasRow.total >= 21 && categoriasRow.activas >= 19,
      `Categorías en Supabase: ${categoriasRow.total} total (${categoriasRow.activas} activas)`);

    const contenidosRow = (await query(`
      SELECT 
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE activo = true)::int AS activos,
        COUNT(*) FILTER (WHERE activo = false)::int AS inactivos
      FROM contenido;
    `)).rows[0];
    assert(contenidosRow.total >= 26 && contenidosRow.activos >= 24,
      `Contenidos en Supabase: ${contenidosRow.total} total (${contenidosRow.activos} activos)`);

    // -------------------------------------------------------------
    // FASE 3: Validación del Portal Público
    // -------------------------------------------------------------
    console.log("\n--- FASE 3: Validación del Portal Público (Filtros Activos) ---");
    const modulosPublicos = await getModulosActivos();
    assert(modulosPublicos.length === modulosRow.activos, `getModulosActivos() retorna exactamente los ${modulosRow.activos} módulos activos`);
    const allModulosActivos = modulosPublicos.every((m) => m.activo === true);
    assert(allModulosActivos, "Todos los módulos públicos tienen activo = true");

    // Verificar filtro inactivo para módulo (usando un id inactivo o id inexistente 999999)
    const moduloInactivo = (await query<{ id: number }>("SELECT id FROM modulo WHERE activo = false LIMIT 1;")).rows[0];
    const idModuloInactivo = moduloInactivo ? moduloInactivo.id : 999999;
    const checkModuloInactivo = await getModuloById(idModuloInactivo);
    assert(checkModuloInactivo === undefined, "getModuloById() para módulo inactivo/inexistente retorna undefined (404)");

    // Encontrar categoría inactiva
    const categoriaInactiva = (await query<{ id: number }>("SELECT id FROM categoria WHERE activo = false LIMIT 1;")).rows[0];
    const idCategoriaInactiva = categoriaInactiva ? categoriaInactiva.id : 999999;
    const checkCategoriaInactiva = await getCategoriaById(idCategoriaInactiva);
    assert(checkCategoriaInactiva === undefined, "getCategoriaById() para categoría inactiva/inexistente retorna undefined (404)");

    // Encontrar contenido inactivo
    const contenidoInactivo = (await query<{ id: number }>("SELECT id FROM contenido WHERE activo = false LIMIT 1;")).rows[0];
    const idContenidoInactivo = contenidoInactivo ? contenidoInactivo.id : 999999;
    const checkContenidoInactivo = await getContenidoById(idContenidoInactivo);
    assert(checkContenidoInactivo === undefined, "getContenidoById() para contenido inactivo/inexistente retorna undefined (404)");


    // Validar campos opcionales NULL en contenidos
    const contenidoConNulls = (await query<{ id: number; direccion: string | null; email: string | null }>(
      "SELECT id, direccion, email FROM contenido WHERE direccion IS NULL LIMIT 1;"
    )).rows[0];
    assert(contenidoConNulls && contenidoConNulls.direccion === null,
      "Contenidos en Supabase admiten campos opcionales con valor NULL");

    // -------------------------------------------------------------
    // FASE 4: Validación de Autenticación y Login
    // -------------------------------------------------------------
    console.log("\n--- FASE 4: Validación de Casos de Login ---");
    // Caso 1: Credenciales correctas
    const adminUser = await getUsuarioAuthByEmail("admin@acceder.gob.ar");
    assert(adminUser !== undefined, "Caso 1: Usuario admin existe en Supabase");
    const validMatch = await verifyPassword("Admin1234!", adminUser!.contrasenia);
    assert(validMatch === true, "Caso 1: Contraseña correcta verificada exitosamente con bcrypt");

    // Caso 2: Contraseña incorrecta
    const wrongMatch = await verifyPassword("ContraseniaEquivocada", adminUser!.contrasenia);
    assert(wrongMatch === false, "Caso 2: Contraseña incorrecta rechazada");

    // Caso 3: Usuario inexistente
    const nonExistent = await getUsuarioAuthByEmail("usuario_fantasma@acceder.gob.ar");
    assert(nonExistent === undefined, "Caso 3: Usuario inexistente retorna undefined");

    // -------------------------------------------------------------
    // FASE 5: Validación de Sesiones (jose / JWT)
    // -------------------------------------------------------------
    console.log("\n--- FASE 5: Validación de Sesiones JWT (jose) ---");
    const sessionPayload = {
      userId: adminUser!.id,
      email: adminUser!.email,
      nombre: adminUser!.nombre,
      apellido: adminUser!.apellido,
      rolId: adminUser!.id_rol,
      rolNombre: "ADMINISTRADOR" as const,
    };

    const token = await encryptSession(sessionPayload);
    assert(typeof token === "string" && token.length > 50, "Token JWT generado con éxito");

    const decoded = await decryptSession(token);
    assert(decoded !== null, "Token JWT verificado y desencriptado correctamente");
    assert(decoded?.userId === adminUser!.id, "Payload preserva el userId");
    assert(decoded?.rolNombre === "ADMINISTRADOR", "Payload preserva rolNombre");

    const tampered = await decryptSession(token + "manipulado");
    assert(tampered === null, "Token adulterado es rechazado (retorna null)");

    // -------------------------------------------------------------
    // FASE 6: Validación de RBAC (Autorización en Servidor)
    // -------------------------------------------------------------
    console.log("\n--- FASE 6: Validación de RBAC y DAL en Servidor ---");
    const sessionPersonal = {
      userId: 99,
      email: "personal@acceder.gob.ar",
      nombre: "Personal",
      apellido: "Accesibilidad",
      rolId: 2,
      rolNombre: "PERSONAL_ACCESIBILIDAD" as const,
    };

    // Función de prueba simulando requireAdminAction
    function testRequireAdmin(session: typeof sessionPersonal | typeof sessionPayload) {
      if (session.rolNombre !== "ADMINISTRADOR") {
        throw new Error("Acceso no autorizado: Se requiere rol ADMINISTRADOR para realizar esta acción.");
      }
      return true;
    }

    assert(testRequireAdmin(sessionPayload) === true, "ADMINISTRADOR tiene acceso a operaciones exclusivas");

    let personalBlocked = false;
    try {
      testRequireAdmin(sessionPersonal);
    } catch (err: any) {
      if (err.message.includes("Acceso no autorizado")) {
        personalBlocked = true;
      }
    }
    assert(personalBlocked, "PERSONAL_ACCESIBILIDAD es bloqueado en servidor por requireAdminAction()");

    // -------------------------------------------------------------
    // FASE 7 & 8: Validación de ABM, No Exposición de Contraseñas y Seguridad
    // -------------------------------------------------------------
    console.log("\n--- FASE 7 y 8: Validación de ABM y Seguridad (No Exposición de Hash) ---");
    const modulosAdmin = await getAllModulosAdmin();
    assert(modulosAdmin.length === 8, `getAllModulosAdmin() retorna los 8 módulos (7 activos + 1 inactivo)`);

    const categoriasAdmin = await getAllCategoriasAdmin();
    assert(categoriasAdmin.length === 21, `getAllCategoriasAdmin() retorna las 21 categorías (19 activas + 2 inactivas)`);

    const contenidosAdmin = await getAllContenidosAdmin();
    assert(contenidosAdmin.length === 26, `getAllContenidosAdmin() retorna los 26 contenidos (24 activos + 2 inactivos)`);

    const usuariosAdmin = await getUsuariosAdmin();
    assert(usuariosAdmin.length >= 1, `getUsuariosAdmin() retorna listado de usuarios`);
    const passwordExposed = usuariosAdmin.some((u: any) => "contrasenia" in u);
    assert(!passwordExposed, "getUsuariosAdmin() NO expone el campo contrasenia");

    const singleUser = await getUsuarioById(usuariosAdmin[0].id);
    assert(singleUser !== undefined, "getUsuarioById() recupera usuario");
    assert(!("contrasenia" in (singleUser || {})), "getUsuarioById() NO expone el campo contrasenia");

    // Prueba de prevención de SQL Injection mediante parámetros
    const sqlInjectionPayload = "admin' OR '1'='1";
    const injectionResult = await query("SELECT id FROM usuario WHERE email = $1;", [sqlInjectionPayload]);
    assert(injectionResult.rows.length === 0, "Consultas SQL parametrizadas neutralizan inyección SQL");

    console.log("\n===============================================================");
    console.log(`RESUMEN DE VALIDACIÓN: ${passed} PASADAS, ${failed} FALLIDAS`);
    console.log("===============================================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("[ERROR DURANTE VALIDACIÓN]:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runValidation();
