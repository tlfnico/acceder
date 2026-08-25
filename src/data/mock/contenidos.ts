import { Contenido } from "@/lib/types";

/**
 * Datos Mock de Contenidos
 * Coinciden exactamente con la tabla PostgreSQL 'contenido':
 * - id (number)
 * - id_categoria (number - FK)
 * - titulo (string)
 * - descripcion (string)
 * - direccion (string | null) - OPCIONAL
 * - telefono (string | null) - OPCIONAL
 * - email (string | null) - OPCIONAL
 * - enlace (string | null) - OPCIONAL
 * - horario (string | null) - OPCIONAL
 * - activo (boolean)
 * - fecha_creacion (string)
 * - fecha_modificacion (string)
 */
export const MOCK_CONTENIDOS: Contenido[] = [
  // Contenidos para Categoría 101: CUD
  {
    id: 1001,
    id_categoria: 101,
    titulo: "Junta Evaluadora Central de Discapacidad",
    descripcion: "Sede central para la evaluación, emisión y renovación del Certificado Único de Discapacidad (CUD). Ofrece atención presencial para consulta de expediente y retiro de documentación.",
    direccion: "Av. Ramsay 2252, CABA",
    telefono: "0800-555-3472",
    email: "consultas_cud@acceder.gob.ar",
    enlace: "https://www.argentina.gob.ar/andis/tramite-cud",
    horario: "Lunes a Viernes de 08:00 a 14:00 hs",
    activo: true,
    fecha_creacion: "2026-01-15T10:00:00Z",
    fecha_modificacion: "2026-02-10T14:30:00Z",
  },
  {
    id: 1002,
    id_categoria: 101,
    titulo: "Consulta Digital de Requisitos para CUD",
    descripcion: "Guía informativa en línea con el listado completo de planillas y evaluaciones médicas requeridas según el tipo de condición (motora, visual, auditiva, intelectual o visceral).",
    direccion: null, // Sin dirección (recurso digital)
    telefono: null, // Sin teléfono
    email: "info_requisitos@acceder.gob.ar",
    enlace: "https://www.argentina.gob.ar/obtener-certificado-unico-de-discapacidad-cud",
    horario: null, // Sin horario
    activo: true,
    fecha_creacion: "2026-01-20T11:00:00Z",
    fecha_modificacion: "2026-02-15T09:15:00Z",
  },
  {
    id: 1003,
    id_categoria: 101,
    titulo: "Contenido Inactivo CUD",
    descripcion: "Este contenido está deshabilitado y no debe aparecer en el portal público.",
    direccion: "Calle Falsa 123",
    telefono: "11-0000-0000",
    email: null,
    enlace: null,
    horario: null,
    activo: false, // INACTIVO
    fecha_creacion: "2026-01-01T00:00:00Z",
    fecha_modificacion: "2026-01-01T00:00:00Z",
  },

  // Contenidos para Categoría 102: Pensiones
  {
    id: 1004,
    id_categoria: 102,
    titulo: "Oficina de Tramitación de Pensiones No Contributivas",
    descripcion: "Asesoramiento presencial y recepción de documentación para la solicitud de la Pensión No Contributiva por Invalidez.",
    direccion: "Calle 48 Nº 540, La Plata",
    telefono: "0800-222-3333",
    email: null, // Sin email
    enlace: "https://www.anses.gob.ar/pensiones",
    horario: "Lunes a Viernes de 08:30 a 13:30 hs",
    activo: true,
    fecha_creacion: "2026-01-18T12:00:00Z",
    fecha_modificacion: "2026-02-01T10:00:00Z",
  },

  // Contenidos para Categoría 103: Asesoría Legal
  {
    id: 1005,
    id_categoria: 103,
    titulo: "Consultorio Jurídico Gratuito en Accesibilidad",
    descripcion: "Servicio de defensa de derechos de personas con discapacidad frente a incumplimientos de obras sociales o barreras físicas y urbanísticas.",
    direccion: "Talcahuano 550, Piso 3, CABA",
    telefono: "011-4370-4600",
    email: "defensoria_accesible@acceder.gob.ar",
    enlace: null, // Sin enlace web
    horario: "Martes y Jueves de 10:00 a 15:00 hs",
    activo: true,
    fecha_creacion: "2026-02-01T09:00:00Z",
    fecha_modificacion: "2026-02-18T16:00:00Z",
  },

  // Contenidos para Categoría 201: Centros de Rehabilitación
  {
    id: 2001,
    id_categoria: 201,
    titulo: "Instituto Nacional de Rehabilitación Psicofísica",
    descripcion: "Centro público especializado en rehabilitación motora, terapia ocupacional y kinesiología intensiva.",
    direccion: "Echeverría 955, CABA",
    telefono: "011-4783-8080",
    email: "contacto_rehab@acceder.gob.ar",
    enlace: "https://www.inareps.gob.ar",
    horario: "Lunes a Viernes de 07:00 a 18:00 hs",
    activo: true,
    fecha_creacion: "2026-01-10T08:00:00Z",
    fecha_modificacion: "2026-02-05T11:20:00Z",
  },

  // Contenidos para Categoría 301: Escuelas Especiales
  {
    id: 3001,
    id_categoria: 301,
    titulo: "Centro de Apoyo a la Inclusión Educativa (CAIE)",
    descripcion: "Equipo interdisciplinario que articula con escuelas comunes para la elaboración de Proyectos Individuales de Inclusión (PPI).",
    direccion: null,
    telefono: "011-4340-9900",
    email: "educacion_inclusiva@acceder.gob.ar",
    enlace: null,
    horario: "Lunes a Viernes de 08:00 a 17:00 hs",
    activo: true,
    fecha_creacion: "2026-01-22T14:00:00Z",
    fecha_modificacion: "2026-02-12T10:00:00Z",
  },

  // Contenidos para Categoría 501: Pase Libre Transporte
  {
    id: 5001,
    id_categoria: 501,
    titulo: "Sistema de Reserva de Pasajes en Larga Distancia",
    descripcion: "Plataforma en línea para reservar pasajes gratuitos de colectivo de larga distancia para personas con CUD y su acompañante si corresponde.",
    direccion: null,
    telefono: null,
    email: null,
    enlace: "https://reservas.cnrt.gob.ar",
    horario: "Atención digital las 24 horas",
    activo: true,
    fecha_creacion: "2026-01-05T10:00:00Z",
    fecha_modificacion: "2026-02-14T18:00:00Z",
  },
];
