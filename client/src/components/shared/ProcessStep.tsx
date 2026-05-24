import { motion } from "framer-motion";
import { cn } from "@/utils";

interface ProcessStepProps {
  step: number;
  title: string;
  description: string;
  index: number;
  isLast?: boolean;
  className?: string;
}

export function ProcessStep({ step, title, description, index, isLast, className }: ProcessStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative flex gap-6", className)}
    >
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-bold shrink-0">
          {step}
        </div>
        {!isLast && <div className="mt-2 w-0.5 flex-1 bg-slate-200" />}
      </div>
      <div className="pb-8">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
    </motion.div>
  );
}
