"use server";

import { makeFileService } from "../services/makeFileService";
import prisma from "@/core/lib/prisma";
import { FileEntity } from "../entities/FileEntity.entity";

export type UploadCvFileResult =
  | { success: true; file: FileEntity }
  | { success: false; error: string };

/**
 * Server action para subir un archivo CV
 * @param formData - FormData que contiene el archivo con la clave 'file'
 * @returns Promise con el resultado de la subida
 */
export async function uploadCvFile(
  formData: FormData
): Promise<UploadCvFileResult> {
  try {
    const file = formData.get("file") as File | null;

    if (!file) {
      return {
        success: false,
        error: "No se proporcionó ningún archivo",
      };
    }

    // Validar que sea un archivo válido
    if (!(file instanceof File)) {
      return {
        success: false,
        error: "El archivo proporcionado no es válido",
      };
    }

    // Crear instancia del servicio de archivos
    const fileService = makeFileService({ prisma });

    // Subir el archivo
    const result = await fileService.uploadFile(file);

    if (!result.ok) {
      return {
        success: false,
        error: result.error.message || "Error al subir el archivo",
      };
    }

    return {
      success: true,
      file: result.value,
    };
  } catch (error) {
    console.error("Error al subir CV:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al subir el archivo",
    };
  }
}

