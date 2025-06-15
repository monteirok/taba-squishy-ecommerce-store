import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "./button"
import { Heart } from "lucide-react"

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "frosted" | "blurred"
  intensity?: "light" | "medium" | "strong"
}

const LiquidGlassCard = React.forwardRef<HTMLDivElement, LiquidGlassCardProps>(
  ({ className, variant = "default", intensity = "medium", children, ...props }, ref) => {
    const glassVariants = {
      default: "bg-white/10 backdrop-blur-md border border-white/20",
      frosted: "bg-white/20 backdrop-blur-lg border border-white/30",
      blurred: "bg-white/5 backdrop-blur-xl border border-white/10",
    }

    const intensityVariants = {
      light: "shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]",
      medium: "shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]",
      strong: "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl p-6 transition-all duration-300",
          glassVariants[variant],
          intensityVariants[intensity],
          "hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.45)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
LiquidGlassCard.displayName = "LiquidGlassCard"

// Button Showcase Component
export function ButtonShowcase() {
  const buttonVariants = [
    { name: "Default", variant: "default" },
    { name: "Destructive", variant: "destructive" },
    { name: "Outline", variant: "outline" },
    { name: "Secondary", variant: "secondary" },
    { name: "Ghost", variant: "ghost" },
    { name: "Link", variant: "link" },
  ]

  const glassButtonVariants = [
    { name: "Glass", variant: "glass" },
    { name: "Glass Strong", variant: "glass-strong" },
    { name: "Glass Stronger", variant: "glass-stronger" },
  ]

  const buttonSizes = [
    { name: "Default", size: "default" },
    { name: "Small", size: "sm" },
    { name: "Large", size: "lg" },
    { name: "Icon", size: "icon" },
  ]

  return (
    <div className="space-y-8">
      {/* Glass Buttons Section */}
      <LiquidGlassCard variant="frosted" intensity="medium" className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Glass Buttons</h3>
        <div className="flex flex-wrap gap-4">
          {glassButtonVariants.map(({ name, variant }) => (
            <Button key={variant} variant={variant as any}>
              {name}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {glassButtonVariants.map(({ name, variant }) => (
            <Button key={`${variant}-icon`} variant={variant as any} size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </LiquidGlassCard>

      {/* Standard Variants Section */}
      <LiquidGlassCard variant="blurred" intensity="light" className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Button Variants</h3>
        <div className="flex flex-wrap gap-4">
          {buttonVariants.map(({ name, variant }) => (
            <Button key={variant} variant={variant as any}>
              {name}
            </Button>
          ))}
        </div>
      </LiquidGlassCard>

      {/* Sizes Section */}
      <LiquidGlassCard variant="default" intensity="strong" className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Button Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          {buttonSizes.map(({ name, size }) => (
            <Button key={size} size={size as any} variant="glass">
              {name}
            </Button>
          ))}
        </div>
      </LiquidGlassCard>

      {/* Interactive Section */}
      <LiquidGlassCard variant="frosted" intensity="medium" className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Interactive Examples</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="glass" className="hover:scale-105 transition-transform">
            Hover Scale
          </Button>
          <Button variant="glass-strong" className="hover:rotate-3 transition-transform">
            Hover Rotate
          </Button>
          <Button variant="glass-stronger" className="hover:translate-y-1 transition-transform">
            Hover Move
          </Button>
        </div>
      </LiquidGlassCard>
    </div>
  )
}

export { LiquidGlassCard } 