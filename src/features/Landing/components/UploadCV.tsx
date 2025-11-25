"use client";

import { CloudUpload, FileText, X } from "lucide-react";
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

type UploadCVProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
};

export function UploadCV({ files, onFilesChange }: UploadCVProps) {
  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error("No pudimos cargar tu archivo", {
      description: `"${
        file.name.length > 24 ? `${file.name.slice(0, 24)}...` : file.name
      }" ${message}`,
    });
  }, []);

  return (
    <FileUpload
      maxFiles={1}
      maxSize={5 * 1024 * 1024}
      accept=".pdf,.doc"
      className="w-full"
      value={files}
      onValueChange={onFilesChange}
      onFileReject={onFileReject}
    >
      <FileUploadDropzone className="group border-2 border-dashed border-indigo-900/40 bg-slate-950/30 hover:border-indigo-400/80 transition-colors duration-300">
        <div className="flex flex-col items-center gap-3 text-center px-4 py-6">
          <div className="flex items-center justify-center rounded-2xl border border-indigo-900/40 bg-indigo-500/10 p-4">
            <CloudUpload className="size-12 text-indigo-300 group-hover:text-indigo-200 transition-colors" />
          </div>
          <div>
            <p className="font-semibold text-white">
              Arrastra y suelta tu CV aquí
            </p>
            <p className="text-slate-400 text-sm">
              También puedes buscarlo manualmente
            </p>
          </div>
          <FileUploadTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="mt-1 bg-indigo-600/20 :text-white"
            >
              Seleccionar archivo
            </Button>
          </FileUploadTrigger>
        </div>
      </FileUploadDropzone>

      {files.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <FileText className="size-4 text-indigo-300" />
            Archivo cargado
          </p>
          <FileUploadList className="space-y-3">
            {files.map((file, index) => (
              <FileUploadItem
                key={`${file.name}-${index}`}
                value={file}
                className="bg-slate-900/40 border border-indigo-900/40 rounded-2xl px-4 py-3 text-white"
              >
                <div className="flex w-full items-center gap-3">
                  <FileUploadItemPreview className="rounded-lg border border-slate-700 bg-slate-950/60" />
                  <FileUploadItemMetadata className="text-left" />
                  <FileUploadItemDelete asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-slate-300 hover:text-white hover:bg-slate-900/60"
                    >
                      <X className="size-4" />
                    </Button>
                  </FileUploadItemDelete>
                </div>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </div>
      )}
      <div className="flex items-center gap-3 mt-5">
        <Checkbox id="terms" />
        <Label htmlFor="terms">
          Acepto la politica de privacidad de datos.
        </Label>
      </div>
    </FileUpload>
  );
}
