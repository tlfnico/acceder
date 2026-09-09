import { pool, query } from "../src/data/db";
import { hashPassword, verifyPassword } from "../src/lib/auth-helpers";
import { encryptSession, decryptSession } from "../src/lib/session";
import { getUsuarioAuthByEmail, getUsuariosAdmin, getUsuarioById } from "../src/data/usuarios";
import { getAllModulosAdmin, getModuloByIdAdmin, createModulo, toggleActivoModulo } from "../src/data/modulos";
import { getAllCategoriasAdmin, getCategoriaByIdAdmin, createCategoria, toggleActivoCategoria } from "../src/data/categorias";
import { getAllContenidosAdmin, getContenidoByIdAdmin, createContenido, toggleActivoContenido } from "../src/data/contenidos";

async function runTests() {
  console.log("=================================================");
  console.log("ACCEDER — SUITE DE VERIFICACIÓN ETAPA 7");
  console.log("=================================================\n");

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
    // 1. Pruebas Criptográficas (bcryptjs)
    // -------------------------------------------------------------
    console.log("--- 1. Criptografía y Hash de Contraseñas ---");
    const rawPass = "MiClaveSegura123!";
    const hash = await hashPassword(rawPass);
    assert(hash.startsWith("$2a$") || hash.startsWith("$2b$"), "El hash tiene formato válido bcrypt");
    assert(hash !== rawPass, "La contraseña no se almacena en texto plano");

    const validMatch = await verifyPassword(rawPass, hash);
    assert(validMatch === true, "Verificación exitosa con contraseña correcta");

    const invalidMatch = await verifyPassword("ClaveErronea", hash);
    assert(invalidMatch === false, "Rechazo seguro con contraseña incorrecta");

    // -------------------------------------------------------------
    // 2. Pruebas de Sesión Cifrada (jose / HS256)
    // -------------------------------------------------------------
    console.log("\n--- 2. Manejo de Sesiones (jose) ---");
    const testPayload = {
      userId: 1,
      email: "admin@acceder.gob.ar",
      nombre: "Administrador",
      apellido: "General",
      rolId: 1,
      rolNombre: "ADMINISTRADOR" as const,
    };

    const token = await encryptSession(testPayload);
    assert(typeof token === "string" && token.length > 30, "Generación de token JWT de sesión");

    const decrypted = await decryptSession(token);
    assert(decrypted !== null, "Desencriptación de token válida");
    assert(decrypted?.email === testPayload.email, "El payload de sesión preserva el email");
    assert(decrypted?.rolNombre === "ADMINISTRADOR", "El payload preserva el rol");

    const tampered = await decryptSession(token + "manipulado");
    assert(tampered === null, "Rechazo de tokens manipulados o inválidos");

    // -------------------------------------------------------------
    // 3. Capa de Datos de Usuarios y No Exposición de Contraseñas
    // -------------------------------------------------------------
    console.log("\n--- 3. Acceso a Datos de Usuarios y Seguridad ---");
    const authUser = await getUsuarioAuthByEmail("admin@acceder.gob.ar");
    assert(!!authUser, "Usuario admin encontrado para autenticación");
    assert(!!authUser?.contrasenia, "getUsuarioAuthByEmail obtiene el hash para comparar");

    const adminList = await getUsuariosAdmin();
    assert(adminList.length > 0, `Se encontraron ${adminList.length} usuarios en la lista admin`);

    // Verificar que contrasenia NO esté presente en la consulta admin
    const hasPasswordInList = adminList.some((u: any) => "contrasenia" in u);
    assert(!hasPasswordInList, "getUsuariosAdmin NO expone la columna contrasenia");

    const userById = await getUsuarioById(adminList[0].id);
    assert(!!userById, "getUsuarioById recupera el usuario correctamente");
    assert(!("contrasenia" in (userById || {})), "getUsuarioById NO expone la columna contrasenia");

    // -------------------------------------------------------------
    // 4. Consultas Administrativas de Módulos, Categorías y Contenidos
    // -------------------------------------------------------------
    console.log("\n--- 4. Consultas Administrativas (Activos + Inactivos) ---");
    const modulosAdmin = await getAllModulosAdmin();
    assert(modulosAdmin.length >= 8, `Módulos recuperados en admin: ${modulosAdmin.length}`);

    const categoriasAdmin = await getAllCategoriasAdmin();
    assert(categoriasAdmin.length >= 21, `Categorías recuperadas en admin: ${categoriasAdmin.length}`);
    assert(!!categoriasAdmin[0].modulo_nombre, "Categorías incluyen el nombre del módulo relacionado");

    const contenidosAdmin = await getAllContenidosAdmin();
    assert(contenidosAdmin.length >= 26, `Contenidos recuperados en admin: ${contenidosAdmin.length}`);
    assert(!!contenidosAdmin[0].categoria_nombre, "Contenidos incluyen el nombre de la categoría");
    assert(!!contenidosAdmin[0].modulo_nombre, "Contenidos incluyen el nombre del módulo");

    // -------------------------------------------------------------
    // 5. ABM y Borrado Lógico en PostgreSQL
    // -------------------------------------------------------------
    console.log("\n--- 5. ABM y Borrado Lógico en PostgreSQL ---");

    // Sincronizar secuencias de identidad de PostgreSQL tras seeds
    await query("SELECT setval(pg_get_serial_sequence('modulo', 'id'), COALESCE(MAX(id), 1)) FROM modulo;");
    await query("SELECT setval(pg_get_serial_sequence('categoria', 'id'), COALESCE(MAX(id), 1)) FROM categoria;");
    await query("SELECT setval(pg_get_serial_sequence('contenido', 'id'), COALESCE(MAX(id), 1)) FROM contenido;");
    await query("SELECT setval(pg_get_serial_sequence('usuario', 'id'), COALESCE(MAX(id), 1)) FROM usuario;");
    
    // Crear módulo de prueba
    const tempMod = await createModulo({
      nombre: "Módulo Test Etapa 7",
      orden: 999,
      activo: true,
    });
    assert(tempMod.nombre === "Módulo Test Etapa 7", "Creación de módulo en PostgreSQL");

    // Desactivar lógicamente (activo = false)
    const deactivatedMod = await toggleActivoModulo(tempMod.id, false);
    assert(deactivatedMod?.activo === false, "Desactivación lógica de módulo (activo = false)");

    // Reactivar lógicamente (activo = true)
    const reactivatedMod = await toggleActivoModulo(tempMod.id, true);
    assert(reactivatedMod?.activo === true, "Reactivación lógica de módulo (activo = true)");

    // Crear categoría de prueba bajo el módulo test
    const tempCat = await createCategoria({
      id_modulo: tempMod.id,
      nombre: "Categoría Test Etapa 7",
      descripcion: "Descripción categoría test",
      orden: 1,
      activo: true,
    });
    assert(tempCat.nombre === "Categoría Test Etapa 7", "Creación de categoría en PostgreSQL");

    // Desactivar categoría
    const deactivatedCat = await toggleActivoCategoria(tempCat.id, false);
    assert(deactivatedCat?.activo === false, "Desactivación lógica de categoría (activo = false)");

    // Crear contenido de prueba con campos opcionales NULL
    const tempCont = await createContenido({
      id_categoria: tempCat.id,
      titulo: "Contenido Test Etapa 7",
      descripcion: "Descripción del contenido de prueba",
      direccion: null,
      telefono: null,
      email: "test@acceder.gob.ar",
      enlace: null,
      horario: null,
      activo: true,
    });
    assert(tempCont.titulo === "Contenido Test Etapa 7", "Creación de contenido en PostgreSQL");
    assert(tempCont.direccion === null && tempCont.enlace === null, "Campos opcionales guardados como NULL");

    // Desactivar contenido
    const deactivatedCont = await toggleActivoContenido(tempCont.id, false);
    assert(deactivatedCont?.activo === false, "Desactivación lógica de contenido (activo = false)");

    // Limpieza de registros temporales creados exclusivamente en este test
    await query("DELETE FROM contenido WHERE id = $1;", [tempCont.id]);
    await query("DELETE FROM categoria WHERE id = $1;", [tempCat.id]);
    await query("DELETE FROM modulo WHERE id = $1;", [tempMod.id]);
    console.log("[INFO] Registros temporales de prueba limpiados correctamente.");

    console.log("\n=================================================");
    console.log(`RESUMEN DE PRUEBAS: ${passed} PASADAS, ${failed} FALLIDAS`);
    console.log("=================================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("[ERROR EN SUITE]:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runTests();
