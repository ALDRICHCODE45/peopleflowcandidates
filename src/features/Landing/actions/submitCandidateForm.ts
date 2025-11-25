"use server";

import {
  candidateFormCompleteSchema,
  type CandidateFormData,
} from "../schemas/candidateFormSchema";

/**
 * Server action para enviar el formulario de candidatos
 * Esta función está preparada para recibir los datos validados
 * y conectarse con el backend cuando esté listo.
 *
 * @param data - Datos del formulario validados con Zod
 * @returns Promise con el resultado del envío
 */
export async function submitCandidateForm(data: CandidateFormData) {
  // Validar los datos con el schema completo
  const validatedData = candidateFormCompleteSchema.parse(data);

  // TODO: Implementar la lógica de envío al backend
  // Ejemplo:
  // const response = await fetch('/api/candidates', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(validatedData),
  // });
  //
  // if (!response.ok) {
  //   throw new Error('Error al enviar el formulario');
  // }
  //
  // return await response.json();

  // Por ahora, solo simulamos el envío exitoso
  console.log("Datos del formulario recibidos:", validatedData);

  // Simular un delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "Formulario enviado correctamente",
    data: validatedData,
  };
}
