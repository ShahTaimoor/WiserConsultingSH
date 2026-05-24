import { motion } from "framer-motion";
import { cn } from "@/utils";
import { Code2, Cloud, Smartphone, Palette, GitBranch, type LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  index: number;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Cloud,
  Smartphone,
  Palette,
  GitBranch,
  Brain: Code2,
};

export function ServiceCard({ title, description, icon, index, className }: ServiceCardProps) {
  const Icon = iconMap[icon] || Code2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative bg-white rounded-2xl p-6 sm:p-8 border border-slate-100",
        "hover:border-slate-200 hover:shadow-lg hover:-translate-y-1",
        "transition-all duration-300",
        className
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white group-hover:bg-slate-800 transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
