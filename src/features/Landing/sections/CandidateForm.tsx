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
  candidateFormPart2Schema,
  candidateFormCompleteSchema,
  type CandidateFormData,
} from "../schemas/candidateFormSchema";
import { submitCandidateForm } from "../actions/submitCandidateForm";
import { toast } from "sonner";

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
  const [currentPart, setCurrentPart] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        // Validar y parsear los datos antes de enviar
        const validatedData = candidateFormCompleteSchema.parse(value);
        await submitCandidateForm(validatedData);
        // Aquí se puede agregar un toast de éxito o redirección

        toast.success(
          "¡Gracias por dejar tus datos! Estaremos trabajando para encontrar la mejor posición que se ajuste a tu perfil."
        );
      } catch (error) {
        console.error("Error al enviar formulario:", error);
        // Aquí se puede agregar un toast de error
      } finally {
        setIsSubmitting(false);
      }
    },
  });

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
    setCurrentPart(1);
  };

  return (
    <section id="contact" className="flex flex-col items-center mt-20 mb-20">
      <motion.div
        className="relative max-w-3xl w-full mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
      >
        <div className="absolute pointer-events-none top-10 -z-1 left-20 size-64 bg-gradient-to-br from-[#536DFF] to-[#4F39F6]/60 blur-[180px]"></div>
        <div className="absolute pointer-events-none bottom-10 -z-1 right-20 size-64 bg-gradient-to-br from-[#536DFF] to-[#4F39F6]/60 blur-[180px]"></div>

        <div className="relative border border-indigo-900 bg-gradient-to-br from-[#401B98]/5 to-[#180027]/10 rounded-3xl p-6 md:p-10 text-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <AnimatePresence mode="wait">
              {currentPart === 1 ? (
                <motion.div
                  key="part1"
                  initial={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-2 bg-gradient-to-r from-white to-[#b6abff] text-transparent bg-clip-text">
                      Cuéntanos sobre ti
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base">
                      Necesitamos algunos datos básicos para conocerte mejor
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
                            onChange={(e) => field.handleChange(e.target.value)}
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
                            onChange={(e) => field.handleChange(e.target.value)}
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
                            onChange={(e) => field.handleChange(e.target.value)}
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
                            onChange={(e) => field.handleChange(e.target.value)}
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
                            onChange={(e) => field.handleChange(e.target.value)}
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
                            onValueChange={(value) => field.handleChange(value)}
                          >
                            <SelectTrigger
                              id={field.name}
                              className="bg-slate-900/50 border-slate-600 text-white focus:border-indigo-400 focus:ring-indigo-400/20"
                              aria-invalid={field.state.meta.errors.length > 0}
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

                  <div className="flex justify-end mt-8">
                    <Button
                      type="button"
                      onClick={handleContinue}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
                    >
                      Continuar
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="part2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <h3 className="text-xl md:text-2xl font-semibold mb-2 text-indigo-300">
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
                            onChange={(e) => field.handleChange(e.target.value)}
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
                            onChange={(e) => field.handleChange(e.target.value)}
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
                                e.target.value ? parseFloat(e.target.value) : 0
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
                              aria-invalid={field.state.meta.errors.length > 0}
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
                                value as "Avanzado" | "Intermedio" | "No"
                              )
                            }
                          >
                            <SelectTrigger
                              id={field.name}
                              className="bg-slate-900/50 border-slate-600 text-white focus:border-indigo-400 focus:ring-indigo-400/20"
                              aria-invalid={field.state.meta.errors.length > 0}
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

                  <div className="flex justify-between mt-8">
                    <Button
                      type="button"
                      onClick={handleBack}
                      variant="outline"
                      className="border-slate-400 hover:text-gray-50 text-black hover:bg-white/10"
                    >
                      <ArrowLeft className="size-4" />
                      Atrás
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 disabled:opacity-50"
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
  );
}
