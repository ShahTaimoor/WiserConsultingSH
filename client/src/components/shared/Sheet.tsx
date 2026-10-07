'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, easeInOut } from 'framer-motion';

const ease = easeInOut;

export const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay, ease },
});

/* ------------------------------------------------------------------ */
/* Spreadsheet primitives — matte black / cyan / white paper palette   */
/* ------------------------------------------------------------------ */

export type Tone = 'dark' | 'light';

export const TONE: Record<Tone, {
  frame: string; grid: string; cell: string; head: string;
  border: string; title: string; body: string; muted: string;
}> = {
  dark: {
    frame: 'bg-[#ffffff] border-white/10',
    grid: 'bg-white/[0.08]',
    cell: 'bg-[#ffffff]',
    head: 'bg-[#ececee] text-neutral-500',
    border: 'border-white/10',
    title: 'text-white',
    body: 'text-neutral-400',
    muted: 'text-neutral-600',
  },
  light: {
    frame: 'bg-white border-neutral-300',
    grid: 'bg-neutral-200',
    cell: 'bg-white',
    head: 'bg-neutral-100 text-neutral-500',
    border: 'border-neutral-200',
    title: 'text-neutral-950',
    body: 'text-neutral-600',
    muted: 'text-neutral-400',
  },
};

// Formula bar text that types itself out the first time the sheet scrolls into view
export const TypedFormula = ({ text, className }: { text: string; className: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(text.length);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= text.length) window.clearInterval(id);
    }, 22);
    return () => window.clearInterval(id);
  }, [inView, text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.slice(0, shown)}
      <span aria-hidden className="inline-block w-[6px] h-3 -mb-0.5 ml-0.5 bg-cyan-400 animate-pulse" />
    </span>
  );
};

// Excel-style "selected cell" highlight
export const SELECTABLE =
  'relative transition-[outline-color] outline outline-2 -outline-offset-2 outline-transparent hover:outline-cyan-400 hover:z-10';

export const Sheet = ({
  tone,
  cellRef,
  formula,
  tab,
  tabs,
  activeTab,
  onTabChange,
  className = '',
  children,
}: {
  tone: Tone;
  cellRef: string;
  formula: string;
  tab?: string;
  /** Clickable sheet tabs, e.g. for filtering. Overrides `tab` when given. */
  tabs?: { id: string; label: string }[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  className?: string;
  children: React.ReactNode;
}) => {
  const t = TONE[tone];
  return (
    <motion.div {...reveal()} className={`border ${t.frame} overflow-hidden ${className}`}>
      {/* Formula bar */}
      <div className={`flex items-stretch border-b ${t.border} font-mono text-[11px] leading-none`}>
        <span className={`w-14 sm:w-16 shrink-0 px-2.5 py-2 border-r ${t.border} ${t.head}`}>{cellRef}</span>
        <span className={`px-2.5 py-2 border-r ${t.border} italic text-cyan-500`}>fx</span>
        <TypedFormula text={formula} className={`flex-1 min-w-0 px-2.5 py-2 truncate ${t.body}`} />
      </div>
      {children}
      {/* Sheet tabs */}
      <div className={`flex items-stretch border-t ${t.border} font-mono text-[11px] leading-none ${t.head} overflow-x-auto`}>
        {tabs ? (
          tabs.map((item) => {
            const active = item.id === activeTab;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange?.(item.id)}
                className={`relative shrink-0 px-3 py-2 border-r ${t.border} transition-colors ${
                  active ? `${t.cell} ${t.title}` : 'hover:text-cyan-500'
                }`}
              >
                {active && (
                  <motion.span layoutId={`sheet-tab-${cellRef}`} className="absolute inset-x-0 top-0 h-0.5 bg-cyan-400" />
                )}
                {item.label}
              </button>
            );
          })
        ) : (
          <span className={`px-3 py-2 border-r ${t.border} ${t.cell} ${t.title} shadow-[inset_0_2px_0_#22d3ee]`}>
            {tab}
          </span>
        )}
        <span className={`px-3 py-2 border-r ${t.border}`}>+</span>
      </div>
    </motion.div>
  );
};

export const HeadCell = ({ tone, children, className = '' }: { tone: Tone; children?: React.ReactNode; className?: string }) => (
  <div className={`${TONE[tone].head} font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 flex items-center justify-center ${className}`}>
    {children}
  </div>
);

export const RowNum = ({ tone, n, className = '' }: { tone: Tone; n: number | string; className?: string }) => (
  <div className={`${TONE[tone].head} font-mono text-[10px] items-center justify-center ${className}`}>{n}</div>
);

export const SectionHeader = ({ index, eyebrow, title, subtitle }: {
  index: string; eyebrow: string; title: string; subtitle?: string;
}) => (
  <motion.div {...reveal()} className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 sm:gap-6 mb-3">
    <div>
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-cyan-400 mb-1">
        {index} / {eyebrow}
      </p>
      <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">{title}</h2>
    </div>
    {subtitle && <p className="text-sm text-neutral-400 max-w-md sm:text-right">{subtitle}</p>}
  </motion.div>
);


/** Page-level header used by inner pages: eyebrow, masked title reveal, subtitle and an optional meta slot. */
export const PageHero = ({ eyebrow, title, subtitle, meta }: {
  eyebrow: string; title: string; subtitle?: string; meta?: React.ReactNode;
}) => (
  <header className="relative overflow-hidden border-b border-white/10">
    <div
      aria-hidden
      className="absolute inset-0 opacity-50 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
    />
    <motion.div
      aria-hidden
      className="absolute -top-24 right-0 w-[420px] h-[260px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.25),transparent_70%)]"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-[11px] tracking-[0.2em] uppercase text-cyan-400 mb-2"
        >
          {eyebrow}
        </motion.p>
        <h1 className="overflow-hidden text-3xl sm:text-5xl font-semibold text-white tracking-tight pb-1">
          <motion.span
            className="block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {title}
          </motion.span>
        </h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {meta && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="shrink-0"
        >
          {meta}
        </motion.div>
      )}
    </div>
  </header>
);
