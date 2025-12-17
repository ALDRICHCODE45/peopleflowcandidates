"use client";

import {
  CloudUpload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Button } from "@/core/components/shadcn/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/core/components/shadcn/file-upload";
import { Checkbox } from "@/core/components/shadcn/checkbox";
import { Label } from "@/core/components/shadcn/label";
import { Spinner } from "@/core/components/shadcn/spinner";

type UploadCVProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  isUploading?: boolean;
  uploadError?: string | null;
  isUploaded?: boolean;
  termsAccepted?: boolean;
  onTermsChange?: (accepted: boolean) => void;
};

export function UploadCV({
  files,
  onFilesChange,
  isUploading = false,
  uploadError = null,
  isUploaded = false,
  termsAccepted = false,
  onTermsChange,
}: UploadCVProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Si no está montado aún, asumimos dark mode (defaultTheme es "dark")
  // Esto previene el flash de estilos incorrectos
  const isDark = !mounted ? true : resolvedTheme === "dark";

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error("No pudimos cargar tu archivo", {
      description: `"${
        file.name.length > 24 ? `${file.name.slice(0, 24)}...` : file.name
      }" ${message}`,
    });
  }, []);

  const isDisabled = isUploading;

  return (
    <FileUpload
      maxFiles={1}
      maxSize={10 * 1024 * 1024}
      accept=".pdf,.doc,.docx"
      className="w-full"
      value={files}
      onValueChange={onFilesChange}
      onFileReject={onFileReject}
      disabled={isDisabled}
    >
      <FileUploadDropzone
        className={`group border-2 border-dashed transition-colors duration-300 ${
          isDark
            ? `bg-slate-950/30 ${
                isDisabled
                  ? "border-indigo-600/40 opacity-60 cursor-not-allowed pointer-events-none"
                  : uploadError
                  ? "border-red-500/40 hover:border-red-400/60"
                  : isUploaded
                  ? "border-green-500/40 hover:border-green-400/60"
                  : "border-indigo-900/40 hover:border-indigo-400/80"
              }`
            : `bg-purple-50/30 ${
                isDisabled
                  ? "border-purple-300 opacity-60 cursor-not-allowed pointer-events-none"
                  : uploadError
                  ? "border-red-300 hover:border-red-400"
                  : isUploaded
                  ? "border-green-400 hover:border-green-500"
                  : "border-purple-200 hover:border-purple-400"
              }`
        }`}
      >
        <div className="flex flex-col items-center gap-3 text-center px-4 py-6">
          <div
            className={`flex items-center justify-center rounded-2xl border p-4 ${
              isDark
                ? isDisabled
                  ? "border-indigo-600/40 bg-indigo-500/10"
                  : uploadError
                  ? "border-red-500/40 bg-red-500/10"
                  : isUploaded
                  ? "border-green-500/40 bg-green-500/10"
                  : "border-indigo-900/40 bg-indigo-500/10"
                : isDisabled
                ? "border-purple-300 bg-purple-50"
                : uploadError
                ? "border-red-300 bg-red-50"
                : isUploaded
                ? "border-green-400 bg-green-50"
                : "border-purple-300 bg-purple-50"
            }`}
          >
            {isUploading ? (
              <Spinner
                className={`size-12 ${
                  isDark ? "text-indigo-300" : "text-purple-500"
                }`}
              />
            ) : isUploaded ? (
              <CheckCircle2
                className={`size-12 ${
                  isDark ? "text-green-300" : "text-green-500"
                }`}
              />
            ) : uploadError ? (
              <AlertCircle
                className={`size-12 ${
                  isDark ? "text-red-300" : "text-red-500"
                }`}
              />
            ) : (
              <CloudUpload
                className={`size-12 transition-colors ${
                  isDark
                    ? "text-indigo-300 group-hover:text-indigo-200"
                    : "text-purple-500 group-hover:text-purple-600"
                }`}
              />
            )}
          </div>
          <div>
            {isUploading ? (
              <>
                <p
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Subiendo tu CV...
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  Por favor espera mientras se sube el archivo
                </p>
              </>
            ) : uploadError ? (
              <>
                <p
                  className={`font-semibold ${
                    isDark ? "text-red-300" : "text-red-600"
                  }`}
                >
                  Error al subir el CV
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-red-400/80" : "text-red-700"
                  }`}
                >
                  {uploadError}
                </p>
              </>
            ) : isUploaded ? (
              <>
                <p
                  className={`font-semibold ${
                    isDark ? "text-green-300" : "text-green-600"
                  }`}
                >
                  CV subido exitosamente
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  Tu CV ha sido cargado correctamente
                </p>
              </>
            ) : (
              <>
                <p
                  className={`font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Arrastra y suelta tu CV aquí
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  También puedes buscarlo manualmente
                </p>
              </>
            )}
          </div>
          {!isUploading && (
            <FileUploadTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`mt-1 border ${
                  isDark
                    ? "bg-indigo-600/20 hover:bg-indigo-600/30 text-white border-indigo-600/40"
                    : "bg-purple-600/10 hover:bg-purple-600/20 text-purple-700 border-purple-300"
                }`}
                disabled={isDisabled}
              >
                Seleccionar archivo
              </Button>
            </FileUploadTrigger>
          )}
        </div>
      </FileUploadDropzone>

      {files.length > 0 && (
        <div className="mt-6">
          <p
            className={`text-sm font-medium mb-3 flex items-center gap-2 ${
              isDark ? "text-slate-300" : "text-gray-700"
            }`}
          >
            {isUploading ? (
              <>
                <Spinner
                  className={`size-4 ${
                    isDark ? "text-indigo-300" : "text-purple-500"
                  }`}
                />
                Subiendo archivo...
              </>
            ) : isUploaded ? (
              <>
                <CheckCircle2
                  className={`size-4 ${
                    isDark ? "text-green-300" : "text-green-500"
                  }`}
                />
                Archivo subido
              </>
            ) : uploadError ? (
              <>
                <AlertCircle
                  className={`size-4 ${
                    isDark ? "text-red-300" : "text-red-500"
                  }`}
                />
                Error en la subida
              </>
            ) : (
              <>
                <FileText
                  className={`size-4 ${
                    isDark ? "text-indigo-300" : "text-purple-500"
                  }`}
                />
                Archivo seleccionado
              </>
            )}
          </p>
          <FileUploadList className="space-y-3">
            {files.map((file, index) => (
              <FileUploadItem
                key={`${file.name}-${index}`}
                value={file}
                className={`rounded-2xl px-4 py-3 ${
                  isDark
                    ? `text-white ${
                        isUploading
                          ? "bg-slate-900/40 border border-indigo-600/40"
                          : uploadError
                          ? "bg-slate-900/40 border border-red-500/40"
                          : isUploaded
                          ? "bg-slate-900/40 border border-green-500/40"
                          : "bg-slate-900/40 border border-indigo-900/40"
                      }`
                    : `text-gray-900 ${
                        isUploading
                          ? "bg-purple-50 border border-purple-300"
                          : uploadError
                          ? "bg-red-50 border border-red-300"
                          : isUploaded
                          ? "bg-green-50 border border-green-300"
                          : "bg-purple-50 border border-purple-200"
                      }`
                }`}
              >
                <div className="flex w-full items-center gap-3">
                  <FileUploadItemPreview
                    className={`rounded-lg border ${
                      isDark
                        ? "border-slate-700 bg-slate-950/60"
                        : "border-gray-200 bg-white"
                    }`}
                  />
                  <FileUploadItemMetadata className="text-left" />
                  {!isUploading && (
                    <FileUploadItemDelete asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`size-8 ${
                          isDark
                            ? "text-slate-300 hover:text-white hover:bg-slate-900/60"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <X className="size-4" />
                      </Button>
                    </FileUploadItemDelete>
                  )}
                </div>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </div>
      )}
      <div className="flex items-center gap-3 mt-5">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => {
            if (onTermsChange) {
              onTermsChange(checked === true);
            }
          }}
        />
        <Label
          htmlFor="terms"
          className={isDark ? "text-slate-300" : "text-gray-700"}
        >
          Acepto la politica de privacidad de datos.
        </Label>
      </div>
    </FileUpload>
  );
}
