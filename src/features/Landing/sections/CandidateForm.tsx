"use client";

import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
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
  candidateFormPart2Schema,
  candidateFormCompleteSchema,
} from "../schemas/candidateFormSchema";
import { submitCandidateForm } from "../actions/submitCandidateForm";
import { toast } from "sonner";
import type { SubmitCandidateFormResult } from "../actions/submitCandidateForm";
import { ZodError, z } from "zod";
import { UploadCV } from "../components/UploadCV";
import {
  Dialog,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogContent,
} from "@/core/components/shadcn/dialog";
import { useCvUpload } from "../hooks/useCvUpload";

const sectoresExperiencia: string[] = [
  "Arte y diseño",
  "Atención a clientes - Call Center",
  "Ciencias sociales - Humanidades",
  "Comunicación y creatividad",
  "Construcción - Inmobiliaria - Arquitectura",
  "Contabilidad - Finanzas",
  "Deportes - Salud - Belleza",
  "Derecho y leyes",
  "Educación",
  "Ingeniería",
  "Logística - Transporte - Distribución - Almacén",
  "Manufactura - Producción - Operación",
  "Mercadotecnia - Publicidad - Relaciones Públicas",
  "Minería - Energía - Recursos Naturales",
  "Recursos humanos",
  "Sector salud",
  "Seguros y reaseguros",
  "Servicios generales - Oficios - Seguridad",
  "Tecnologías de la Información - Sistemas",
  "Turismo - Hospitalidad - Gastronomía",
  "Ventas",
  "Veterinaria - Agricultura",
];

const rangoSalarioEsperado: string[] = [
  "10 a 20",
  "20 a 30",
  "30 a 40",
  "40 a 50",
  "50 a 75",
  "75 a 100",
  "mas de 100",
];

// Helper function to create validators from Zod schemas
const createZodValidator = (schema: z.ZodTypeAny) => {
  return ({ value }: { value: unknown }) => {
    const result = schema.safeParse(value);
    if (!result.success) {
      return result.error.issues[0]?.message || "Valor inválido";
    }
    return undefined;
  };
};

// Clase base para inputs
const baseInputClass =
  "bg-white dark:bg-slate-900/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus-visible:border-purple-500 dark:focus-visible:border-indigo-400 focus-visible:ring-purple-500/20 dark:focus-visible:ring-indigo-400/20";
const errorInputClass =
  "bg-white dark:bg-slate-900/50 border-red-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus-visible:border-red-500 dark:focus-visible:border-red-400 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-400/20 ring-1 ring-red-500/50";

// Clase base para selects
const baseSelectClass =
  "bg-white dark:bg-slate-900/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-indigo-400 focus:ring-purple-500/20 dark:focus:ring-indigo-400/20";
const errorSelectClass =
  "bg-white dark:bg-slate-900/50 border-red-500 text-gray-900 dark:text-white focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20 ring-1 ring-red-500/50";

export default function CandidateForm() {
  const { resolvedTheme } = useTheme();
  const [currentPart, setCurrentPart] = useState<0 | 1 | 2>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFiles, setCvFiles] = useState<File[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Si no está montado aún, asumimos dark mode (defaultTheme es "dark")
  // Esto previene el flash de estilos incorrectos
  const isDark = !mounted ? true : resolvedTheme === "dark";

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
      rangoSalarioDeseado: "",
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
          uploadedFileId
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
              "rangoSalarioDeseado",
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
                })
              );
            }
          });

          if (!hasFieldErrors) {
            toast.error(
              "Por favor verifica que todos los campos estén completos y sean válidos."
            );
          } else {
            toast.error(
              "Por favor corrige los errores en el formulario antes de continuar."
            );
            // Navegar a la parte del formulario donde está el primer error
            const firstErrorField = error.issues[0]?.path[0] as string;
            const part2Fields = [
              "ultimoPuesto",
              "puestoInteres",
              "rangoSalarioDeseado",
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
              "Ocurrió un error al enviar el formulario. Por favor intenta de nuevo."
          );
        } else {
          toast.error(
            "Ocurrió un error inesperado. Por favor intenta de nuevo o contacta con soporte."
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
    // Validar todos los campos de la parte 1 antes de continuar
    const part1Data = {
      nombre: form.state.values.nombre,
      municipioAlcaldia: form.state.values.municipioAlcaldia,
      ciudad: form.state.values.ciudad,
      telefono: form.state.values.telefono,
      correo: form.state.values.correo,
      ultimoSector: form.state.values.ultimoSector,
    };

    const result = candidateFormPart1Schema.safeParse(part1Data);

    if (!result.success) {
      // Validar todos los campos para mostrar errores
      await form.validateAllFields("change");

      const fieldLabels: Record<string, string> = {
        nombre: "Nombre completo",
        municipioAlcaldia: "Municipio o Alcaldía",
        ciudad: "Estado",
        telefono: "Teléfono",
        correo: "Correo electrónico",
        ultimoSector: "Último sector de experiencia",
      };

      const errors: string[] = [];
      let firstErrorField: string | null = null;

      // Establecer errores específicos en cada campo
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        const validFields = [
          "nombre",
          "municipioAlcaldia",
          "ciudad",
          "telefono",
          "correo",
          "ultimoSector",
        ] as const;

        if (
          fieldName &&
          validFields.includes(fieldName as (typeof validFields)[number])
        ) {
          if (!firstErrorField) {
            firstErrorField = fieldName;
          }
          errors.push(`${fieldLabels[fieldName]}: ${issue.message}`);
          form.setFieldMeta(
            fieldName as (typeof validFields)[number],
            (prev) => ({
              ...prev,
              errorMap: { onChange: issue.message },
            })
          );
        }
      });

      // Actualizar el estado con los errores encontrados
      setFormErrors(errors);

      // Scroll y focus al primer campo con error
      if (firstErrorField && formRef.current) {
        const errorElement = formRef.current.querySelector(
          `[name="${firstErrorField}"]`
        ) as HTMLElement | null;
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => {
            errorElement.focus();
          }, 300);
        }
      }

      toast.error(
        `Hay ${errors.length} campo${
          errors.length > 1 ? "s" : ""
        } con errores. Por favor corrígelos para continuar.`
      );
      return;
    }

    // Limpiar errores y continuar a la parte 2
    setFormErrors([]);
    setCurrentPart(2);
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
      <section
        id="contact"
        className="flex flex-col items-center mt-12 md:mt-20 mb-12 md:mb-20"
      >
        <motion.div
          className="relative max-w-3xl w-full mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
          {/* Gradientes de fondo para modo claro */}
          <div className="absolute pointer-events-none top-10 -z-1 left-20 size-64 bg-gradient-to-br from-purple-200 to-purple-100/60 dark:from-[#536DFF] dark:to-[#4F39F6]/60 blur-[180px] opacity-40 dark:opacity-100"></div>
          <div className="absolute pointer-events-none bottom-10 -z-1 right-20 size-64 bg-gradient-to-br from-purple-200 to-purple-100/60 dark:from-[#536DFF] dark:to-[#4F39F6]/60 blur-[180px] opacity-40 dark:opacity-100"></div>

          <div
            className={`relative rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-10 border shadow-lg ${
              isDark
                ? "border-indigo-900 bg-gradient-to-br from-[#401B98]/5 to-[#180027]/10 text-white shadow-none"
                : "border-gray-200 bg-white text-gray-900"
            }`}
          >
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              {/* Resumen de errores */}
              <AnimatePresence>
                {formErrors.length > 0 && currentPart === 1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 rounded-lg p-4 overflow-hidden"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="size-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-red-600 dark:text-red-400 font-medium text-sm mb-2">
                          Por favor corrige los siguientes errores:
                        </p>
                        <ul className="space-y-1">
                          {formErrors.map((error, index) => (
                            <li
                              key={index}
                              className="text-red-700 dark:text-red-300/80 text-xs"
                            >
                              • {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                      <p className="text-purple-600 dark:text-indigo-200 text-xs uppercase tracking-[0.4em] mb-2 font-medium">
                        Paso 0
                      </p>
                      <h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 dark:bg-gradient-to-r dark:from-white dark:to-[#b6abff] dark:text-transparent dark:bg-clip-text">
                        Comienza la busqueda de tu trabajo ideal.
                      </h2>
                      <p className="text-gray-600 dark:text-slate-400 text-sm md:text-base">
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
                        className="bg-purple-600 hover:bg-purple-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white border-purple-600 dark:border-indigo-600 w-full sm:w-auto"
                      >
                        continuar para subir tu cv
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
                      <p className="text-purple-600 dark:text-indigo-200 text-xs uppercase tracking-[0.4em] mb-2 font-medium">
                        Paso 1
                      </p>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2 text-gray-900 dark:bg-gradient-to-r dark:from-white dark:to-[#b6abff] dark:text-transparent dark:bg-clip-text">
                        Llena tu ficha
                      </h2>
                      <p className="text-gray-600 dark:text-slate-400 text-sm md:text-base">
                        Complementa tus datos con los que tu futuro empleador te
                        podra contactar.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <form.Field
                        name="nombre"
                        validators={{
                          onChange: createZodValidator(
                            candidateFormPart1Schema.shape.nombre
                          ),
                          onBlur: createZodValidator(
                            candidateFormPart1Schema.shape.nombre
                          ),
                        }}
                      >
                        {(field) => (
                          <div className="space-y-2 md:col-span-2">
                            <Label
                              htmlFor={field.name}
                              className={
                                field.state.meta.errors.length > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-700 dark:text-slate-200"
                              }
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
                              className={
                                field.state.meta.errors.length > 0
                                  ? errorInputClass
                                  : baseInputClass
                              }
                              placeholder="Tu nombre completo"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field
                        name="municipioAlcaldia"
                        validators={{
                          onChange: createZodValidator(
                            candidateFormPart1Schema.shape.municipioAlcaldia
                          ),
                          onBlur: createZodValidator(
                            candidateFormPart1Schema.shape.municipioAlcaldia
                          ),
                        }}
                      >
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className={
                                field.state.meta.errors.length > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-700 dark:text-slate-200"
                              }
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
                              className={
                                field.state.meta.errors.length > 0
                                  ? errorInputClass
                                  : baseInputClass
                              }
                              placeholder="Ej: Benito Juárez"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field
                        name="ciudad"
                        validators={{
                          onChange: createZodValidator(
                            candidateFormPart1Schema.shape.ciudad
                          ),
                          onBlur: createZodValidator(
                            candidateFormPart1Schema.shape.ciudad
                          ),
                        }}
                      >
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className={
                                field.state.meta.errors.length > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-700 dark:text-slate-200"
                              }
                            >
                              Estado *
                            </Label>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              className={
                                field.state.meta.errors.length > 0
                                  ? errorInputClass
                                  : baseInputClass
                              }
                              placeholder="Ej: CDMX"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field
                        name="telefono"
                        validators={{
                          onChange: createZodValidator(
                            candidateFormPart1Schema.shape.telefono
                          ),
                          onBlur: createZodValidator(
                            candidateFormPart1Schema.shape.telefono
                          ),
                        }}
                      >
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className={
                                field.state.meta.errors.length > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-700 dark:text-slate-200"
                              }
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
                              className={
                                field.state.meta.errors.length > 0
                                  ? errorInputClass
                                  : baseInputClass
                              }
                              placeholder="55 1234 5678"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field
                        name="correo"
                        validators={{
                          onChange: createZodValidator(
                            candidateFormPart1Schema.shape.correo
                          ),
                          onBlur: createZodValidator(
                            candidateFormPart1Schema.shape.correo
                          ),
                        }}
                      >
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className={
                                field.state.meta.errors.length > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-700 dark:text-slate-200"
                              }
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
                              className={
                                field.state.meta.errors.length > 0
                                  ? errorInputClass
                                  : baseInputClass
                              }
                              placeholder="tu@email.com"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field
                        name="ultimoSector"
                        validators={{
                          onChange: createZodValidator(
                            candidateFormPart1Schema.shape.ultimoSector
                          ),
                          onBlur: createZodValidator(
                            candidateFormPart1Schema.shape.ultimoSector
                          ),
                        }}
                      >
                        {(field) => (
                          <div className="space-y-2 md:col-span-2">
                            <Label
                              htmlFor={field.name}
                              className={
                                field.state.meta.errors.length > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-700 dark:text-slate-200"
                              }
                            >
                              Último sector de experiencia *
                            </Label>
                            <Select
                              name={field.name}
                              value={field.state.value}
                              onValueChange={(value) =>
                                field.handleChange(value)
                              }
                              onOpenChange={(open) => {
                                if (!open) {
                                  field.handleBlur();
                                }
                              }}
                            >
                              <SelectTrigger
                                id={field.name}
                                className={
                                  field.state.meta.errors.length > 0
                                    ? errorSelectClass
                                    : baseSelectClass
                                }
                                aria-invalid={
                                  field.state.meta.errors.length > 0
                                }
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-600">
                                {sectoresExperiencia.map((sector) => (
                                  <SelectItem
                                    key={sector}
                                    value={sector}
                                    className="text-gray-900 dark:text-white focus:bg-purple-50 dark:focus:bg-indigo-600/20 hover:bg-purple-50 dark:hover:bg-indigo-600/20"
                                  >
                                    {sector}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                                <AlertCircle className="size-3" />
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
                        className="border-gray-300 dark:border-slate-400 hover:text-gray-900 dark:hover:text-gray-50 text-gray-700 dark:text-black hover:bg-gray-50 dark:hover:bg-white/10 w-full sm:w-auto order-2 sm:order-1"
                      >
                        <ArrowLeft className="size-4" />
                        Atrás
                      </Button>
                      <Button
                        type="button"
                        onClick={handleContinue}
                        className="bg-purple-600 hover:bg-purple-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white border-purple-600 dark:border-indigo-600 w-full sm:w-auto order-1 sm:order-2"
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
                      <p className="text-purple-600 dark:text-indigo-200 text-xs uppercase tracking-[0.4em] mb-2 font-medium">
                        Paso 2
                      </p>
                      <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 text-gray-900 dark:text-indigo-300">
                        ¡Ya casi terminamos! Solo unos cuantos datos más
                      </h3>
                      <p className="text-gray-600 dark:text-slate-400 text-sm md:text-base">
                        Solo unos cuantos datos mas para ubicar tu perfil en el
                        mejor empleo.
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <form.Field
                        name="ultimoPuesto"
                        validators={{
                          onChange: createZodValidator(
                            candidateFormPart2Schema.shape.ultimoPuesto
                          ),
                          onBlur: createZodValidator(
                            candidateFormPart2Schema.shape.ultimoPuesto
                          ),
                        }}
                      >
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className={
                                field.state.meta.errors.length > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-700 dark:text-slate-200"
                              }
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
                              className={
                                field.state.meta.errors.length > 0
                                  ? errorInputClass
                                  : baseInputClass
                              }
                              placeholder="Ej: Senior Developer"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field
                        name="puestoInteres"
                        validators={{
                          onChange: createZodValidator(
                            candidateFormPart2Schema.shape.puestoInteres
                          ),
                          onBlur: createZodValidator(
                            candidateFormPart2Schema.shape.puestoInteres
                          ),
                        }}
                      >
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className={
                                field.state.meta.errors.length > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-700 dark:text-slate-200"
                              }
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
                              className={
                                field.state.meta.errors.length > 0
                                  ? errorInputClass
                                  : baseInputClass
                              }
                              placeholder="Ej: Tech Lead"
                              aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field
                        name="rangoSalarioDeseado"
                        validators={{
                          onChange: createZodValidator(
                            candidateFormPart2Schema.shape.rangoSalarioDeseado
                          ),
                          onBlur: createZodValidator(
                            candidateFormPart2Schema.shape.rangoSalarioDeseado
                          ),
                        }}
                      >
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className={
                                field.state.meta.errors.length > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-700 dark:text-slate-200"
                              }
                            >
                              Salario neto deseado *
                            </Label>
                            <Select
                              name={field.name}
                              value={field.state.value}
                              onValueChange={(value) =>
                                field.handleChange(value)
                              }
                              onOpenChange={(open) => {
                                if (!open) {
                                  field.handleBlur();
                                }
                              }}
                            >
                              <SelectTrigger
                                id={field.name}
                                className={
                                  field.state.meta.errors.length > 0
                                    ? errorSelectClass
                                    : baseSelectClass
                                }
                                aria-invalid={
                                  field.state.meta.errors.length > 0
                                }
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-600">
                                {rangoSalarioEsperado.map((salario) => (
                                  <SelectItem
                                    value={salario}
                                    key={salario}
                                    className="text-gray-900 dark:text-white focus:bg-purple-50 dark:focus:bg-indigo-600/20 hover:bg-purple-50 dark:hover:bg-indigo-600/20"
                                  >
                                    {salario}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field
                        name="titulado"
                        validators={{
                          onChange: createZodValidator(
                            candidateFormPart2Schema.shape.titulado
                          ),
                          onBlur: createZodValidator(
                            candidateFormPart2Schema.shape.titulado
                          ),
                        }}
                      >
                        {(field) => (
                          <div className="space-y-2">
                            <Label
                              htmlFor={field.name}
                              className={
                                field.state.meta.errors.length > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-700 dark:text-slate-200"
                              }
                            >
                              ¿Estás titulado? *
                            </Label>
                            <Select
                              name={field.name}
                              value={field.state.value}
                              onValueChange={(value) =>
                                field.handleChange(value as "Sí" | "No")
                              }
                              onOpenChange={(open) => {
                                if (!open) {
                                  field.handleBlur();
                                }
                              }}
                            >
                              <SelectTrigger
                                id={field.name}
                                className={
                                  field.state.meta.errors.length > 0
                                    ? errorSelectClass
                                    : baseSelectClass
                                }
                                aria-invalid={
                                  field.state.meta.errors.length > 0
                                }
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-600">
                                <SelectItem
                                  value="Sí"
                                  className="text-gray-900 dark:text-white focus:bg-purple-50 dark:focus:bg-indigo-600/20 hover:bg-purple-50 dark:hover:bg-indigo-600/20"
                                >
                                  Sí
                                </SelectItem>
                                <SelectItem
                                  value="No"
                                  className="text-gray-900 dark:text-white focus:bg-purple-50 dark:focus:bg-indigo-600/20 hover:bg-purple-50 dark:hover:bg-indigo-600/20"
                                >
                                  No
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {field.state.meta.errors[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field
                        name="ingles"
                        validators={{
                          onChange: createZodValidator(
                            candidateFormPart2Schema.shape.ingles
                          ),
                          onBlur: createZodValidator(
                            candidateFormPart2Schema.shape.ingles
                          ),
                        }}
                      >
                        {(field) => (
                          <div className="space-y-2 md:col-span-2">
                            <Label
                              htmlFor={field.name}
                              className={
                                field.state.meta.errors.length > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-700 dark:text-slate-200"
                              }
                            >
                              Nivel de inglés *
                            </Label>
                            <Select
                              name={field.name}
                              value={field.state.value}
                              onValueChange={(value) =>
                                field.handleChange(
                                  value as "Avanzado" | "Intermedio" | "No"
                                )
                              }
                              onOpenChange={(open) => {
                                if (!open) {
                                  field.handleBlur();
                                }
                              }}
                            >
                              <SelectTrigger
                                id={field.name}
                                className={
                                  field.state.meta.errors.length > 0
                                    ? errorSelectClass
                                    : baseSelectClass
                                }
                                aria-invalid={
                                  field.state.meta.errors.length > 0
                                }
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-600">
                                <SelectItem
                                  value="Avanzado"
                                  className="text-gray-900 dark:text-white hover:bg-purple-50 dark:hover:bg-indigo-600/20 focus:bg-purple-50 dark:focus:bg-indigo-600/20"
                                >
                                  Avanzado
                                </SelectItem>
                                <SelectItem
                                  value="Intermedio"
                                  className="text-gray-900 dark:text-white hover:bg-purple-50 dark:hover:bg-indigo-600/20 focus:bg-purple-50 dark:focus:bg-indigo-600/20"
                                >
                                  Intermedio
                                </SelectItem>
                                <SelectItem
                                  value="No"
                                  className="text-gray-900 dark:text-white hover:bg-purple-50 dark:hover:bg-indigo-600/20 focus:bg-purple-50 dark:focus:bg-indigo-600/20"
                                >
                                  No
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                                <AlertCircle className="size-3" />
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
                        className="border-gray-300 dark:border-slate-400 hover:text-gray-900 dark:hover:text-gray-50 text-gray-700 dark:text-black hover:bg-gray-50 dark:hover:bg-white/10 w-full sm:w-auto order-2 sm:order-1"
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
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="overflow-hidden border border-gray-200 dark:border-indigo-900 bg-white dark:bg-gradient-to-br dark:from-[#401B98] dark:to-[#180027] dark:shadow-2xl shadow-xl z-[100]">
            <DialogHeader className="relative z-10 space-y-2 text-center">
              <DialogTitle className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:bg-gradient-to-r dark:from-white dark:to-[#b6abff] dark:text-transparent dark:bg-clip-text px-2">
                ¡Felicidades! Ya formas parte de People Flow
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-indigo-100/80 text-sm md:text-base px-2">
                Recibimos tu información y comenzaremos a buscar la posición que
                mejor encaje con tu perfil.
              </DialogDescription>
            </DialogHeader>
            <div className="relative z-10 mt-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-purple-50 dark:bg-black/10 p-4 text-sm text-gray-700 dark:text-indigo-100/70">
              Te escribiremos muy pronto para contarte los siguientes pasos y
              compartirte oportunidades alineadas a tus metas profesionales.
            </div>
            <DialogFooter className="border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-900/40 px-6 py-4">
              <DialogClose asChild>
                <Button className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-purple-600 dark:bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700 dark:hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 dark:focus-visible:ring-indigo-400">
                  Cerrar y seguir explorando
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
}
