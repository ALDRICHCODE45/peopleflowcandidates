"use client";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { TryCatch } from "@/core/shared/helpers/tryCatch";
import { useAuth } from "@/core/shared/hooks/useAuth";
import { userSignInSchema } from "../schemas/userSignInSchema";

export function useSignInForm() {
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: userSignInSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await TryCatch(login(value.email, value.password));

      if (!result.ok) {
        //Cambiar esta línea por un logger
        console.error("Error en login:", result.error);
        throw new Error("Error al iniciar sesión");
      }

      // Redirigir a la página raíz usando window.location para forzar recarga completa
      // Esto asegura que la sesión se actualice y la página raíz pueda obtener los permisos
      // La página raíz manejará la redirección basada en permisos del usuario
      //window.location.href = "/";
      router.push("/candidates");
    },
  });

  return form;
}
