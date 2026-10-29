const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\-./\s]{3,50}$/;

export const CONTENT_LIMITS = {
  titulo: 200,
  descripcion: 20_000,
  direccion: 255,
  telefono: 50,
  email: 255,
  enlace: 500,
  horario: 255,
} as const;

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;

export function isValidEmail(value: string): boolean {
  return value.length <= CONTENT_LIMITS.email && EMAIL_PATTERN.test(value);
}

export function isValidPassword(value: string): boolean {
  return value.length >= PASSWORD_MIN_LENGTH && value.length <= PASSWORD_MAX_LENGTH;
}

export function normalizePhone(value: string): string | null {
  const normalized = value.trim();
  if (!normalized || normalized.length > CONTENT_LIMITS.telefono || !PHONE_PATTERN.test(normalized)) {
    return null;
  }
  return normalized;
}

export function isValidExternalUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export function validateContentFields(data: {
  titulo: string;
  descripcion: string;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  enlace: string | null;
  horario: string | null;
}): string | undefined {
  if (data.titulo.length > CONTENT_LIMITS.titulo || data.descripcion.length > CONTENT_LIMITS.descripcion) {
    return "El título o la descripción exceden la longitud permitida.";
  }

  if (data.direccion && data.direccion.length > CONTENT_LIMITS.direccion) {
    return "La dirección excede la longitud permitida.";
  }
  if (data.telefono && !normalizePhone(data.telefono)) {
    return "El teléfono contiene caracteres o una longitud no válidos.";
  }
  if (data.email && !isValidEmail(data.email)) {
    return "El correo electrónico no es válido.";
  }
  if (data.enlace && (data.enlace.length > CONTENT_LIMITS.enlace || !isValidExternalUrl(data.enlace))) {
    return "El enlace debe ser una URL absoluta que use http:// o https://.";
  }
  if (data.horario && data.horario.length > CONTENT_LIMITS.horario) {
    return "El horario excede la longitud permitida.";
  }

  return undefined;
}
