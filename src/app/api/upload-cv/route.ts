import { NextRequest, NextResponse } from "next/server";
import { makeFileService } from "@/features/Files/server/services/makeFileService";
import prisma from "@/core/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// En App Router, las rutas API no tienen límite de tamaño por defecto
// El límite se controla a través de next.config.ts con proxyClientMaxBodySize
export async function POST(request: NextRequest) {
  try {
    // Log para debugging
    const contentType = request.headers.get("content-type");
    const contentLength = request.headers.get("content-length");
    console.log("Upload CV - Content-Type:", contentType);
    console.log("Upload CV - Content-Length:", contentLength);

    // Intentar parsear FormData
    // IMPORTANTE: No leer el body antes de esto, el middleware no debe leerlo
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (formDataError) {
      console.error("Error detallado al parsear FormData:", {
        error: formDataError,
        message: formDataError instanceof Error ? formDataError.message : "Unknown",
        contentType,
        contentLength,
      });

      const errorMessage =
        formDataError instanceof Error
          ? formDataError.message
          : "Error desconocido al procesar el archivo";

      // Si el error menciona boundary, es un problema de formato del FormData
      if (errorMessage.includes("boundary") || errorMessage.includes("Internal")) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Error al procesar el archivo. El formato del archivo puede estar corrupto. Por favor intenta subir el archivo nuevamente.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Error al procesar el archivo. Asegúrate de que el archivo no esté corrupto.",
        },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Validar que sea un archivo válido
    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "El archivo proporcionado no es válido" },
        { status: 400 }
      );
    }

    // Crear instancia del servicio de archivos
    const fileService = makeFileService({ prisma });

    // Subir el archivo
    const result = await fileService.uploadFile(file);

    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.message || "Error al subir el archivo",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      file: result.value,
    });
  } catch (error) {
    console.error("Error al subir CV:", error);
    
    // Asegurar que siempre devolvemos JSON, nunca HTML
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Ocurrió un error inesperado al subir el archivo";
    
    // Si el error menciona boundary o FormData, es un problema de formato
    if (errorMessage.includes("boundary") || errorMessage.includes("FormData")) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Error al procesar el archivo. Por favor verifica que el archivo no esté corrupto e intenta nuevamente.",
        },
        { 
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
