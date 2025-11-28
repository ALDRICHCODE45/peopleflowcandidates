import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

interface UseCvUploadReturn {
  uploadedFileId: string | undefined;
  isUploading: boolean;
  uploadError: string | null;
  handleFilesChange: (files: File[]) => void;
  reset: () => void;
}

/**
 * Hook personalizado para manejar la subida de CV
 * Separa completamente la lógica de subida del componente del formulario
 */
export function useCvUpload(
  onUploadSuccess?: (fileId: string) => void
): UseCvUploadReturn {
  const [uploadedFileId, setUploadedFileId] = useState<string | undefined>(
    undefined
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);

  // Ref para rastrear archivos anteriores sin causar re-renders
  const previousFilesRef = useRef<File[]>([]);
  const isUploadingRef = useRef<boolean>(false);

  /**
   * Compara dos archivos para determinar si son el mismo
   * Usa nombre, tamaño y última modificación como identificadores únicos
   */
  const isSameFile = useCallback((file1: File, file2: File): boolean => {
    return (
      file1.name === file2.name &&
      file1.size === file2.size &&
      file1.lastModified === file2.lastModified
    );
  }, []);

  /**
   * Encuentra el archivo nuevo comparando arrays de archivos
   */
  const findNewFile = useCallback(
    (oldFiles: File[], newFiles: File[]): File | null => {
      if (newFiles.length === 0) return null;
      if (oldFiles.length === 0) return newFiles[0];

      // Buscar si hay un archivo que no esté en la lista anterior
      for (const newFile of newFiles) {
        const exists = oldFiles.some((oldFile) => isSameFile(oldFile, newFile));
        if (!exists) {
          return newFile;
        }
      }

      return null;
    },
    [isSameFile]
  );

  /**
   * Sube un archivo al servidor
   */
  const uploadFile = useCallback(
    async (file: File) => {
      // Prevenir múltiples subidas simultáneas
      if (isUploadingRef.current) {
        console.warn("Ya hay una subida en curso, ignorando nueva solicitud");
        return;
      }

      isUploadingRef.current = true;
      setIsUploading(true);
      setUploadError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Usar ruta API en lugar de Server Action para mejor compatibilidad en producción
        // NO establecer Content-Type manualmente - el navegador lo hace automáticamente con el boundary correcto
        const response = await fetch("/api/upload-cv", {
          method: "POST",
          body: formData,
          // No establecer headers - fetch automáticamente establece Content-Type con boundary
        });

        // Verificar si el estado cambió durante la subida (archivo eliminado)
        if (!isUploadingRef.current) {
          return;
        }

        // Verificar si la respuesta es JSON válido
        let result;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            result = await response.json();
          } else {
            // Si no es JSON, leer como texto para ver el error
            const text = await response.text();
            console.error("Respuesta no JSON del servidor:", {
              status: response.status,
              statusText: response.statusText,
              contentType,
              text: text.substring(0, 200), // Primeros 200 caracteres
            });

            // Si la respuesta contiene HTML (página de error), es un problema del servidor
            if (text.includes("<!DOCTYPE") || text.includes("<html")) {
              throw new Error(
                "El servidor devolvió una página de error. Por favor intenta nuevamente."
              );
            }

            throw new Error(text || "Error desconocido al subir el archivo");
          }
        } catch (parseError) {
          // Si hay error al parsear JSON, puede ser que el servidor devolvió HTML
          if (parseError instanceof SyntaxError) {
            console.error("Error al parsear respuesta JSON:", parseError);
            throw new Error(
              "Error de comunicación con el servidor. Por favor intenta nuevamente."
            );
          }
          throw parseError;
        }

        if (!response.ok || !result.success) {
          const errorMessage = result.error || "Error al subir el CV";
          setUploadError(errorMessage);
          toast.error(errorMessage);
          setUploadedFileId(undefined);
          return;
        }

        setUploadedFileId(result.file.id);
        setUploadError(null);
        toast.success("CV subido exitosamente");
        onUploadSuccess?.(result.file.id);
      } catch (error) {
        console.error("Error al subir CV:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado al subir el CV";
        setUploadError(errorMessage);
        toast.error(errorMessage);
        setUploadedFileId(undefined);
      } finally {
        isUploadingRef.current = false;
        setIsUploading(false);
      }
    },
    [onUploadSuccess]
  );

  /**
   * Maneja cambios en la lista de archivos
   */
  const handleFilesChange = useCallback(
    (files: File[]) => {
      setCurrentFiles(files);

      // Si se eliminaron todos los archivos, limpiar estado
      if (files.length === 0) {
        // Marcar que la subida ya no está en curso
        isUploadingRef.current = false;
        setUploadedFileId(undefined);
        setUploadError(null);
        setIsUploading(false);
        previousFilesRef.current = [];
        return;
      }

      // Encontrar archivo nuevo
      const newFile = findNewFile(previousFilesRef.current, files);

      if (newFile) {
        // Hay un archivo nuevo, iniciar subida
        uploadFile(newFile);
      }

      // Actualizar referencia de archivos anteriores
      previousFilesRef.current = [...files];
    },
    [findNewFile, uploadFile]
  );

  /**
   * Resetea el estado del hook
   */
  const reset = useCallback(() => {
    isUploadingRef.current = false;
    setUploadedFileId(undefined);
    setUploadError(null);
    setIsUploading(false);
    setCurrentFiles([]);
    previousFilesRef.current = [];
  }, []);

  return {
    uploadedFileId,
    isUploading,
    uploadError,
    handleFilesChange,
    reset,
  };
}
