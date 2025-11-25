import { ReactElement, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/core/components/shadcn/alert-dialog";
import { showToast } from "@/core/shared/helpers/CustomToast";
import { Button } from "@/core/components/shadcn/button";

interface ConfirmDialogProps {
  title: string;
  description: string;
  action: () => void | Promise<void>;
  trigger?: ReactElement;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onOpenChange?: (open: boolean) => void;
}

export const ConfirmDialog = ({
  action,
  description,
  title,
  trigger,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "destructive",
  onOpenChange,
}: ConfirmDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await action();

      // Cerrar el diálogo solo si no hay redirect
      // (los redirects lanzan errores especiales que Next.js maneja)
      setOpen(false);
      setIsLoading(false);
    } catch (error: unknown) {
      // Si es un error de redirect de Next.js, no mostrar error
      // Next.js lanza errores especiales para redirects
      const errorObj = error as { digest?: string; message?: string };
      if (
        errorObj?.digest?.startsWith("NEXT_REDIRECT") ||
        errorObj?.message?.includes("NEXT_REDIRECT")
      ) {
        // El redirect se manejará automáticamente por Next.js
        return;
      }

      // Para otros errores, mostrar mensaje
      showToast({
        type: "error",
        title: "Ocurrió un error",
        description:
          "No se pudo completar la acción. Por favor, intenta nuevamente o contacta al soporte si el problema persiste.",
      });
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? (
        <AlertDialogTrigger>{trigger}</AlertDialogTrigger>
      ) : (
        <AlertDialogTrigger>
          <Button variant="outline">{title}</Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
