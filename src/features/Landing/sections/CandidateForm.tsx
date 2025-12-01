"use client";

import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/core/components/shadcn/button";
import { Input } from "@/core/components/shadcn/input";
import { Label } from "@/core/components/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/shadcn/select";
import {
  candidateFormPart1Schema,
  candidateFormCompleteSchema,
} from "../schemas/candidateFormSchema";
import { submitCandidateForm } from "../actions/submitCandidateForm";
import { toast } from "sonner";
import type { SubmitCandidateFormResult } from "../actions/submitCandidateForm";
import { ZodError } from "zod";
import { UploadCV } from "../components/UploadCV";
import {
  Dialog,
  DialogPopup,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogContent,
} from "@/core/components/shadcn/dialog";
import { useCvUpload } from "../hooks/useCvUpload";

const sectoresExperiencia = [
  "Tecnología",
  "Finanzas",
  "Salud",
  "Educación",
  "Manufactura",
  "Retail",
  "Consultoría",
  "Marketing",
  "Recursos Humanos",
  "Operaciones",
  "Otro",
];

export default function CandidateForm() {
  const [currentPart, setCurrentPart] = useState<0 | 1 | 2>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFiles, setCvFiles] = useState<File[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Hook para manejar la subida de CV
  const {
    uploadedFileId,
    isUploading,
    uploadError,
    handleFilesChange: handleCvFilesChange,
    reset: resetCvUpload,
  } = useCvUpload();

  const form = useForm({
    defaultValues: {
      nombre: "",
      municipioAlcaldia: "",
      ciudad: "",
      telefono: "",
      correo: "",
      ultimoSector: "",
      ultimoPuesto: "",
      puestoInteres: "",
      salarioDeseado: 0,
      titulado: "No",
      ingles: "No",
    },
    validators: {
      onChange: ({ value }) => {
        const result = candidateFormCompleteSchema.safeParse(value);
        if (!result.success) {
          return result.error.format();
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        if (!uploadedFileId) {
          toast.error("Por favor carga tu CV antes de enviar el formulario.");
          setCurrentPart(0);
          return;
        }

        // Validar y parsear los datos antes de enviar
        const validatedData = candidateFormCompleteSchema.parse(value);

        // Enviar el formulario a la base de datos con el ID del CV
        const result: SubmitCandidateFormResult = await submitCandidateForm(
          validatedData,
          uploadedFileId,
        );

        if (result.success) {
          // Mostrar mensaje de éxito
          //toast.success(result.message);
          setShowSuccessDialog(true);

          // Limpiar el formulario después del envío exitoso
          form.reset();
          setCvFiles([]);
          resetCvUpload();
          setTermsAccepted(false);
          setCurrentPart(0);
        } else {
          // Manejar errores específicos
          if (result.field === "correo") {
            // Si el error es en el campo correo, establecer el error en ese campo
            form.setFieldMeta("correo", (prev) => ({
              ...prev,
              errorMap: { onSubmit: result.error },
            }));
            toast.error(result.error);
          } else {
            // Error general
            toast.error(result.error);
          }
        }
      } catch (error) {
        console.error("Error al enviar formulario:", error);

        // Manejar errores de validación de Zod
        if (error instanceof ZodError) {
          let hasFieldErrors = false;

          error.issues.forEach((issue) => {
            const fieldName = issue.path[0] as string;
            const validFields = [
              "nombre",
              "municipioAlcaldia",
              "ciudad",
              "telefono",
              "correo",
              "ultimoSector",
              "ultimoPuesto",
              "puestoInteres",
              "salarioDeseado",
              "titulado",
              "ingles",
            ] as const;

            if (
              fieldName &&
              validFields.includes(fieldName as (typeof validFields)[number])
            ) {
              hasFieldErrors = true;
              form.setFieldMeta(
                fieldName as (typeof validFields)[number],
                (prev) => ({
                  ...prev,
                  errorMap: { onSubmit: issue.message },
                }),
              );
            }
          });

          if (!hasFieldErrors) {
            toast.error(
              "Por favor verifica que todos los campos estén completos y sean válidos.",
            );
          } else {
            toast.error(
              "Por favor corrige los errores en el formulario antes de continuar.",
            );
            // Navegar a la parte del formulario donde está el primer error
            const firstErrorField = error.issues[0]?.path[0] as string;
            const part2Fields = [
              "ultimoPuesto",
              "puestoInteres",
              "salarioDeseado",
              "titulado",
              "ingles",
            ];

            if (firstErrorField && part2Fields.includes(firstErrorField)) {
              // Si el error está en la parte 2, ir a la parte 2
              setCurrentPart(2);
            } else {
              // Si el error está en la parte 1, ir a la parte 1
              setCurrentPart(1);
            }
          }
        } else if (error instanceof Error) {
          toast.error(
            error.message ||
              "Ocurrió un error al enviar el formulario. Por favor intenta de nuevo.",
          );
        } else {
          toast.error(
            "Ocurrió un error inesperado. Por favor intenta de nuevo o contacta con soporte.",
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleCvContinue = () => {
    if (cvFiles.length === 0) {
      toast.error("Sube tu CV antes de continuar.");
      return;
    }
    if (isUploading) {
      toast.error("El CV aún se está subiendo. Por favor espera un momento.");
      return;
    }
    if (!uploadedFileId) {
      toast.error("Por favor espera a que se complete la subida del CV.");
      return;
    }
    if (!termsAccepted) {
      toast.error("Debes aceptar la política de privacidad para continuar.");
      return;
    }
    setCurrentPart(1);
  };

  // Wrapper para manejar cambios de archivos que actualiza tanto el estado local como el hook
  const handleFilesChange = (newFiles: File[]) => {
    setCvFiles(newFiles);
    // El hook manejará la subida automáticamente
    handleCvFilesChange(newFiles);
  };

  const handleContinue = async () => {
    // Validar parte 1 antes de continuar
    const part1Data = {
      nombre: form.state.values.nombre,
      municipioAlcaldia: form.state.values.municipioAlcaldia,
      ciudad: form.state.values.ciudad,
      telefono: form.state.values.telefono,
      correo: form.state.values.correo,
      ultimoSector: form.state.values.ultimoSector,
    };

    const result = candidateFormPart1Schema.safeParse(part1Data);
    if (result.success) {
      setCurrentPart(2);
    }
    // Si hay errores, se mostrarán automáticamente por la validación del formulario
  };

  const handleBack = () => {
    setCurrentPart((prevPart) => {
      if (prevPart === 2) {
        return 1;
      }
      if (prevPart === 1) {
        return 0;
      }
      return 0;
    });
  };

  return (
    <>
      <section id="contact" className="flex flex-col items-center mt-12 md:mt-20 mb-12 md:mb-20">
        <motion.div
          className="relative max-w-3xl w-full mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
          <div className="absolute pointer-events-none top-10 -z-1 left-20 size-64 bg-gradient-to-br from-[#536DFF] to-[#4F39F6]/60 blur-[180px]"></div>
          <div className="absolute pointer-events-none bottom-10 -z-1 right-20 size-64 bg-gradient-to-br from-[#536DFF] to-[#4F39F6]/60 blur-[180px]"></div>

          <div className="relative border border-indigo-900 bg-gradient-to-br from-[#401B98]/5 to-[#180027]/10 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-10 text-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <AnimatePresence mode="wait">
                {currentPart === 0 && (
                  <motion.div
                    key="part0"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="mb-6">
                      <p className="text-indigo-200 text-xs uppercase tracking-[0.4em] mb-2">
                        Paso 0
                      </p>
                      <h2 className="text-xl md:text-2xl font-semibold mb-3 bg-gradient-to-r from-white to-[#b6abff] text-transparent bg-clip-text">
                        Comienza la busqueda de tu trabajo ideal.
                      </h2>
                      <p className="text-slate-400 text-sm md:text-base">
                        Empecemos cargando tu CV para compartirnos tu
                        experiencia profesional.
                      </p>
                    </div>

                    <UploadCV
                      files={cvFiles}
                      onFilesChange={handleFilesChange}
                      isUploading={isUploading}
                      uploadError={uploadError}
                      isUploaded={!!uploadedFileId}
                      termsAccepted={termsAccepted}
                      onTermsChange={setTermsAccepted}
                    />

                    <div className="flex justify-end mt-6 md:mt-8">
                      <Button
                        type="button"
                        onClick={handleCvContinue}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 w-full sm:w-auto"
                      >
                        Continuar con tus datos
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentPart === 1 && (
                  <motion.div
                    key="part1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="mb-6">
                      <p className="text-indigo-200 text-xs uppercase tracking-[0.4em] mb-2">
                        Paso 1
                      </p>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2 bg-gradient-to-r from-white to-[#b6abff] text-transparent bg-clip-text">
                        Cuéntanos sobre ti
                      </h2>
                      <p className="text-slate-400 text-sm md:text-base">
                        Llena los siguientes datos para poder subir tu cv.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <form.Field name="nombre">
                        {(field) => (
                          <div className="space-y-2 md:col-span-2">
                            <Label
                              htmlFor={field.name}
                              className="text-slate-200"
                            >
                              Nombre completo *
                            </Label>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20"
                              placeholder="Tu nombre completo"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-400 text-xs">
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="municipioAlcaldia">
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className="text-slate-200"
                            >
                              Municipio o Alcaldía *
                            </Label>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20"
                              placeholder="Ej: Benito Juárez"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-400 text-xs">
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="ciudad">
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className="text-slate-200"
                            >
                              Ciudad *
                            </Label>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20"
                              placeholder="Ej: Ciudad de México"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-400 text-xs">
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="telefono">
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className="text-slate-200"
                            >
                              Teléfono *
                            </Label>
                            <Input
                              id={field.name}
                              name={field.name}
                              type="tel"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20"
                              placeholder="+52 55 1234 5678"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-400 text-xs">
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="correo">
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className="text-slate-200"
                            >
                              Correo electrónico *
                            </Label>
                            <Input
                              id={field.name}
                              name={field.name}
                              type="email"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20"
                              placeholder="tu@email.com"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-400 text-xs">
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="ultimoSector">
                        {(field) => (
                          <div className="space-y-2 md:col-span-2">
                            <Label
                              htmlFor={field.name}
                              className="text-slate-200"
                            >
                              Último sector de experiencia *
                            </Label>
                            <Select
                              value={field.state.value}
                              onValueChange={(value) =>
                                field.handleChange(value)
                              }
                            >
                              <SelectTrigger
                                id={field.name}
                                className="bg-slate-900/50 border-slate-600 text-white focus:border-indigo-400 focus:ring-indigo-400/20"
                                aria-invalid={
                                  field.state.meta.errors.length > 0
                                }
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-slate-600">
                                {sectoresExperiencia.map((sector) => (
                                  <SelectItem
                                    key={sector}
                                    value={sector}
                                    className="text-white focus:bg-indigo-600/20 hover:text-white"
                                  >
                                    {sector}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-400 text-xs">
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 md:mt-8">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        className="border-slate-400 hover:text-gray-50 text-black hover:bg-white/10 w-full sm:w-auto order-2 sm:order-1"
                      >
                        <ArrowLeft className="size-4" />
                        Atrás
                      </Button>
                      <Button
                        type="button"
                        onClick={handleContinue}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 w-full sm:w-auto order-1 sm:order-2"
                      >
                        Continuar
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentPart === 2 && (
                  <motion.div
                    key="part2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mb-6"
                    >
                      <p className="text-indigo-200 text-xs uppercase tracking-[0.4em] mb-2">
                        Paso 2
                      </p>
                      <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 text-indigo-300">
                        ¡Ya casi terminamos! Solo unos cuantos datos más
                      </h3>
                      <p className="text-slate-400 text-sm md:text-base">
                        Información sobre tu experiencia profesional
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <form.Field name="ultimoPuesto">
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className="text-slate-200"
                            >
                              Último puesto *
                            </Label>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20"
                              placeholder="Ej: Senior Developer"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-400 text-xs">
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="puestoInteres">
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className="text-slate-200"
                            >
                              Puesto de interés *
                            </Label>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20"
                              placeholder="Ej: Tech Lead"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-400 text-xs">
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="salarioDeseado">
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className="text-slate-200"
                            >
                              Salario deseado (MXN) *
                            </Label>
                            <Input
                              id={field.name}
                              name={field.name}
                              type="number"
                              value={field.state.value || ""}
                              onChange={(e) =>
                                field.handleChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : 0,
                                )
                              }
                              onBlur={field.handleBlur}
                              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20"
                              placeholder="50000"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-400 text-xs">
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="titulado">
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className="text-slate-200"
                            >
                              ¿Estás titulado? *
                            </Label>
                            <Select
                              value={field.state.value}
                              onValueChange={(value) =>
                                field.handleChange(value as "Sí" | "No")
                              }
                            >
                              <SelectTrigger
                                id={field.name}
                                className="bg-slate-900/50 border-slate-600 text-white focus:border-indigo-400 focus:ring-indigo-400/20"
                                aria-invalid={
                                  field.state.meta.errors.length > 0
                                }
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-slate-600">
                                <SelectItem
                                  value="Sí"
                                  className="text-white focus:bg-indigo-600/20 hover:text-white"
                                >
                                  Sí
                                </SelectItem>
                                <SelectItem
                                  value="No"
                                  className="text-white focus:bg-indigo-600/20 hover:text-white"
                                >
                                  No
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-400 text-xs">
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="ingles">
                        {(field) => (
                          <div className="space-y-2 md:col-span-2">
                            <Label
                              htmlFor={field.name}
                              className="text-slate-200"
                            >
                              Nivel de inglés *
                            </Label>
                            <Select
                              value={field.state.value}
                              onValueChange={(value) =>
                                field.handleChange(
                                  value as "Avanzado" | "Intermedio" | "No",
                                )
                              }
                            >
                              <SelectTrigger
                                id={field.name}
                                className="bg-slate-900/50 border-slate-600 text-white focus:border-indigo-400 focus:ring-indigo-400/20"
                                aria-invalid={
                                  field.state.meta.errors.length > 0
                                }
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-slate-600">
                                <SelectItem
                                  value="Avanzado"
                                  className="text-white focus:bg-indigo-600/20"
                                >
                                  Avanzado
                                </SelectItem>
                                <SelectItem
                                  value="Intermedio"
                                  className="text-white focus:bg-indigo-600/20"
                                >
                                  Intermedio
                                </SelectItem>
                                <SelectItem
                                  value="No"
                                  className="text-white focus:bg-indigo-600/20"
                                >
                                  No
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-400 text-xs">
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 md:mt-8">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="border-slate-400 hover:text-gray-50 text-black hover:bg-white/10 w-full sm:w-auto order-2 sm:order-1"
                      >
                        <ArrowLeft className="size-4" />
                        Atrás
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 disabled:opacity-50 w-full sm:w-auto order-1 sm:order-2"
                      >
                        {isSubmitting ? "Enviando..." : "Enviar formulario"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </section>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogPopup>
          <DialogContent className="relative overflow-hidden border border-indigo-900 bg-gradient-to-br from-[#401B98]/80 to-[#180027]/90 text-white shadow-2xl">
            <div className="absolute pointer-events-none -top-10 -left-10 size-60 bg-gradient-to-br from-[#536DFF]/40 to-[#4F39F6]/60 blur-[120px]" />
            <div className="absolute pointer-events-none -bottom-10 -right-5 size-56 bg-gradient-to-br from-[#536DFF]/40 to-[#4F39F6]/60 blur-[140px]" />
            <DialogHeader className="relative z-10 space-y-2 text-center">
              <DialogTitle className="text-xl md:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-white to-[#b6abff] text-transparent bg-clip-text px-2">
                ¡Felicidades! Ya formas parte de People Flow Club
              </DialogTitle>
              <DialogDescription className="text-indigo-100/80 text-sm md:text-base px-2">
                Recibimos tu información y comenzaremos a buscar la posición que
                mejor encaje con tu perfil.
              </DialogDescription>
            </DialogHeader>
            <div className="relative z-10 mt-6 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-indigo-100/70">
              Te escribiremos muy pronto para contarte los siguientes pasos y
              compartirte oportunidades alineadas a tus metas profesionales.
            </div>
          </DialogContent>
          <DialogFooter className="border-t border-white/10 bg-slate-900/40 px-6 py-4">
            <DialogClose className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
              Cerrar y seguir explorando
            </DialogClose>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    </>
  );
}
