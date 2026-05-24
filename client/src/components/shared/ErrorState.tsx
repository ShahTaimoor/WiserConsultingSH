import { cn } from "@/utils";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  className?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Something went wrong", className, onRetry }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
      <p className="text-sm text-red-600 mb-4 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
