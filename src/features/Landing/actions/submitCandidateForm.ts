"use server";

import { Prisma } from "@/app/generated/prisma/client";
import { ZodError } from "zod";
import prisma from "@/core/lib/prisma";
import {
  candidateFormCompleteSchema,
  type CandidateFormData,
} from "../schemas/candidateFormSchema";

/**
 * Tipos de error que pueden ocurrir al enviar el formulario
 */
export type SubmitCandidateFormResult =
  | { success: true; message: string; candidateId: number }
  | { success: false; error: string; field?: string };

/**
 * Server action para enviar el formulario de candidatos
 * Esta función valida los datos y los guarda en la base de datos.
 *
 * @param data - Datos del formulario validados con Zod
 * @returns Promise con el resultado del envío
 */
export async function submitCandidateForm(
  data: CandidateFormData
): Promise<SubmitCandidateFormResult> {
  try {
    // Validar los datos con el schema completo
    const validatedData = candidateFormCompleteSchema.parse(data);

    // Convertir los datos del formulario al formato del modelo Prisma
    // - Convertir "Sí"/"No" a boolean
    // - El campo ingles ya es compatible con el enum InglesLevel
    const candidateData = {
      nombre: validatedData.nombre.trim(),
      municipioAlcaldia: validatedData.municipioAlcaldia.trim(),
      ciudad: validatedData.ciudad.trim(),
      telefono: validatedData.telefono.trim(),
      correo: validatedData.correo.trim().toLowerCase(),
      ultimoSector: validatedData.ultimoSector.trim(),
      ultimoPuesto: validatedData.ultimoPuesto.trim(),
      puestoInteres: validatedData.puestoInteres.trim(),
      salarioDeseado: validatedData.salarioDeseado,
      titulado: validatedData.titulado === "Sí",
      ingles: validatedData.ingles,
    };

    // Crear el candidato en la base de datos
    const candidate = await prisma.candidate.create({
      data: candidateData,
    });

    return {
      success: true,
      message: "¡Gracias por dejar tus datos! Estaremos trabajando para encontrar la mejor posición que se ajuste a tu perfil.",
      candidateId: candidate.id,
    };
  } catch (error) {
    // Manejar errores de validación de Zod
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        error: firstError?.message || "Por favor verifica que todos los campos estén completos y sean válidos.",
        field: firstError?.path[0] as string | undefined,
      };
    }

    // Manejar errores de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Error de duplicado (correo ya existe)
      if (error.code === "P2002") {
        const target = error.meta?.target as string[] | undefined;
        if (target?.includes("correo")) {
          return {
            success: false,
            error: "Este correo electrónico ya está registrado. Por favor usa otro correo o contacta con soporte.",
            field: "correo",
          };
        }
        return {
          success: false,
          error: "Ya existe un registro con estos datos. Por favor verifica la información.",
        };
      }

      // Otros errores de Prisma
      return {
        success: false,
        error: "Hubo un error al guardar tu información. Por favor intenta de nuevo más tarde.",
      };
    }

    // Manejar errores de Prisma desconocidos
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return {
        success: false,
        error: "Hubo un error inesperado al procesar tu solicitud. Por favor intenta de nuevo.",
      };
    }

    // Manejar errores de validación de Prisma
    if (error instanceof Prisma.PrismaClientValidationError) {
      return {
        success: false,
        error: "Los datos proporcionados no son válidos. Por favor verifica la información ingresada.",
      };
    }

    // Errores genéricos
    console.error("Error al enviar formulario de candidato:", error);
    return {
      success: false,
      error: "Ocurrió un error inesperado. Por favor intenta de nuevo o contacta con soporte si el problema persiste.",
    };
  }
}
