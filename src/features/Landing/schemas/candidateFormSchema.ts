import { z } from "zod";

// Schema para la primera parte del formulario
export const candidateFormPart1Schema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/,
      "El nombre solo puede contener letras, espacios y caracteres especiales válidos"
    ),
  municipioAlcaldia: z
    .string()
    .min(1, "El municipio o alcaldía es requerido")
    .min(2, "El municipio o alcaldía debe tener al menos 2 caracteres")
    .max(100, "El municipio o alcaldía no puede exceder 100 caracteres"),
  ciudad: z
    .string()
    .min(1, "La ciudad es requerida")
    .min(2, "La ciudad debe tener al menos 2 caracteres")
    .max(100, "La ciudad no puede exceder 100 caracteres"),
  telefono: z
    .string()
    .min(1, "El teléfono es requerido")
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .regex(
      /^[0-9+\-\s()]+$/,
      "El teléfono solo puede contener números y los caracteres: +, -, espacios y paréntesis"
    ),
  correo: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Por favor ingresa un correo electrónico válido (ejemplo: nombre@dominio.com)")
    .max(255, "El correo electrónico no puede exceder 255 caracteres")
    .toLowerCase(),
  ultimoSector: z
    .string()
    .min(1, "El sector de experiencia es requerido"),
});

// Schema para la segunda parte del formulario
export const candidateFormPart2Schema = z.object({
  ultimoPuesto: z
    .string()
    .min(1, "El último puesto es requerido")
    .min(2, "El último puesto debe tener al menos 2 caracteres")
    .max(200, "El último puesto no puede exceder 200 caracteres"),
  puestoInteres: z
    .string()
    .min(1, "El puesto de interés es requerido")
    .min(2, "El puesto de interés debe tener al menos 2 caracteres")
    .max(200, "El puesto de interés no puede exceder 200 caracteres"),
  salarioDeseado: z
    .number("El salario debe ser un número válido")
    .int("El salario debe ser un número entero (sin decimales)")
    .min(0, "El salario no puede ser un número negativo")
    .max(10000000, "El salario no puede exceder $10,000,000 MXN"),
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
