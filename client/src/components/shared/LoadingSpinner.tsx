import { cn } from "@/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizes = { sm: "h-5 w-5", md: "h-10 w-10", lg: "h-14 w-14" };

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn("animate-spin rounded-full border-2 border-slate-200 border-t-slate-900", sizes[size])} />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );
}
