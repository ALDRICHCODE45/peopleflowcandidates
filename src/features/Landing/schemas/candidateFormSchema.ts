import { z } from "zod";

// Schema para la primera parte del formulario
export const candidateFormPart1Schema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  municipioAlcaldia: z.string().min(2, "El municipio o alcaldía es requerido"),
  ciudad: z.string().min(2, "La ciudad es requerida"),
  telefono: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .regex(
      /^[0-9+\-\s()]+$/,
      "El teléfono solo puede contener números y caracteres válidos"
    ),
  correo: z.string().email("Debe ser un correo electrónico válido"),
  ultimoSector: z.string().min(1, "Debes seleccionar un sector de experiencia"),
});

// Schema para la segunda parte del formulario
export const candidateFormPart2Schema = z.object({
  ultimoPuesto: z.string().min(2, "El último puesto es requerido"),
  puestoInteres: z.string().min(2, "El puesto de interés es requerido"),
  salarioDeseado: z
    .number({ message: "El salario debe ser un número válido" })
    .min(0, "El salario debe ser un número positivo"),
  titulado: z.enum(["Sí", "No"], {
    message: "Debes indicar si estás titulado",
  }),
  ingles: z.enum(["Avanzado", "Intermedio", "No"], {
    message: "Debes seleccionar tu nivel de inglés",
  }),
});

// Schema combinado para validación final
export const candidateFormCompleteSchema = candidateFormPart1Schema.merge(
  candidateFormPart2Schema
);

// Tipo TypeScript inferido del schema completo
export type CandidateFormData = z.infer<typeof candidateFormCompleteSchema>;
