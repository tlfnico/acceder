-- =============================================================================
-- ACCEDER — Script de Datos de Prueba (Seed de Desarrollo Local)
-- 
-- ADVERTENCIA:
-- Este script es EXCLUSIVO para entornos locales de desarrollo y pruebas.
-- Ejecuta una operación destructiva (TRUNCATE) sobre las tablas contenido,
-- categoria y modulo para permitir una carga limpia e idempotente de datos ficticios.
-- 
-- NO EJECUTAR EN ENTORNOS DE PRODUCCIÓN NI SOBRE BASES DE DATOS CON DATOS REALES.
-- =============================================================================

-- Limpieza controlada de tablas de datos (preserva rol y usuario)
TRUNCATE TABLE contenido, categoria, modulo RESTART IDENTITY CASCADE;

-- -----------------------------------------------------------------------------
-- 1. MÓDULOS TEMÁTICOS (modulo)
-- -----------------------------------------------------------------------------
INSERT INTO modulo (id, nombre, activo, orden) OVERRIDING SYSTEM VALUE VALUES
(1, 'Derechos y CUD', true, 1),
(2, 'Salud y Rehabilitación', true, 2),
(3, 'Educación e Inclusión', true, 3),
(4, 'Trabajo y Empleo', true, 4),
(5, 'Transporte y Movilidad', true, 5),
(6, 'Productos de Apoyo y Tecnología Asistiva', true, 6),
(7, 'Turismo, Cultura y Ocio Accesible', true, 7),
(8, 'Módulo Fuera de Servicio', false, 8); -- INACTIVO (Prueba de filtrado)

-- -----------------------------------------------------------------------------
-- 2. CATEGORÍAS (categoria)
-- -----------------------------------------------------------------------------
INSERT INTO categoria (id, id_modulo, nombre, descripcion, orden, activo) OVERRIDING SYSTEM VALUE VALUES
-- Módulo 1: Derechos y CUD
(101, 1, 'Certificado Único de Discapacidad (CUD)', 'Requisitos, turnos y documentación para la tramitación o renovación del CUD en juntas evaluadoras.', 1, true),
(102, 1, 'Pensiones No Contributivas', 'Asesoramiento sobre el trámite de pensión no contributiva por invalidez y asignaciones familiares.', 2, true),
(103, 1, 'Asesoría Legal Gratuita', 'Servicios públicos de orientación sobre legislación, amparos y defensa de derechos en salud.', 3, true),
(104, 1, 'Trámites Obsoletos y Archivados', 'Categoría de trámites descontinuados.', 4, false), -- INACTIVA

-- Módulo 2: Salud y Rehabilitación
(201, 2, 'Centros de Rehabilitación', 'Instituciones de rehabilitación física, ocupacional, del lenguaje y cognitiva.', 1, true),
(202, 2, 'Prestaciones de Obra Social y Prepaga', 'Cobertura obligatoria de prestaciones básicas según el marco regulatorio vigente.', 2, true),
(203, 2, 'Salud Mental y Acompañamiento Terapéutico', 'Dispositivos de apoyo psicosocial, acompañamiento terapéutico y centros de día.', 3, true),

-- Módulo 3: Educación e Inclusión
(301, 3, 'Escuelas Especiales e Inclusivas', 'Establecimientos educativos con equipos de apoyo a la inclusión escolar (DAI/PPI).', 1, true),
(302, 3, 'Becas y Apoyos Estudiantiles', 'Programas de ayuda financiera y subsidios de transporte para estudiantes con discapacidad.', 2, true),
(303, 3, 'Material Didáctico y Recursos Accesibles', 'Bibliotecas parlantes, textos en braille y recursos pedagógicos adaptados.', 3, true),

-- Módulo 4: Trabajo y Empleo
(401, 4, 'Cupo Laboral en el Sector Público', 'Normativa y registro de postulantes para el cumplimiento del cupo del 4% en el empleo estatal.', 1, true),
(402, 4, 'Talleres Protegidos y Capacitación Laboral', 'Espacios de formación profesional, oficios y producción en entornos adaptados.', 2, true),
(403, 4, 'Emprendimientos y Microcréditos Inclusivos', 'Líneas de financiamiento y asesoría técnica para proyectos productivos independientes.', 3, true),

-- Módulo 5: Transporte y Movilidad
(501, 5, 'Pase Libre de Transporte', 'Tramitación de pasajes gratuitos en líneas urbanas, interurbanas, trenes y colectivos de larga distancia.', 1, true),
(502, 5, 'Símbolo Internacional de Acceso Vehicular', 'Emisión del permiso oficial para libre tránsito y estacionamiento de vehículos particulares.', 2, true),
(503, 5, 'Traslados Especiales Adaptados', 'Servicios de transporte puerta a puerta para personas con movilidad reducida severa.', 3, true),

-- Módulo 6: Productos de Apoyo y Tecnología Asistiva
(601, 6, 'Banco de Ayudas Técnicas (Sillas y Ortesis)', 'Entrega en comodato y renovación de sillas de ruedas, andadores, bastones y prótesis.', 1, true),
(602, 6, 'Software Accesible y Lectores de Pantalla', 'Herramientas digitales gratuitas, sintetizadores de voz y comunicadores aumentativos.', 2, true),

-- Módulo 7: Turismo, Cultura y Ocio Accesible
(701, 7, 'Parques y Balnearios Accesibles', 'Espacios naturales con rampas, senderos podotáctiles y sillas anfibias disponibles.', 1, true),
(702, 7, 'Museos y Teatros con Visitas Adaptadas y LSA', 'Centros culturales con guías en Lengua de Señas Argentina (LSA), audiodescripción y réplicas táctiles.', 2, true),
(703, 7, 'Eventos y Festivales Suspendidos', 'Registro de eventos culturales dados de baja.', 3, false); -- INACTIVA

-- -----------------------------------------------------------------------------
-- 3. CONTENIDOS (contenido)
-- -----------------------------------------------------------------------------
INSERT INTO contenido (id, id_categoria, titulo, descripcion, direccion, telefono, email, enlace, horario, activo, fecha_creacion, fecha_modificacion) OVERRIDING SYSTEM VALUE VALUES

-- Contenidos Categoría 101 (CUD)
(1001, 101, 'Junta Evaluadora Central de Discapacidad', 
 'Sede central encargada de la evaluación interdisciplinaria, emisión y renovación del Certificado Único de Discapacidad (CUD). Ofrece atención presencial para consulta de turnos y retiro de documentación.', 
 'Av. Ramsay 2252, CABA', '0800-555-3472', 'consultas_cud@acceder-demo.gob.ar', 'https://www.argentina.gob.ar/andis/tramite-cud', 'Lunes a Viernes de 08:00 a 14:00 hs', true, '2026-01-15T10:00:00Z', '2026-02-10T14:30:00Z'),

(1002, 101, 'Consulta Digital de Requisitos para CUD', 
 'Guía informativa en línea con el listado completo de planillas de salud y estudios complementarios necesarios según el tipo de condición (motora, visual, auditiva, intelectual, psicosocial o visceral).', 
 NULL, NULL, 'info_requisitos@acceder-demo.gob.ar', 'https://www.argentina.gob.ar/obtener-certificado-unico-de-discapacidad-cud', NULL, true, '2026-01-20T11:00:00Z', '2026-02-15T09:15:00Z'),

(1003, 101, 'Sede Zonal de Trámite CUD (Inactiva)', 
 'Sede auxiliar temporalmente cerrada por refacciones edilicias.', 
 'Calle Ficticia 456, CABA', '011-4444-0000', 'sede_aux@acceder-demo.gob.ar', NULL, 'Lunes a Viernes de 09:00 a 13:00 hs', false, '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'), -- INACTIVO

-- Contenidos Categoría 102 (Pensiones)
(1004, 102, 'Oficina de Tramitación de Pensiones No Contributivas', 
 'Atención presencial y asesoramiento para la solicitud de la Pensión No Contributiva por Invalidez. Recepción de formularios médicos y socioeconómicos.', 
 'Calle 48 Nº 540, La Plata', '0800-222-3333', NULL, 'https://www.anses.gob.ar/pensiones', 'Lunes a Viernes de 08:30 a 13:30 hs', true, '2026-01-18T12:00:00Z', '2026-02-01T10:00:00Z'),

-- Contenidos Categoría 103 (Legal)
(1005, 103, 'Consultorio Jurídico Gratuito en Accesibilidad', 
 'Servicio público de orientación legal sobre cumplimiento de la Ley 24.901, barreras de accesibilidad y presentación de recursos de amparo.', 
 'Talcahuano 550, Piso 3, CABA', '011-4370-4600', 'defensoria_accesible@acceder-demo.gob.ar', NULL, 'Martes y Jueves de 10:00 a 15:00 hs', true, '2026-02-01T09:00:00Z', '2026-02-18T16:00:00Z'),

-- Contenidos Categoría 201 (Centros de Rehabilitación)
(2001, 201, 'Instituto Nacional de Rehabilitación Psicofísica', 
 'Centro de alta complejidad especializado en rehabilitación motora, terapia ocupacional, kinesiología y neurorehabilitación.', 
 'Echeverría 955, CABA', '011-4783-8080', 'contacto_rehab@acceder-demo.gob.ar', 'https://www.inareps.gob.ar', 'Lunes a Viernes de 07:00 a 18:00 hs', true, '2026-01-10T08:00:00Z', '2026-02-05T11:20:00Z'),

(2002, 201, 'Centro de Estimulación Temprana y Desarrollo Infantil', 
 'Espacio de abordaje interdisciplinario para recién nacidos, niñas y niños hasta los 6 años con desafíos en el neurodesarrollo.', 
 'Av. San Martín 1250, Quilmes', '011-4253-1122', 'estimulacion@acceder-demo.gob.ar', NULL, 'Lunes a Viernes de 08:00 a 16:00 hs', true, '2026-01-12T09:00:00Z', '2026-02-08T12:00:00Z'),

-- Contenidos Categoría 202 (Prestaciones)
(2003, 202, 'Ventanilla Única de Reclamos por Prestaciones Básicas', 
 'Canal para asentar denuncias y reclamos por demoras o negativas de cobertura de tratamientos y traslados ante obras sociales nacionales y entidades de medicina prepaga.', 
 NULL, '0800-999-7258', 'reclamos_salud@acceder-demo.gob.ar', 'https://www.sssalud.gob.ar', 'Lunes a Viernes de 08:00 a 17:00 hs', true, '2026-01-25T10:30:00Z', '2026-02-14T14:00:00Z'),

-- Contenidos Categoría 203 (Salud Mental)
(2004, 203, 'Red de Dispositivos de Salud Mental y Centros de Día', 
 'Centros asistenciales diurnos enfocados en la autonomía personal, socialización y talleres recreativos para personas con discapacidad psicosocial o intelectual.', 
 'Av. Córdoba 3400, CABA', '011-4862-5500', NULL, NULL, 'Lunes a Viernes de 09:00 a 17:00 hs', true, '2026-01-28T11:00:00Z', '2026-02-16T15:00:00Z'),

-- Contenidos Categoría 301 (Escuelas)
(3001, 301, 'Centro de Apoyo a la Inclusión Educativa (CAIE)', 
 'Equipo interdisciplinario que articula con escuelas comunes de todos los niveles para la elaboración de Proyectos Pedagógicos Individuales (PPI).', 
 NULL, '011-4340-9900', 'educacion_inclusiva@acceder-demo.gob.ar', NULL, 'Lunes a Viernes de 08:00 a 17:00 hs', true, '2026-01-22T14:00:00Z', '2026-02-12T10:00:00Z'),

(3002, 301, 'Escuela de Educación Especial Nº 1 (Discapacidad Auditiva)', 
 'Institución educativa pública con enseñanza bilingüe (Lengua de Señas Argentina y Español escrito).', 
 'Calle 14 Nº 890, La Plata', '0221-483-2211', 'especial1@acceder-demo.gob.ar', NULL, 'Lunes a Viernes de 08:00 a 16:30 hs', true, '2026-01-26T08:00:00Z', '2026-02-10T11:00:00Z'),

-- Contenidos Categoría 302 (Becas)
(3003, 302, 'Programa de Becas para Estudiantes con CUD', 
 'Apoyo económico para estudiantes de nivel primario, secundario, terciario y universitario destinado a gastos de traslado, fotocopias y tecnología adaptada.', 
 NULL, NULL, 'becas_estudiantiles@acceder-demo.gob.ar', 'https://www.argentina.gob.ar/educacion/becas', NULL, true, '2026-01-30T10:00:00Z', '2026-02-18T10:00:00Z'),

-- Contenidos Categoría 303 (Material Didáctico)
(3004, 303, 'Biblioteca Central de Textos Accesibles y Braille', 
 'Servicio de digitalización y préstamo gratuito de audiolibros, textos escolares en braille y libros en formato de lectura fácil.', 
 'Hipólito Yrigoyen 1750, CABA', '011-4381-6789', 'biblioteca_accesible@acceder-demo.gob.ar', 'https://www.bcn.gob.ar/braille', 'Lunes a Viernes de 09:00 a 18:00 hs', true, '2026-02-02T13:00:00Z', '2026-02-19T14:00:00Z'),

-- Contenidos Categoría 401 (Cupo Laboral)
(4001, 401, 'Registro Único de Postulantes para el Sector Público', 
 'Inscripción obligatoria de aspirantes con CUD para participar en concursos y búsquedas laborales del Estado Nacional y organismos descentralizados.', 
 NULL, NULL, 'empleo_publico@acceder-demo.gob.ar', 'https://concursar.gob.ar/cupo-discapacidad', NULL, true, '2026-01-14T09:00:00Z', '2026-02-04T12:00:00Z'),

-- Contenidos Categoría 402 (Talleres Protegidos)
(4002, 402, 'Taller Protegido de Producción "Integrar"', 
 'Centro de capacitación técnica y producción artesanal con empleo remunerado y adaptaciones ergonómicas.', 
 'Av. Belgrano 2340, Avellaneda', '011-4201-9876', 'taller_integrar@acceder-demo.gob.ar', NULL, 'Lunes a Viernes de 08:30 a 15:30 hs', true, '2026-01-19T08:30:00Z', '2026-02-11T16:00:00Z'),

-- Contenidos Categoría 403 (Emprendimientos)
(4003, 403, 'Línea de Financiamiento y Tutoría para Emprendedores', 
 'Subsidios no reembolsables y mentoría personalizada para la compra de herramientas e insumos productivos.', 
 NULL, '0800-444-8722', 'emprender_inclusivo@acceder-demo.gob.ar', 'https://www.argentina.gob.ar/produccion/emprendimientos', 'Lunes a Viernes de 10:00 a 16:00 hs', true, '2026-02-03T10:00:00Z', '2026-02-20T11:00:00Z'),

-- Contenidos Categoría 501 (Pase Libre)
(5001, 501, 'Sistema Digital de Reserva de Pasajes en Larga Distancia', 
 'Plataforma oficial para la emisión directa de pasajes gratuitos de colectivo de media y larga distancia para la persona titular del CUD y su acompañante.', 
 NULL, NULL, NULL, 'https://reservas.cnrt.gob.ar', 'Atención digital 24 horas', true, '2026-01-05T10:00:00Z', '2026-02-14T18:00:00Z'),

(5002, 501, 'Oficina de Emisión del Pase Libre de Transporte Urbano', 
 'Punto de atención para la validación de la tarjeta SUBE con atributo de gratuidad para colectivos urbanos, subtes y trenes metropolitanos.', 
 'Av. Antártida Argentina 1100, Retiro, CABA', '0800-333-0300', NULL, NULL, 'Lunes a Viernes de 07:30 a 14:30 hs', true, '2026-01-08T09:00:00Z', '2026-02-06T13:00:00Z'),

-- Contenidos Categoría 502 (Símbolo Vehicular)
(5003, 502, 'Trámite Digital del Símbolo Internacional de Acceso', 
 'Gestión electrónica del código QR que habilita el estacionamiento preferencial en espacios reservados en todo el territorio nacional.', 
 NULL, NULL, 'simbolo_acceso@acceder-demo.gob.ar', 'https://mi.argentina.gob.ar/tramites/simbolo-internacional-acceso', NULL, true, '2026-01-16T11:00:00Z', '2026-02-12T15:00:00Z'),

-- Contenidos Categoría 503 (Traslados Especiales)
(5004, 503, 'Servicio Municipal de Traslados Adaptados', 
 'Vehículos adaptados con rampa hidráulica para traslados hacia centros de rehabilitación y tratamientos médicos programados.', 
 'Calle 12 Nº 450, Berazategui', '011-4356-9200', 'traslados_salud@acceder-demo.gob.ar', NULL, 'Lunes a Viernes de 06:30 a 19:00 hs', true, '2026-01-21T07:00:00Z', '2026-02-15T12:00:00Z'),

-- Contenidos Categoría 601 (Banco de Ayudas Técnicas)
(6001, 601, 'Banco Nacional de Ayudas Técnicas y Elementos Ortopédicos', 
 'Programa de entrega gratuita en comodato de sillas de ruedas estándar y posturales, bipedestadores, camas ortopédicas y colchones antiescaras.', 
 'Av. Dragones 2201, CABA', '011-4576-0000', 'ayudastecnicas@acceder-demo.gob.ar', 'https://www.argentina.gob.ar/andis/ayudas-tecnicas', 'Lunes a Viernes de 08:30 a 14:00 hs', true, '2026-01-29T10:00:00Z', '2026-02-17T11:30:00Z'),

-- Contenidos Categoría 602 (Software Accesible)
(6002, 602, 'Repositorio de Software Libre y Herramientas Accesibles', 
 'Descarga de lectores de pantalla (NVDA), magnificadores visuales, tableros de comunicación por pictogramas y sintetizadores de voz para PC y dispositivos móviles.', 
 NULL, NULL, 'tecnologia_inclusiva@acceder-demo.gob.ar', 'https://nvda.es/descargas', NULL, true, '2026-02-04T12:00:00Z', '2026-02-21T14:00:00Z'),

-- Contenidos Categoría 701 (Parques y Balnearios)
(7001, 701, 'Reserva Natural y Sendero Adaptado "El Palmar"', 
 'Sendero entablonado de baja dificultad con pasarelas para sillas de ruedas, cartelería en braille y audioguías para personas ciegas.', 
 'Ruta Nacional 14 Km 198, Entre Ríos', '03447-493053', 'turismo_accesible@acceder-demo.gob.ar', 'https://www.argentina.gob.ar/parquesnacionales/elpalmar', 'Todos los días de 08:00 a 19:00 hs', true, '2026-01-11T09:00:00Z', '2026-02-07T16:00:00Z'),

(7002, 701, 'Balneario Municipal con Servicio de Sillas Anfibias', 
 'Playa pública equipada con pasarelas hasta el mar, carpas adaptadas, baños accesibles y asistencia de guardavidas capacitados para el uso de sillas anfibias.', 
 'Costanera y Calle 30, Mar del Plata', '0223-499-6600', NULL, NULL, 'Temporada estival de 09:00 a 19:00 hs', true, '2026-01-13T09:00:00Z', '2026-02-09T18:00:00Z'),

-- Contenidos Categoría 702 (Museos y Teatros)
(7003, 702, 'Museo Nacional de Bellas Artes — Visitas Accesibles', 
 'Visitas guiadas táctiles para personas ciegas con maquetas a escala y réplicas en relieve, y recorridos con interpretación simultánea en Lengua de Señas Argentina (LSA).', 
 'Av. del Libertador 1473, CABA', '011-5288-9900', 'educacion@bellasartes.gob.ar', 'https://www.bellasartes.gob.ar/accesibilidad', 'Martes a Domingo de 11:00 a 19:00 hs', true, '2026-01-17T11:00:00Z', '2026-02-13T17:00:00Z'),

(7004, 702, 'Servicio de Visitas Teatrales Suspendido (Inactivo)', 
 'Servicio temporalmente inactivo por obras en la sala principal.', 
 'Calle Corrientes 1500, CABA', NULL, NULL, NULL, NULL, false, '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'); -- INACTIVO
