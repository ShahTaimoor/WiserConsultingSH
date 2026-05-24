import { cn } from "@/utils";

interface TechMarqueeProps {
  technologies: readonly string[];
  className?: string;
}

export function TechMarquee({ technologies, className }: TechMarqueeProps) {
  return (
    <div className={cn("relative overflow-hidden py-8", className)}>
      <div className="flex gap-12 animate-tech-marquee" style={{ width: "max-content" }}>
        {[...technologies, ...technologies].map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 whitespace-nowrap"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
