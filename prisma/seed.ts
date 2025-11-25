import "dotenv/config";
import { PrismaClient } from "../src/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/core/lib/password";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Iniciando seed de base de datos...");

  // Crear usuario de prueba
  const testEmail = "admin@test.com";
  const testPassword = "admin123";

  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email: testEmail },
  });

  if (existingUser) {
    console.log("✅ Usuario de prueba ya existe, actualizando contraseña...");
    const hashedPassword = await hashPassword(testPassword);
    await prisma.user.update({
      where: { email: testEmail },
      data: { password: hashedPassword },
    });
    console.log("✅ Contraseña actualizada correctamente");
  } else {
    console.log("📝 Creando usuario de prueba...");
    const hashedPassword = await hashPassword(testPassword);
    await prisma.user.create({
      data: {
        email: testEmail,
        name: "Usuario Administrador",
        password: hashedPassword,
      },
    });
    console.log("✅ Usuario de prueba creado correctamente");
  }

  console.log("\n📋 Credenciales de prueba:");
  console.log(`   Email: ${testEmail}`);
  console.log(`   Password: ${testPassword}`);
  console.log("\n✨ Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
