-- CreateEnum
CREATE TYPE "InglesLevel" AS ENUM ('Avanzado', 'Intermedio', 'No');

-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "municipioAlcaldia" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "ultimoSector" TEXT NOT NULL,
    "ultimoPuesto" TEXT NOT NULL,
    "puestoInteres" TEXT NOT NULL,
    "salarioDeseado" INTEGER NOT NULL,
    "titulado" BOOLEAN NOT NULL DEFAULT false,
    "ingles" "InglesLevel" NOT NULL DEFAULT 'No',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_correo_key" ON "Candidate"("correo");
