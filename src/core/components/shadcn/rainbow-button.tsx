import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/core/lib/utils";

const rainbowButtonVariants = cva(
  cn(
    "relative cursor-pointer group transition-all duration-300",
    "inline-flex items-center justify-center gap-2 shrink-0",
    "rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
    "text-sm font-medium whitespace-nowrap",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-95",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    "[&>*]:relative [&>*]:z-10"
  ),
  {
    variants: {
      variant: {
        default:
          "border-0 bg-[linear-gradient(#1e1b4b,#1e1b4b),linear-gradient(#1e1b4b_50%,rgba(30,27,75,0.6)_80%,rgba(30,27,75,0)),linear-gradient(90deg,#b6abff,#536DFF,#4F39F6,#401B98,#372AAC)] bg-[length:200%] text-white [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.125rem)_solid_transparent] animate-rainbow before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,#b6abff,#536DFF,#4F39F6,#401B98,#372AAC)] before:[filter:blur(0.75rem)] before:opacity-60",
        outline:
          "border border-input border-b-transparent bg-[linear-gradient(transparent,transparent),linear-gradient(transparent_50%,rgba(30,27,75,0.6)_80%,rgba(30,27,75,0)),linear-gradient(90deg,#b6abff,#536DFF,#4F39F6,#401B98,#372AAC)] bg-[length:200%] text-white [background-clip:padding-box,border-box,border-box] [background-origin:border-box] animate-rainbow before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,#b6abff,#536DFF,#4F39F6,#401B98,#372AAC)] before:[filter:blur(0.75rem)] before:opacity-40 hover:before:opacity-60",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-lg px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rainbowButtonVariants> {
  asChild?: boolean;
}

const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        data-slot="button"
        className={cn(rainbowButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

RainbowButton.displayName = "RainbowButton";

export { RainbowButton, rainbowButtonVariants, type RainbowButtonProps };
