import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Genera un hash seguro para la contraseña provista utilizando bcryptjs.
 * Nunca almacena ni registra contraseñas en texto plano.
 */
export async function hashPassword(plainTextPassword: string): Promise<string> {
  return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
}

/**
 * Compara una contraseña en texto plano contra un hash de bcrypt.
 */
export async function verifyPassword(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}
