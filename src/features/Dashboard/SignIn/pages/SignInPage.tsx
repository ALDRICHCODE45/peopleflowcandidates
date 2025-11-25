import { Button } from "@/core/components/shadcn/button";
import { Input } from "@/core/components/shadcn/input";
import { Label } from "@/core/components/shadcn/label";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        action=""
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
              <Label htmlFor="email" className="block text-sm">
                Usuario
              </Label>
              <Input type="email" required name="email" id="email" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd" className="text-sm">
                  Contraseña
                </Label>
                <Button variant="link" size="sm">
                  <Link
                    href="#"
                    className="link intent-info variant-ghost text-sm"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Button>
              </div>
              <Input
                type="password"
                required
                name="pwd"
                id="pwd"
                className="input sz-md variant-mixed"
              />
            </div>

            <Button className="w-full">Iniciar sesión</Button>
          </div>
        </div>
      </form>
    </section>
  );
}
