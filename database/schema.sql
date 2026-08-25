-- =============================================================================
-- ACCEDER — Esquema Técnico de Base de Datos PostgreSQL
-- 
-- Modelo Relacional Definitivo v1.0
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABLA: rol
-- -----------------------------------------------------------------------------
CREATE TABLE rol (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- -----------------------------------------------------------------------------
-- 2. TABLA: usuario
-- -----------------------------------------------------------------------------
CREATE TABLE usuario (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contrasenia VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    id_rol INTEGER NOT NULL REFERENCES rol(id) ON DELETE RESTRICT
);

-- -----------------------------------------------------------------------------
-- 3. TABLA: modulo
-- -----------------------------------------------------------------------------
CREATE TABLE modulo (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    orden INTEGER NOT NULL DEFAULT 0
);

-- -----------------------------------------------------------------------------
-- 4. TABLA: categoria
-- -----------------------------------------------------------------------------
CREATE TABLE categoria (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_modulo INTEGER NOT NULL REFERENCES modulo(id) ON DELETE RESTRICT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    orden INTEGER NOT NULL DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- -----------------------------------------------------------------------------
-- 5. TABLA: contenido
-- -----------------------------------------------------------------------------
CREATE TABLE contenido (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria INTEGER NOT NULL REFERENCES categoria(id) ON DELETE RESTRICT,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    direccion VARCHAR(255) NULL,
    telefono VARCHAR(50) NULL,
    email VARCHAR(255) NULL,
    enlace VARCHAR(500) NULL,
    horario VARCHAR(255) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- FUNCIONES Y TRIGGERS
-- =============================================================================

-- Función para actualizar automáticamente fecha_modificacion en la tabla contenido
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_modificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger asignado a la tabla contenido
CREATE TRIGGER trg_contenido_actualizar_fecha_modificacion
BEFORE UPDATE ON contenido
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();

-- =============================================================================
-- ÍNDICES (Optimizados y sin redundancias)
-- =============================================================================

-- Filtrado de usuarios por rol en panel administrativo
CREATE INDEX idx_usuario_id_rol ON usuario(id_rol);

-- Filtrado de categorías por módulo y estado activo
CREATE INDEX idx_categoria_modulo_activo ON categoria(id_modulo, activo);

-- Filtrado de contenidos por categoría y estado activo (consulta pública principal)
CREATE INDEX idx_contenido_categoria_activo ON contenido(id_categoria, activo);

-- Ordenamiento de módulos activos para el menú y vista principal
CREATE INDEX idx_modulo_orden_activo ON modulo(orden, activo);

-- =============================================================================
-- DATOS INICIALES (Seed Data)
-- =============================================================================

INSERT INTO rol (nombre) VALUES 
('ADMINISTRADOR'),
('PERSONAL_ACCESIBILIDAD');
