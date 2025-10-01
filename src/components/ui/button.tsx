import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transform hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "gradient-blue text-white hover:shadow-lg hover:glow-blue border border-white/20",
        destructive:
          "gradient-red text-white hover:shadow-lg hover:glow-red focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-2 border-white/30 bg-transparent text-white shadow-sm hover:bg-white/10 hover:border-white/50 dark:bg-input/30 dark:border-input dark:hover:bg-input/50 backdrop-blur-sm",
        secondary:
          "bg-secondary/80 text-secondary-foreground hover:bg-secondary border border-white/20 backdrop-blur-sm",
        ghost:
          "hover:bg-white/10 hover:text-white dark:hover:bg-accent/50 text-white/80",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        football: "gradient-red text-white hover:shadow-lg hover:glow-red font-heading text-lg tracking-wide",
      },
      size: {
        default: "h-11 px-6 py-3 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-14 rounded-xl px-8 has-[>svg]:px-6 text-lg",
        xl: "h-16 rounded-2xl px-10 has-[>svg]:px-8 text-xl",
        icon: "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
