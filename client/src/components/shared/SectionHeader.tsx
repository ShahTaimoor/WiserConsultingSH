import { motion } from "framer-motion";
import { cn } from "@/utils";
import { FADE_UP } from "@/constants";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  title,
  subtitle,
  className,
  titleClassName,
  align = "center",
}: SectionHeaderProps) {
  return (
    <motion.div
      {...FADE_UP()}
      className={cn(
        "max-w-3xl mb-12",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <h2 className={cn(
        "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900",
        titleClassName
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
