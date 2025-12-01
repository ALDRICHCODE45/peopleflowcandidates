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
        className={`group border-2 border-dashed bg-slate-950/30 transition-colors duration-300 ${
          isDisabled
            ? "border-indigo-600/40 opacity-60 cursor-not-allowed pointer-events-none"
            : uploadError
            ? "border-red-500/40 hover:border-red-400/60"
            : isUploaded
            ? "border-green-500/40 hover:border-green-400/60"
            : "border-indigo-900/40 hover:border-indigo-400/80"
        }`}
      >
        <div className="flex flex-col items-center gap-3 text-center px-4 py-6">
          <div
            className={`flex items-center justify-center rounded-2xl border p-4 ${
              isDisabled
                ? "border-indigo-600/40 bg-indigo-500/10"
                : uploadError
                ? "border-red-500/40 bg-red-500/10"
                : isUploaded
                ? "border-green-500/40 bg-green-500/10"
                : "border-indigo-900/40 bg-indigo-500/10"
            }`}
          >
            {isUploading ? (
              <Spinner className="size-12 text-indigo-300" />
            ) : isUploaded ? (
              <CheckCircle2 className="size-12 text-green-300" />
            ) : uploadError ? (
              <AlertCircle className="size-12 text-red-300" />
            ) : (
              <CloudUpload className="size-12 text-indigo-300 group-hover:text-indigo-200 transition-colors" />
            )}
          </div>
          <div>
            {isUploading ? (
              <>
                <p className="font-semibold text-white">Subiendo tu CV...</p>
                <p className="text-slate-400 text-sm">
                  Por favor espera mientras se sube el archivo
                </p>
              </>
            ) : uploadError ? (
              <>
                <p className="font-semibold text-red-300">
                  Error al subir el CV
                </p>
                <p className="text-red-400/80 text-sm">{uploadError}</p>
              </>
            ) : isUploaded ? (
              <>
                <p className="font-semibold text-green-300">
                  CV subido exitosamente
                </p>
                <p className="text-slate-400 text-sm">
                  Tu CV ha sido cargado correctamente
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-white">
                  Arrastra y suelta tu CV aquí
                </p>
                <p className="text-slate-400 text-sm">
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
                className="mt-1 bg-indigo-600/20 :text-white"
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
          <p className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            {isUploading ? (
              <>
                <Spinner className="size-4 text-indigo-300" />
                Subiendo archivo...
              </>
            ) : isUploaded ? (
              <>
                <CheckCircle2 className="size-4 text-green-300" />
                Archivo subido
              </>
            ) : uploadError ? (
              <>
                <AlertCircle className="size-4 text-red-300" />
                Error en la subida
              </>
            ) : (
              <>
                <FileText className="size-4 text-indigo-300" />
                Archivo seleccionado
              </>
            )}
          </p>
          <FileUploadList className="space-y-3">
            {files.map((file, index) => (
              <FileUploadItem
                key={`${file.name}-${index}`}
                value={file}
                className={`rounded-2xl px-4 py-3 text-white ${
                  isUploading
                    ? "bg-slate-900/40 border border-indigo-600/40"
                    : uploadError
                    ? "bg-slate-900/40 border border-red-500/40"
                    : isUploaded
                    ? "bg-slate-900/40 border border-green-500/40"
                    : "bg-slate-900/40 border border-indigo-900/40"
                }`}
              >
                <div className="flex w-full items-center gap-3">
                  <FileUploadItemPreview className="rounded-lg border border-slate-700 bg-slate-950/60" />
                  <FileUploadItemMetadata className="text-left" />
                  {!isUploading && (
                    <FileUploadItemDelete asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-slate-300 hover:text-white hover:bg-slate-900/60"
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
        <Label htmlFor="terms">
          Acepto la politica de privacidad de datos.
        </Label>
      </div>
    </FileUpload>
  );
}
