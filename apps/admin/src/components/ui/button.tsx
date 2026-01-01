import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500 shadow-sm hover:shadow-md",
        outline: "border-2 border-primary-500 bg-transparent text-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500",
        ghost: "hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 focus-visible:ring-primary-500",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600 focus-visible:ring-secondary-500 shadow-sm hover:shadow-md",
        success: "bg-success-500 text-white hover:bg-success-600 focus-visible:ring-success-500 shadow-sm hover:shadow-md",
        warning: "bg-warning-500 text-white hover:bg-warning-600 focus-visible:ring-warning-500 shadow-sm hover:shadow-md",
        error: "bg-error-500 text-white hover:bg-error-600 focus-visible:ring-error-500 shadow-sm hover:shadow-md",
      },
      size: {
        default: "h-11 px-5 py-2.5 text-base",
        sm: "h-9 rounded-md px-4 text-sm",
        lg: "h-14 rounded-xl px-8 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

