"use client";

// Shared building blocks for the admin panel so every page looks the same.

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Loader2, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";

/* ---------------------------------- Layout --------------------------------- */

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-slate-200 bg-white shadow-xs", className)}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            {title && <h2 className="text-sm font-semibold text-slate-900">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-5 w-5 text-slate-500" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* --------------------------------- Buttons --------------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xs",
  secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-xs",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "icon";
  loading?: boolean;
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
        size === "md" && "h-9 px-3.5",
        size === "sm" && "h-8 px-2.5 text-xs",
        size === "icon" && "h-8 w-8",
        buttonStyles[variant],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </button>
  );
}

/* ---------------------------------- Forms ---------------------------------- */

export const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:bg-slate-50";

export function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}

/** Text input that turns entries into removable chips (press Enter or comma to add). */
export function TagInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const v = draft.trim().replace(/,$/, "");
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  };

  return (
    <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-xs focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20">
      {values.map((v) => (
        <span
          key={v}
          className="inline-flex items-center gap-1 rounded-md bg-slate-100 py-0.5 pl-2 pr-1 text-xs font-medium text-slate-700"
        >
          {v}
          <button
            type="button"
            onClick={() => onChange(values.filter((x) => x !== v))}
            className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
            aria-label={`Remove ${v}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && !draft && values.length) {
            onChange(values.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={values.length ? "" : placeholder}
        className="min-w-[8rem] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-slate-400"
      />
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 px-3.5 py-3">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-cyan-600" : "bg-slate-300"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4.5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

/* --------------------------------- Badges ---------------------------------- */

const badgeTones = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200",
} as const;

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof badgeTones; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
        badgeTones[tone]
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------ Drawer (forms) ----------------------------- */

export function FormDrawer({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  submitLabel,
  saving,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  saving?: boolean;
  children: ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-xl">
        <form onSubmit={onSubmit} className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-6 py-5 pr-12">
            <SheetTitle className="text-base font-semibold text-slate-900">{title}</SheetTitle>
            {description && (
              <SheetDescription className="mt-0.5 text-sm text-slate-500">{description}</SheetDescription>
            )}
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6" data-lenis-prevent>
            {children}
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------- Toasts & confirm dialog ------------------------- */

type Toast = { id: number; type: "success" | "error"; message: string };
type ConfirmState = {
  title: string;
  description: string;
  confirmLabel: string;
  resolve: (ok: boolean) => void;
} | null;

const FeedbackContext = createContext<{
  toast: (type: Toast["type"], message: string) => void;
  confirm: (opts: { title: string; description: string; confirmLabel?: string }) => Promise<boolean>;
} | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);

  const toast = useCallback((type: Toast["type"], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const confirm = useCallback(
    (opts: { title: string; description: string; confirmLabel?: string }) =>
      new Promise<boolean>((resolve) =>
        setConfirmState({ confirmLabel: "Delete", ...opts, resolve })
      ),
    []
  );

  const closeConfirm = (ok: boolean) => {
    confirmState?.resolve(ok);
    setConfirmState(null);
  };

  return (
    <FeedbackContext.Provider value={{ toast, confirm }}>
      {children}

      {/* Toasts */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg animate-in fade-in slide-in-from-bottom-2"
          >
            {t.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            )}
            <p className="text-sm text-slate-700">{t.message}</p>
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {confirmState && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in">
          <div role="alertdialog" aria-modal className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{confirmState.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{confirmState.description}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => closeConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => closeConfirm(true)} autoFocus>
                {confirmState.confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used inside FeedbackProvider");
  return ctx;
}
