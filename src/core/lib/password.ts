import bcrypt from "bcryptjs";

/**
 * Genera un hash de la contraseña usando bcrypt
 * @param password - Contraseña en texto plano
 * @returns Promise con el hash de la contraseña
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verifica si una contraseña coincide con su hash
 * @param password - Contraseña en texto plano
 * @param hashedPassword - Hash de la contraseña almacenado
 * @returns Promise con true si coinciden, false en caso contrario
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

