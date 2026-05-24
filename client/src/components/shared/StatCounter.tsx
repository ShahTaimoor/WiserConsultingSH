import { motion } from "framer-motion";
import { useCountUp } from "@/hooks";
import { cn } from "@/utils";

interface StatCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  className?: string;
}

export function StatCounter({ end, suffix = "", prefix = "", label, className }: StatCounterProps) {
  const { count, ref } = useCountUp(end);

  return (
    <div ref={ref} className={cn("text-center", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
      >
        {prefix}{count}{suffix}
      </motion.div>
      <p className="mt-2 text-sm sm:text-base text-slate-300">{label}</p>
    </div>
  );
}
