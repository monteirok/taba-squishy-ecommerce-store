import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "strong";
  hover?: boolean;
}

export function GlassCard({ 
  children, 
  className, 
  variant = "default",
  hover = false 
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl transition-all duration-300",
        variant === "default" ? "glass" : "glass-strong",
        hover && "hover:glass-strong cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
