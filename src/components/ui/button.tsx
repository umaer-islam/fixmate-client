import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-bold whitespace-nowrap transition-all outline-none select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#F26A3D] text-white hover:bg-[#F26A3D]/90 shadow-xs focus-visible:ring-[#F26A3D]/40",
        primary:
          "bg-[#F26A3D] text-white hover:bg-[#F26A3D]/90 shadow-xs focus-visible:ring-[#F26A3D]/40",
        graphite:
          "bg-[#202522] text-[#F5F3EE] hover:bg-[#202522]/90 shadow-xs focus-visible:ring-[#202522]/40",
        sage:
          "bg-[#DCE8DE] text-[#202522] hover:bg-[#DCE8DE]/80 shadow-xs focus-visible:ring-[#DCE8DE]/60",
        secondary:
          "bg-[#DCE8DE] text-[#202522] hover:bg-[#DCE8DE]/80 shadow-xs focus-visible:ring-[#DCE8DE]/60",
        outline:
          "border border-border bg-card text-foreground hover:bg-muted/70 hover:text-foreground shadow-xs focus-visible:ring-foreground/20",
        ghost:
          "hover:bg-muted hover:text-foreground focus-visible:ring-foreground/20",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/30",
        link:
          "text-[#F26A3D] underline-offset-4 hover:underline p-0 h-auto font-semibold",
      },
      size: {
        default: "h-10 px-5 text-sm rounded-xl gap-2",
        sm: "h-8 px-3.5 text-xs rounded-xl gap-1.5",
        xs: "h-6 px-2 text-[11px] rounded-lg gap-1",
        lg: "h-12 px-6 text-sm sm:text-base rounded-2xl gap-2.5",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-xs": "size-6 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

function Button({
  className,
  variant = "default",
  size = "default",
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin mr-1.5" />}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
