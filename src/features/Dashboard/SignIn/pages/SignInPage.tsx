"use client";
import { Button } from "@/core/components/shadcn/button";
import { Input } from "@/core/components/shadcn/input";
import Image from "next/image";
import Link from "next/link";
import { useSignInForm } from "../hooks/useSignInForm";
import {
  FieldGroup,
  FieldLabel,
  Field,
  FieldError,
} from "@/core/components/shadcn/field";
import {
  PasswordInput,
  PasswordInputAdornmentToggle,
  PasswordInputInput,
} from "@/core/components/shadcn/password-input";

export default function LoginPage() {
  const form = useSignInForm();

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        id="sign-in-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Image src="/logowhite.webp" width={230} height={50} alt="logo" />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Iniciar sesión en People Flow Candidates.
            </h1>
            <p className="text-sm">
              ¡Bienvenido de nuevo! Ingresa para continuar
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <FieldGroup>
                <form.Field name="email">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Correo electrónico
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="user@bdp.com"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
                        <PasswordInput>
                          <PasswordInputInput
                            placeholder="Password"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete="off"
                          />
                          <PasswordInputAdornmentToggle />
                        </PasswordInput>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
              <Button form="sign-in-form" type="submit" className="w-full">
                Iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
