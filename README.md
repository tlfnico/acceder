# ACCEDER

Portal público de recursos de accesibilidad y panel administrativo construido con Next.js y PostgreSQL.

## Variables de entorno

Crear `.env.local` solo para desarrollo local:

```dotenv
DATABASE_URL=postgresql://usuario:contraseña@host:5432/acceder
SESSION_SECRET=una-clave-aleatoria-de-al-menos-32-bytes
```

En producción también se debe configurar `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` con una clave base64 estable y compartida entre todas las instancias. No se deben versionar ni mostrar estas variables.

## Desarrollo

```bash
npm run dev
npm run lint
npm run build
```

## Base de datos

- Para una base nueva, aplicar `database/schema.sql` y después el contenido inicial que corresponda.
- Para una base existente, aplicar primero la migración `database/migrations/001_login_rate_limit.sql`.
- `npm run db:seed` carga datos de desarrollo: nunca debe ejecutarse contra producción.
- `npm run admin:create` exige `ADMIN_EMAIL` y `ADMIN_PASSWORD`; no tiene credenciales predeterminadas.

## Despliegue

1. Aplicar las migraciones en una copia de seguridad verificada de la base.
2. Configurar las variables de entorno requeridas en el hosting.
3. Confirmar que HTTPS está forzado por el proveedor o proxy.
4. Ejecutar `npm run lint` y `npm run build` en el entorno de entrega.
5. Verificar manualmente acceso público, inicio/cierre de sesión, permisos y enlaces externos.

El límite de intentos de inicio de sesión usa PostgreSQL y requiere que la migración esté aplicada. Las cabeceras de seguridad se configuran en `next.config.ts`.

