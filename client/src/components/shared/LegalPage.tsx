'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowLeft, Mail, MapPin, type LucideIcon } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { PageHero, Sheet, HeadCell, RowNum, SELECTABLE } from './Sheet';

export type LegalSection = { title: string; icon: LucideIcon; items: string[] };

const sectionId = (i: number) => `section-${i}`;

export function LegalPage({
  eyebrow,
  title,
  subtitle,
  sheetName,
  intro,
  sections,
  contactTitle,
  contactLead,
  lastUpdated,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  sheetName: string;
  intro: { title: string; paragraphs: string[] };
  sections: LegalSection[];
  contactTitle: string;
  contactLead: string;
  /** Date the policy text last changed — update it whenever the wording changes. */
  lastUpdated: string;
}) {
  const { settings } = useSettings();
  const lenis = useLenis();
  const [active, setActive] = useState(0);

  // Table of contents: intro, each section, then contact.
  const toc = [intro.title, ...sections.map((s) => s.title), contactTitle];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        setActive(Number((top.target as HTMLElement).dataset.index));
      },
      { rootMargin: '-15% 0px -70% 0px' }
    );
    toc.forEach((_, i) => {
      const el = document.getElementById(sectionId(i));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const jumpTo = (i: number) => {
    const target = `#${sectionId(i)}`;
    if (lenis) lenis.scrollTo(target, { offset: -80 });
    else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  };

  const email = settings?.contactInfo?.email || 'taimour448@gmail.com';
  const address = settings?.contactInfo?.address || 'Deans Trade Center, UG 400, Peshawar, Pakistan';

  const headingRow = (i: number, label: string, Icon?: LucideIcon) => (
    <div
      id={sectionId(i)}
      data-index={i}
      className="col-span-2 scroll-mt-24 flex items-center gap-2.5 bg-neutral-950 px-3 py-2.5"
    >
      <span className="font-mono text-[11px] text-cyan-400 w-6">{String(i).padStart(2, '0')}</span>
      {Icon && <Icon className="w-4 h-4 text-cyan-400" />}
      <h2 className="text-sm sm:text-base font-semibold text-white">{label}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <PageHero
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        meta={
          <div className="grid grid-cols-2 border border-white/10 font-mono text-[11px]">
            <div className="px-3 py-2 border-r border-white/10">
              <p className="text-neutral-500 uppercase tracking-wider">Updated</p>
              <p className="text-white mt-0.5">{lastUpdated}</p>
            </div>
            <div className="px-3 py-2">
              <p className="text-neutral-500 uppercase tracking-wider">Sections</p>
              <p className="text-white mt-0.5">{String(toc.length).padStart(2, '0')}</p>
            </div>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid lg:grid-cols-[250px_minmax(0,1fr)] gap-6 items-start">
        {/* Contents */}
        <aside className="lg:sticky lg:top-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 mb-3 font-mono text-[11px] uppercase tracking-wider text-neutral-500 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" /> Back to Home
          </Link>
          <div className="border border-white/10 bg-[#111214]">
            <p className="px-3 py-2 border-b border-white/10 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Contents
            </p>
            <ul className="py-1">
              {toc.map((label, i) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    className={`relative flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                      active === i ? 'text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {active === i && (
                      <motion.span
                        layoutId="legal-toc-active"
                        className="absolute inset-0 bg-white/[0.06] border-l-2 border-cyan-400"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className={`relative font-mono text-[10px] ${active === i ? 'text-cyan-400' : 'text-neutral-600'}`}>
                      {String(i).padStart(2, '0')}
                    </span>
                    <span className="relative truncate">{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Clauses */}
        <Sheet tone="light" cellRef="A1" formula={`=CLAUSES("${title}")`} tab={sheetName}>
          <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-px bg-neutral-200">
            <HeadCell tone="light" />
            <HeadCell tone="light" className="!justify-start">A</HeadCell>

            {headingRow(0, intro.title)}
            {intro.paragraphs.map((text, j) => (
              <React.Fragment key={j}>
                <RowNum tone="light" n={`0.${j + 1}`} className="flex" />
                <p className={`bg-white ${SELECTABLE} px-3 py-3 text-sm text-neutral-700 leading-relaxed`}>{text}</p>
              </React.Fragment>
            ))}

            {sections.map((section, i) => (
              <React.Fragment key={section.title}>
                {headingRow(i + 1, section.title, section.icon)}
                {section.items.map((item, j) => (
                  <React.Fragment key={j}>
                    <RowNum tone="light" n={`${i + 1}.${j + 1}`} className="flex" />
                    <div className="bg-white">
                      <motion.p
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.35, delay: j * 0.04 }}
                        className={`${SELECTABLE} px-3 py-3 text-sm text-neutral-700 leading-relaxed`}
                      >
                        {item}
                      </motion.p>
                    </div>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}

            {headingRow(toc.length - 1, contactTitle)}
            <RowNum tone="light" n={`${toc.length - 1}.1`} className="flex" />
            <p className="bg-white px-3 py-3 text-sm text-neutral-700">{contactLead}</p>
            <RowNum tone="light" n={`${toc.length - 1}.2`} className="flex" />
            <a href={`mailto:${email}`} className={`bg-white ${SELECTABLE} px-3 py-3 text-sm text-neutral-900 flex items-center gap-2 hover:text-cyan-700`}>
              <Mail className="w-4 h-4 text-cyan-600" /> {email}
            </a>
            <RowNum tone="light" n={`${toc.length - 1}.3`} className="flex" />
            <p className={`bg-white ${SELECTABLE} px-3 py-3 text-sm text-neutral-900 flex items-center gap-2`}>
              <MapPin className="w-4 h-4 text-cyan-600 shrink-0" /> {address}
            </p>
          </div>
        </Sheet>
      </div>
    </div>
  );
}
