import { Categoria } from "@/lib/types";

/**
 * Datos Mock de Categorías
 * Coinciden con los campos de la tabla PostgreSQL 'categoria':
 * - id (number)
 * - id_modulo (number - FK)
 * - nombre (string)
 * - descripcion (string)
 * - orden (number)
 * - activo (boolean)
 */
export const MOCK_CATEGORIAS: Categoria[] = [
  // Categorías del Módulo 1: Derechos y CUD
  {
    id: 101,
    id_modulo: 1,
    nombre: "Certificado Único de Discapacidad (CUD)",
    descripcion: "Requisitos, turnos y documentación para la tramitación o renovación del CUD.",
    orden: 1,
    activo: true,
  },
  {
    id: 102,
    id_modulo: 1,
    nombre: "Pensiones No Contributivas",
    descripcion: "Asesoramiento sobre el trámite de pensión por invalidez o invalidez laboral.",
    orden: 2,
    activo: true,
  },
  {
    id: 103,
    id_modulo: 1,
    nombre: "Asesoría Legal Gratuita",
    descripcion: "Servicios de orientación sobre legislación y amparos de salud.",
    orden: 3,
    activo: true,
  },
  {
    id: 104,
    id_modulo: 1,
    nombre: "Categoría Inactiva Derechos",
    descripcion: "Categoría fuera de servicio temporalmente.",
    orden: 4,
    activo: false, // Inactivo: NO debe mostrarse
  },

  // Categorías del Módulo 2: Salud y Rehabilitación
  {
    id: 201,
    id_modulo: 2,
    nombre: "Centros de Rehabilitación",
    descripcion: "Instituciones de rehabilitación física, ocupacional y cognitiva.",
    orden: 1,
    activo: true,
  },
  {
    id: 202,
    id_modulo: 2,
    nombre: "Prestaciones de Obra Social y Prepaga",
    descripcion: "Cobertura obligatoria de prestaciones básicas según la Ley 24.901.",
    orden: 2,
    activo: true,
  },

  // Categorías del Módulo 3: Educación e Inclusión
  {
    id: 301,
    id_modulo: 3,
    nombre: "Escuelas Especiales e Inclusivas",
    descripcion: "Listado de establecimientos con equipos de apoyo a la inclusión educativa.",
    orden: 1,
    activo: true,
  },
  {
    id: 302,
    id_modulo: 3,
    nombre: "Becas y Apoyos Estudiantiles",
    descripcion: "Programas de apoyo financiero para estudiantes con discapacidad.",
    orden: 2,
    activo: true,
  },

  // Categorías del Módulo 4: Trabajo y Empleo
  {
    id: 401,
    id_modulo: 4,
    nombre: "Cupo Laboral en el Sector Público",
    descripcion: "Información sobre el cumplimiento del cupo del 4% en el empleo público.",
    orden: 1,
    activo: true,
  },
  {
    id: 402,
    id_modulo: 4,
    nombre: "Talleres Protegidos y Capacitación",
    descripcion: "Espacios de formación laboral y empleabilidad adaptada.",
    orden: 2,
    activo: true,
  },

  // Categorías del Módulo 5: Transporte y Movilidad
  {
    id: 501,
    id_modulo: 5,
    nombre: "Pase Libre de Transporte",
    descripcion: "Tramitación de pasajes gratuitos en colectivos, trenes y micros de larga distancia.",
    orden: 1,
    activo: true,
  },
  {
    id: 502,
    id_modulo: 5,
    nombre: "Símbolo Internacional de Acceso (Vehicular)",
    descripcion: "Permisos de libre tránsito y libre estacionamiento vehicular.",
    orden: 2,
    activo: true,
  },
];
