'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';
import { reveal, TONE, SELECTABLE, Sheet, HeadCell, RowNum, SectionHeader } from '@/components/shared/Sheet';
import { API_BASE } from '@/constants';
import {
  Code2, Cloud, Smartphone, CheckCircle2, Shield, Award, Star, TrendingUp,
  Phone, Mail, MapPin, Target, Rocket, Layers, Cpu, Lock, BarChart3, ArrowUpRight
} from 'lucide-react';

const AnimatedCounter = ({ value }: { value: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const match = value.match(/^(\d+)(.*)$/);
  const targetNumber = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    if (!isInView || targetNumber === 0) return;
    const start = 0;
    const end = targetNumber;
    const duration = 2000;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * (end - start) + start));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, targetNumber]);

  if (targetNumber === 0) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{count}{suffix}</span>;
};

// Desktop-only table cell styling for rows that collapse into a card on mobile
const SVC_CELL =
  'md:bg-white md:px-3 md:py-3 md:relative md:outline md:outline-2 md:-outline-offset-2 md:outline-transparent md:hover:outline-cyan-400 md:hover:z-10';

type LiveProject = { _id: string; title: string; link?: string };

const hostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

/* ------------------------------------------------------------------ */

const PROFILE = {
  name: 'Shah Taimoor Bin Khalid',
  title: 'CEO & Founder',
  role: 'Full Stack Engineer',
  focus: 'MERN & PERN Stack',
  photo: '/transperent.png',
  bio: 'Founder and CEO of Tech Wiser Consulting. A Full Stack Engineer specializing in MERN and PERN Stack development. Skilled in React.js, Node.js, Express.js, MongoDB, and PostgreSQL, with experience building scalable web applications, e-commerce platforms, and business management systems.',
};

// Edit these rows to keep the profile history current.
const HISTORY = [
  { period: 'Present', title: 'CEO & Founder — Tech Wiser Consulting', detail: 'Leading the company and engineering client projects hands-on, from planning to deployment.' },
  { period: '4+ Years', title: 'MERN & PERN Stack Development', detail: 'React.js, Node.js, Express.js, MongoDB and PostgreSQL.' },
  { period: 'Projects', title: 'E-commerce Platforms', detail: 'Scalable storefronts with product management, checkout and admin dashboards.' },
  { period: 'Projects', title: 'Business Management Systems', detail: 'Custom systems that streamline day-to-day operations and reporting.' },
];

type TechItem = { name: string; category: string };

const TECHNOLOGIES: TechItem[] = [
  { name: 'React & Next.js', category: 'Frontend' },
  { name: 'HTML & CSS', category: 'Markup' },
  { name: 'Tailwind & Bootstrap', category: 'Styling' },
  { name: 'shadcn/ui & Material UI', category: 'UI' },
  { name: 'Redux & Zustand', category: 'State' },
  { name: 'JavaScript & TypeScript', category: 'Languages' },
  { name: 'Zod', category: 'Validation' },
  { name: 'Node.js, Python, Laravel & PHP', category: 'Backend' },
  { name: 'GraphQL & REST', category: 'APIs' },
  { name: 'PostgreSQL, MongoDB, MySQL & Prisma', category: 'Database' },
  { name: 'React Native & Flutter', category: 'Mobile' },
  { name: 'SaaS & CRM', category: 'Platforms' },
  { name: 'Docker & CI/CD Pipelines', category: 'DevOps' },
];

const TECH_SPLIT = Math.ceil(TECHNOLOGIES.length / 2);

const TechPane = ({ items, startRow, secondary }: { items: TechItem[]; startRow: number; secondary?: boolean }) => {
  const t = TONE.light;
  // The second pane repeats the header only on desktop, where it sits beside the first.
  const headVis = secondary ? 'hidden lg:flex' : 'flex';
  const fillers = TECH_SPLIT - items.length;
  return (
    <div className={`grid grid-cols-[36px_104px_minmax(0,1fr)] sm:grid-cols-[40px_140px_minmax(0,1fr)] gap-px ${t.grid}`}>
      <HeadCell tone="light" className={headVis} />
      <HeadCell tone="light" className={headVis}>A</HeadCell>
      <HeadCell tone="light" className={headVis}>B</HeadCell>

      <RowNum tone="light" n={1} className={headVis} />
      <div className={`${headVis} ${t.cell} px-3 py-2 text-xs font-semibold ${t.title} items-center`}>Category</div>
      <div className={`${headVis} ${t.cell} px-3 py-2 text-xs font-semibold ${t.title} items-center`}>Technologies</div>

      {items.map((tech, i) => (
        <React.Fragment key={tech.category}>
          <RowNum tone="light" n={startRow + i} className="flex" />
          <div className={`${t.cell} ${SELECTABLE} px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-cyan-600`}>
            {tech.category}
          </div>
          <div className={`${t.cell} ${SELECTABLE} px-3 py-2 text-sm ${t.title}`}>{tech.name}</div>
        </React.Fragment>
      ))}

      {Array.from({ length: fillers }).map((_, i) => (
        <React.Fragment key={`filler-${i}`}>
          <RowNum tone="light" n={startRow + items.length + i} className="hidden lg:flex" />
          <div className={`hidden lg:block ${t.cell}`} />
          <div className={`hidden lg:block ${t.cell}`} />
        </React.Fragment>
      ))}
    </div>
  );
};

const SoftwareConsulting: React.FC = () => {
  const { settings } = useSettings();
  const [liveProjects, setLiveProjects] = useState<LiveProject[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/portfolios?isActive=true`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setLiveProjects(data?.success ? data.data ?? [] : []))
      .catch(() => { if (!controller.signal.aborted) setLiveProjects([]); });
    return () => controller.abort();
  }, []);

  const stats = [
    { value: String(liveProjects?.length || 3), label: 'Projects Delivered', icon: <CheckCircle2 className="w-4 h-4" /> },
    { value: '5.0', label: 'Client Rating', icon: <Star className="w-4 h-4" /> },
    { value: '4+', label: 'Years Experience', icon: <Award className="w-4 h-4" /> },
    { value: '24/7', label: 'Support Available', icon: <Shield className="w-4 h-4" /> },
  ];

  const strengths = [
    { label: 'Clean, Modern UI', detail: 'Responsive on every device' },
    { label: 'Fast & Secure', detail: 'Performance and data protection built in' },
    { label: 'Clear Communication', detail: 'Regular updates, no surprises' },
    { label: 'Long-term Support', detail: 'Maintenance after launch' },
  ];

  const services = [
    { icon: <Code2 className="w-4 h-4" />, title: 'Custom Software Development', description: 'Tailored software solutions built to your exact specifications. From web applications to enterprise systems, we deliver scalable and maintainable code.' },
    { icon: <Cloud className="w-4 h-4" />, title: 'Cloud Solutions & Migration', description: 'Modernize your infrastructure with cloud-native solutions. We help you migrate, optimize, and scale on AWS, Azure, and Google Cloud.' },
    { icon: <Smartphone className="w-4 h-4" />, title: 'Mobile App Development', description: 'Native and cross-platform mobile applications for iOS and Android. We create intuitive, high-performance apps that users love.' },
  ];

  const processSteps = [
    { step: '01', title: 'Discovery & Planning', description: 'We analyze your requirements, understand your business goals, and create a comprehensive project roadmap.', icon: <Target className="w-4 h-4" /> },
    { step: '02', title: 'Design & Architecture', description: 'Our architects design scalable solutions with modern best practices, ensuring security and performance.', icon: <Layers className="w-4 h-4" /> },
    { step: '03', title: 'Development & Testing', description: 'Agile development with continuous integration, automated testing, and regular progress updates.', icon: <Code2 className="w-4 h-4" /> },
    { step: '04', title: 'Deployment & Support', description: 'Smooth deployment to production with ongoing maintenance, monitoring, and 24/7 support.', icon: <Rocket className="w-4 h-4" /> },
  ];

  const expertise = [
    { icon: <Cpu className="w-4 h-4" />, title: 'Business Systems', description: 'POS, operations suites and management platforms' },
    { icon: <Lock className="w-4 h-4" />, title: 'Security First', description: 'Secure authentication, validation and data protection' },
    { icon: <BarChart3 className="w-4 h-4" />, title: 'Data-Driven', description: 'Dashboards and reports that support decisions' },
    { icon: <TrendingUp className="w-4 h-4" />, title: 'Built to Scale', description: 'Architecture that grows with your business' },
  ];

  const phone = [settings?.contactInfo?.phone, settings?.contactInfo?.phone2].filter(Boolean).join(' | ');
  const contactRows = [
    { key: 'Email', value: settings?.contactInfo?.email || 'taimour448@gmail.com', icon: <Mail className="w-3.5 h-3.5" /> },
    ...(phone ? [{ key: 'Phone', value: phone, icon: <Phone className="w-3.5 h-3.5" /> }] : []),
    { key: 'Address', value: settings?.contactInfo?.address || 'Peshawar, Pakistan', icon: <MapPin className="w-3.5 h-3.5" /> },
  ];

  const dark = TONE.dark;
  const light = TONE.light;
  const LETTERS = ['A', 'B', 'C', 'D'];

  return (
    <div className="relative bg-[#f4f4f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8 sm:pb-10 space-y-8 sm:space-y-10">
        {/* Hero — company first, live client work as proof */}
        <section>
          <Sheet tone="dark" cellRef="A1" formula='=COMPANY("Tech Wiser Consulting")' tab="Home">
            <div className={`grid grid-cols-1 lg:grid-cols-[40px_minmax(0,1.3fr)_minmax(0,1fr)] gap-px ${dark.grid}`}>
              <HeadCell tone="dark" className="hidden lg:flex" />
              <HeadCell tone="dark" className="hidden lg:flex">A</HeadCell>
              <HeadCell tone="dark" className="hidden lg:flex">B</HeadCell>

              <RowNum tone="dark" n={1} className="hidden lg:flex" />
              <div className={`${dark.cell} relative overflow-hidden p-5 sm:p-8 flex flex-col justify-between gap-8 lg:min-h-[440px]`}>
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom_right,black,transparent_70%)]"
                />
                <motion.div
                  aria-hidden
                  className="absolute -bottom-32 -left-20 w-[520px] h-[320px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.28),transparent_70%)]"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="relative">
                  <motion.p
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="font-mono text-[11px] tracking-[0.2em] uppercase text-cyan-400 mb-4"
                  >
                    Software House · Peshawar, Pakistan
                  </motion.p>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.05]">
                    {['Custom software,', 'e-commerce &', 'business systems.'].map((line, i) => (
                      <span key={line} className="block overflow-hidden pb-1">
                        <motion.span
                          initial={{ y: '110%' }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          className={`block ${i === 1 ? 'text-neutral-500' : ''} ${i === 2 ? 'text-cyan-400' : ''}`}
                        >
                          {line}
                        </motion.span>
                      </span>
                    ))}
                  </h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className={`mt-5 text-sm sm:text-base ${dark.body} max-w-xl leading-relaxed`}
                  >
                    We design, build and maintain web platforms, POS and operations software for growing
                    businesses — from first idea to a live product, with support after launch.
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                  className="relative flex flex-wrap gap-2"
                >
                  <a
                    href="/contact"
                    className="group inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-400 text-neutral-950 text-sm font-semibold hover:bg-cyan-300 hover:shadow-[0_0_24px_rgba(34,211,238,0.45)] transition-all"
                  >
                    Start a Project <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <a
                    href="/portfolio"
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-white/15 text-white text-sm font-semibold hover:bg-white/5 transition-colors"
                  >
                    View Projects
                  </a>
                </motion.div>
              </div>

              {/* Proof: live client projects */}
              <div className={`${dark.cell} flex flex-col`}>
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Live client projects</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                    <span className="relative flex w-1.5 h-1.5">
                      <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-60" />
                      <span className="relative w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </span>
                    Online
                  </span>
                </div>
                <div className={`grid grid-cols-[36px_minmax(0,1fr)] gap-px ${dark.grid} flex-1 content-start`}>
                  {liveProjects === null
                    ? [0, 1, 2].map((i) => (
                        <React.Fragment key={i}>
                          <RowNum tone="dark" n={i + 1} className="flex" />
                          <div className={`${dark.cell} px-3 py-3.5 space-y-2`}>
                            <div className="h-3 w-3/4 bg-white/10 animate-pulse" />
                            <div className="h-2.5 w-1/3 bg-white/5 animate-pulse" />
                          </div>
                        </React.Fragment>
                      ))
                    : liveProjects.map((project, i) => (
                        <React.Fragment key={project._id}>
                          <RowNum tone="dark" n={i + 1} className="flex" />
                          <motion.a
                            href={project.link || '/portfolio'}
                            target={project.link ? '_blank' : undefined}
                            rel={project.link ? 'noopener noreferrer' : undefined}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                            className={`group ${dark.cell} ${SELECTABLE} px-3 py-3`}
                          >
                            <span className="block text-sm font-medium text-white leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors">
                              {project.title}
                            </span>
                            {project.link && (
                              <span className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-neutral-500 group-hover:text-cyan-400 transition-colors">
                                {hostname(project.link)} <ArrowUpRight className="w-3 h-3" />
                              </span>
                            )}
                          </motion.a>
                        </React.Fragment>
                      ))}
                </div>
                <div className="grid grid-cols-2 border-t border-white/10">
                  <div className="px-4 py-3 border-r border-white/10">
                    <div className="flex gap-0.5 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                      ))}
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">5.0 client reviews</p>
                  </div>
                  <a href="/portfolio" className="group flex items-center justify-between px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors">
                    All projects
                    <ArrowUpRight className="w-4 h-4 text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </Sheet>
        </section>

        {/* Overview — stats + recognition */}
        <section>
          <SectionHeader index="00" eyebrow="Overview" title="At a Glance" />
          <Sheet tone="dark" cellRef="A2" formula="=SUMMARY(Projects, Rating, Experience, Support)" tab="Overview">
            <div className={`grid grid-cols-2 md:grid-cols-[40px_repeat(4,minmax(0,1fr))] gap-px ${dark.grid}`}>
              <HeadCell tone="dark" className="hidden md:flex" />
              {LETTERS.map((l) => <HeadCell key={l} tone="dark" className="hidden md:flex">{l}</HeadCell>)}

              <RowNum tone="dark" n={1} className="hidden md:flex" />
              {stats.map((stat, i) => (
                <motion.div key={stat.label} {...reveal(i * 0.05)} className={`${dark.cell} ${SELECTABLE} px-4 py-4 sm:py-5`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-mono text-[10px] uppercase tracking-wider ${dark.muted}`}>{stat.label}</span>
                    <span className="text-cyan-400">{stat.icon}</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-semibold text-white tracking-tight tabular-nums font-mono">
                    <AnimatedCounter value={stat.value} />
                  </div>
                </motion.div>
              ))}

              <RowNum tone="dark" n={2} className="hidden md:flex" />
              {strengths.map((item) => (
                <div key={item.label} className={`${dark.cell} ${SELECTABLE} px-4 py-3 flex items-center gap-3`}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.label}</p>
                    <p className={`text-xs ${dark.muted} truncate`}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Sheet>
        </section>

        {/* Services */}
        <section id="services" className="scroll-mt-20">
          <SectionHeader index="01" eyebrow="Services" title="Our Services" subtitle="Comprehensive software solutions tailored to your business." />
          <Sheet tone="light" cellRef="B2" formula='=FILTER(Services, Status = "Available")' tab="Services">
            <div className={`grid grid-cols-1 md:grid-cols-[40px_minmax(0,1fr)_minmax(0,2fr)_110px] gap-px ${light.grid}`}>
              <HeadCell tone="light" className="hidden md:flex" />
              {['A', 'B', 'C'].map((l) => <HeadCell key={l} tone="light" className="hidden md:flex">{l}</HeadCell>)}

              <RowNum tone="light" n={1} className="hidden md:flex" />
              {['Service', 'Description', 'Status'].map((h) => (
                <div key={h} className={`hidden md:flex ${light.cell} px-3 py-2 text-xs font-semibold ${light.title}`}>{h}</div>
              ))}

              {services.map((service, i) => (
                <motion.div key={service.title} {...reveal(i * 0.05)} className={`${light.cell} p-4 md:p-0 md:bg-transparent md:contents`}>
                  <RowNum tone="light" n={i + 2} className="hidden md:flex" />
                  <div className={`${SVC_CELL} flex items-start gap-2.5`}>
                    <span className="mt-0.5 inline-flex items-center justify-center w-7 h-7 shrink-0 bg-neutral-950 text-cyan-400">
                      {service.icon}
                    </span>
                    <h3 className={`text-sm font-semibold ${light.title} leading-snug pt-1`}>{service.title}</h3>
                  </div>
                  <p className={`${SVC_CELL} mt-2 md:mt-0 text-sm ${light.body} leading-relaxed`}>
                    {service.description}
                  </p>
                  <div className={`${SVC_CELL} mt-3 md:mt-0 flex md:justify-center items-start`}>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-2 py-1 bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Available
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Sheet>
        </section>

        {/* Process */}
        <section>
          <SectionHeader index="02" eyebrow="Process" title="How We Work" subtitle="A proven methodology that ensures quality and transparency." />
          <Sheet tone="dark" cellRef="A1:D1" formula="=SEQUENCE(Discovery → Design → Development → Deployment)" tab="Process">
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[40px_repeat(4,minmax(0,1fr))] gap-px ${dark.grid}`}>
              <HeadCell tone="dark" className="hidden lg:flex" />
              {LETTERS.map((l) => <HeadCell key={l} tone="dark" className="hidden lg:flex">{l}</HeadCell>)}

              <RowNum tone="dark" n={1} className="hidden lg:flex" />
              {processSteps.map((step, i) => (
                <motion.div key={step.step} {...reveal(i * 0.05)} className={`${dark.cell} ${SELECTABLE} p-4 sm:p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] tracking-wider text-cyan-400">STEP {step.step}</span>
                    <span className="inline-flex items-center justify-center w-7 h-7 border border-white/10 text-neutral-300">
                      {step.icon}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-1.5">{step.title}</h3>
                  <p className={`text-sm ${dark.body} leading-relaxed`}>{step.description}</p>
                </motion.div>
              ))}
            </div>
          </Sheet>
        </section>

        {/* Technologies */}
        <section>
          <SectionHeader index="03" eyebrow="Stack" title="Technologies" subtitle="Modern tools to build scalable applications." />
          <Sheet tone="light" cellRef="B2" formula="=VLOOKUP(Category, Stack, 2, FALSE)" tab="Stack">
            <div className={`grid lg:grid-cols-2 gap-px ${light.grid}`}>
              <TechPane items={TECHNOLOGIES.slice(0, TECH_SPLIT)} startRow={2} />
              <TechPane items={TECHNOLOGIES.slice(TECH_SPLIT)} startRow={2 + TECH_SPLIT} secondary />
            </div>
          </Sheet>
        </section>

        {/* Why us */}
        <section>
          <SectionHeader index="04" eyebrow="Why us" title="Why Tech Wiser Consulting" subtitle="We combine technical expertise with business acumen." />
          <Sheet tone="dark" cellRef="D2" formula="=AND(Systems, Security, Data, Scale)" tab="Why Us">
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[40px_repeat(4,minmax(0,1fr))] gap-px ${dark.grid}`}>
              <HeadCell tone="dark" className="hidden lg:flex" />
              {LETTERS.map((l) => <HeadCell key={l} tone="dark" className="hidden lg:flex">{l}</HeadCell>)}

              <RowNum tone="dark" n={1} className="hidden lg:flex" />
              {expertise.map((item, i) => (
                <motion.div key={item.title} {...reveal(i * 0.05)} className={`${dark.cell} ${SELECTABLE} p-4 sm:p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-cyan-400 text-neutral-950">
                      {item.icon}
                    </span>
                    <span className="font-mono text-[10px] tracking-wider text-cyan-400">TRUE</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-1">{item.title}</h3>
                  <p className={`text-sm ${dark.body} leading-relaxed`}>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </Sheet>
        </section>

        {/* Leadership — CEO & Founder profile + history */}
        <section>
          <SectionHeader index="05" eyebrow="Leadership" title="Meet the Founder" subtitle="Tech Wiser Consulting is led by its CEO & Founder, who plans and builds every project hands-on." />
          <Sheet tone="dark" cellRef="A1" formula={`=FOUNDER("${PROFILE.name}")`} tab="Leadership">
            <div className={`grid grid-cols-1 lg:grid-cols-[40px_minmax(0,1fr)_340px] gap-px ${dark.grid}`}>
              <HeadCell tone="dark" className="hidden lg:flex" />
              <HeadCell tone="dark" className="hidden lg:flex">A</HeadCell>
              <HeadCell tone="dark" className="hidden lg:flex">B</HeadCell>

              <RowNum tone="dark" n={1} className="hidden lg:flex" />
              <motion.div {...reveal()} className={`${dark.cell} p-5 sm:p-8 flex flex-col justify-between gap-6`}>
                <div>
                  <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-cyan-400 mb-3">
                    {PROFILE.title} · Tech Wiser Consulting
                  </p>
                  <motion.h2
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-40px' }}
                    className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05]"
                  >
                    {['Shah Taimoor', 'Bin Khalid'].map((line, i) => (
                      <span key={line} className="block overflow-hidden pb-1">
                        <motion.span
                          variants={{ hidden: { y: '110%' }, show: { y: 0 } }}
                          transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                          className={`block ${i === 1 ? 'text-neutral-500' : ''}`}
                        >
                          {line}
                        </motion.span>
                      </span>
                    ))}
                  </motion.h2>
                  <p className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {PROFILE.role} — {PROFILE.focus}
                  </p>
                  <p className={`mt-4 text-sm sm:text-base ${dark.body} max-w-xl leading-relaxed`}>{PROFILE.bio}</p>
                </div>
                <Link
                  href="/team"
                  className="group self-start inline-flex items-center gap-2 px-4 py-2.5 border border-white/15 text-white text-sm font-semibold hover:bg-white/5 transition-colors"
                >
                  Meet the Team <ArrowUpRight className="w-4 h-4 text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.div>
              <div className="relative overflow-hidden bg-[#ffffff] min-h-[380px] lg:min-h-[420px]">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(to_top,black,transparent_85%)]"
                />
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={PROFILE.photo}
                    alt={PROFILE.name}
                    fill
                    sizes="(min-width: 1024px) 340px, 100vw"
                    className="object-contain object-bottom pt-6"
                  />
                </motion.div>
                <span className="absolute left-0 bottom-0 bg-neutral-950 text-cyan-400 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5">
                  B1 · {PROFILE.title}
                </span>
                <span className="absolute right-0 bottom-0 bg-cyan-400 text-neutral-950 font-mono text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1.5">
                  shahtaimoor
                </span>
              </div>
            </div>

            {/* History */}
            <div className={`grid grid-cols-[36px_84px_minmax(0,1fr)] sm:grid-cols-[40px_120px_minmax(0,1fr)] gap-px ${dark.grid} border-t border-white/10`}>
              <RowNum tone="dark" n={2} className="flex" />
              <div className={`${dark.cell} px-3 py-2 text-xs font-semibold text-white`}>Period</div>
              <div className={`${dark.cell} px-3 py-2 text-xs font-semibold text-white`}>History</div>
              {HISTORY.map((row, i) => (
                <React.Fragment key={row.title}>
                  <RowNum tone="dark" n={i + 3} className="flex" />
                  <div className={`${dark.cell} ${SELECTABLE} px-3 py-2.5 font-mono text-[11px] uppercase tracking-wide text-cyan-400`}>
                    {row.period}
                  </div>
                  <div className={`${dark.cell} ${SELECTABLE} px-3 py-2.5 sm:flex sm:items-baseline sm:gap-3`}>
                    <p className="text-sm font-medium text-white">{row.title}</p>
                    <p className={`text-xs sm:text-sm ${dark.body}`}>{row.detail}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </Sheet>
        </section>

        {/* CTA — cyan card + white card, as in the brand stationery */}
        <motion.section {...reveal()} className="grid md:grid-cols-[1.25fr_1fr] gap-px bg-white/10 border border-white/10">
          <div className="relative flex flex-col justify-between gap-10 p-6 sm:p-8 bg-gradient-to-b from-cyan-300 via-cyan-600 to-[#f4f4f5] min-h-[280px]">
            <div>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-neutral-900/70 mb-2">06 / Start</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-950 tracking-tight">
                Let&apos;s Build Together
              </h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-900/80 max-w-md">
                Tell us about your project. We&apos;ll help turn your ideas into reality.
              </p>
            </div>
            <a
              href="/contact"
              className="self-start inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-950 text-sm font-semibold hover:bg-cyan-50 transition-colors"
            >
              Start a Project <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-white flex flex-col">
            <div className="flex items-stretch border-b border-neutral-200 font-mono text-[11px] leading-none">
              <span className="w-14 sm:w-16 shrink-0 px-2.5 py-2 border-r border-neutral-200 bg-neutral-100 text-neutral-500">A1</span>
              <span className="px-2.5 py-2 border-r border-neutral-200 italic text-cyan-500">fx</span>
              <span className="flex-1 px-2.5 py-2 text-neutral-600 truncate">=CONTACT(Tech Wiser)</span>
            </div>
            <div className={`grid grid-cols-[36px_84px_minmax(0,1fr)] sm:grid-cols-[40px_96px_minmax(0,1fr)] gap-px ${light.grid} flex-1 content-start`}>
              {contactRows.map((row, i) => (
                <React.Fragment key={row.key}>
                  <RowNum tone="light" n={i + 1} className="flex" />
                  <div className={`${light.cell} px-3 py-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-neutral-500`}>
                    <span className="text-cyan-600">{row.icon}</span>{row.key}
                  </div>
                  <div className={`${light.cell} ${SELECTABLE} px-3 py-3 text-sm text-neutral-900 break-words`}>{row.value}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default SoftwareConsulting;
