export const glassStyles = {
  base: "backdrop-blur-md transition-all duration-300",
  glass: "bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]",
  "glass-strong": "bg-white/20 border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]",
  "glass-stronger": "bg-white/30 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
  hover: "hover:bg-white/20 hover:border-white/30 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.45)]",
  dark: "dark:bg-black/10 dark:border-white/10 dark:hover:bg-black/20 dark:hover:border-white/20",
}

export const glass = {
  base: `${glassStyles.base} ${glassStyles.glass} ${glassStyles.hover} ${glassStyles.dark}`,
  strong: `${glassStyles.base} ${glassStyles["glass-strong"]} ${glassStyles.hover} ${glassStyles.dark}`,
  stronger: `${glassStyles.base} ${glassStyles["glass-stronger"]} ${glassStyles.hover} ${glassStyles.dark}`,
} 