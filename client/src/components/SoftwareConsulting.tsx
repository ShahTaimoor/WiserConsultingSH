'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, useMotionValue, useTransform, easeInOut } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { useSettings } from '@/context/SettingsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Code2, Cloud, Smartphone, CheckCircle2, Shield, Award, TrendingUp,
  Phone, Mail, MapPin, Globe2, Target, Rocket, Layers, Cpu, Lock, BarChart3
} from 'lucide-react';

const ease = easeInOut;

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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.8, delay, ease },
});

const stagger = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

const SECTION_PAD = 'py-10 sm:py-14';
const HEADER_MB = 'mb-6 sm:mb-8';

const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) => (
  <motion.div {...stagger()} className={`text-center ${HEADER_MB}`}>
    <p className="font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase text-slate-400 mb-3">
      {eyebrow}
    </p>
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 tracking-tight text-balance">
      {title}
    </h2>
    {subtitle && (
      <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto text-balance leading-relaxed">
        {subtitle}
      </p>
    )}
  </motion.div>
);

const DESKTOP_BANNER = '/WISERBANNER.mp4';
const MOBILE_BANNER = '/mobilebanner.mp4';

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

const TechCard = ({ tech }: { tech: TechItem }) => (
  <div className="shrink-0 w-[220px] sm:w-[248px] bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 text-center hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 group">
    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-2 group-hover:text-blue-500 transition-colors">
      {tech.category}
    </p>
    <h3 className="font-semibold text-slate-900 text-xs sm:text-sm leading-snug">{tech.name}</h3>
  </div>
);

const TechMarquee = ({ items }: { items: TechItem[] }) => (
  <div className="relative overflow-hidden group/marquee -mx-6 sm:-mx-8 lg:-mx-12">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-16 bg-gradient-to-r from-slate-50 to-transparent"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-16 bg-gradient-to-l from-slate-50 to-transparent"
    />
    <div className="flex w-max gap-3 sm:gap-4 animate-tech-marquee group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:overflow-x-auto motion-reduce:w-full motion-reduce:pb-2">
      {[...items, ...items].map((tech, i) => (
        <TechCard key={`${tech.category}-${tech.name}-${i}`} tech={tech} />
      ))}
    </div>
  </div>
);

const SoftwareConsulting: React.FC = () => {
  const { settings } = useSettings();
  const isMobile = useIsMobile();
  const [bannerSrc, setBannerSrc] = useState<string | null>(null);

  useEffect(() => {
    setBannerSrc(isMobile ? MOBILE_BANNER : DESKTOP_BANNER);
  }, [isMobile]);

  const handleBannerError = useCallback(() => {
    setBannerSrc((current) => (current === DESKTOP_BANNER ? current : DESKTOP_BANNER));
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroScrollProgress = useMotionValue(0);

  useLenis(() => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const height = rect.height || 1;
    heroScrollProgress.set(Math.min(1, Math.max(0, -rect.top / height)));
  });

  const videoScale = useTransform(heroScrollProgress, [0, 1], [1, 1.15]);
  const overlayOpacity = useTransform(heroScrollProgress, [0, 1], [0.6, 0.8]);

  const stats = [
    { value: '5+', label: 'Projects Delivered', icon: <CheckCircle2 className="w-6 h-6" /> },
    { value: '98%', label: 'Client Satisfaction', icon: <TrendingUp className="w-6 h-6" /> },
    { value: '5+', label: 'Years Experience', icon: <Award className="w-6 h-6" /> },
    { value: '24/7', label: 'Support Available', icon: <Shield className="w-6 h-6" /> },
  ];

  const services = [
    { icon: <Code2 className="w-8 h-8" />, title: 'Custom Software Development', description: 'Tailored software solutions built to your exact specifications. From web applications to enterprise systems, we deliver scalable and maintainable code.', color: 'from-blue-500 to-cyan-500' },
    { icon: <Cloud className="w-8 h-8" />, title: 'Cloud Solutions & Migration', description: 'Modernize your infrastructure with cloud-native solutions. We help you migrate, optimize, and scale on AWS, Azure, and Google Cloud.', color: 'from-purple-500 to-pink-500' },
    { icon: <Smartphone className="w-8 h-8" />, title: 'Mobile App Development', description: 'Native and cross-platform mobile applications for iOS and Android. We create intuitive, high-performance apps that users love.', color: 'from-green-500 to-emerald-500' },
  ];

  const processSteps = [
    { step: '01', title: 'Discovery & Planning', description: 'We analyze your requirements, understand your business goals, and create a comprehensive project roadmap.', icon: <Target className="w-8 h-8" /> },
    { step: '02', title: 'Design & Architecture', description: 'Our architects design scalable solutions with modern best practices, ensuring security and performance.', icon: <Layers className="w-8 h-8" /> },
    { step: '03', title: 'Development & Testing', description: 'Agile development with continuous integration, automated testing, and regular progress updates.', icon: <Code2 className="w-8 h-8" /> },
    { step: '04', title: 'Deployment & Support', description: 'Smooth deployment to production with ongoing maintenance, monitoring, and 24/7 support.', icon: <Rocket className="w-8 h-8" /> },
  ];

  const expertise = [
    { icon: <Cpu className="w-6 h-6" />, title: 'Enterprise Solutions', description: 'Large-scale systems for Fortune 500 companies' },
    { icon: <Lock className="w-6 h-6" />, title: 'Security First', description: 'Bank-level security and compliance standards' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Data-Driven', description: 'Analytics and insights that drive growth' },
    { icon: <Globe2 className="w-6 h-6" />, title: 'Global Reach', description: 'Projects delivered across 30+ countries' },
  ];

  const recognitions = [
    { label: 'Design Excellence', detail: 'Premium UI craft' },
    { label: 'UX & Performance', detail: 'Fast, accessible builds' },
    { label: 'Innovation', detail: 'Modern product delivery' },
    { label: 'Client Trust', detail: '98% satisfaction rate' },
  ];

  return (
    <div className="relative">
      {/* Hero */}
      <section ref={heroRef} className="relative w-full min-h-screen flex items-end justify-center  overflow-hidden bg-slate-950">
        {bannerSrc && (
          <motion.video
            key={bannerSrc}
            src={bannerSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={handleBannerError}
            style={{ scale: videoScale }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-slate-950/60" />
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 text-center">
        </div>
      </section>

      {/* Stats */}
      <section className={`${SECTION_PAD} bg-white border-b border-slate-100`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.p
            {...stagger()}
            className="font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase text-slate-400 text-center mb-8 sm:mb-10"
          >
            By the numbers
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-slate-100">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                {...fadeUp(index * 0.08)}
                whileHover={{ y: -4 }}
                className="text-center group px-4 sm:px-6 py-2 md:py-0"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mb-4 text-blue-600 bg-blue-50 ring-1 ring-blue-100/80 group-hover:bg-blue-100 group-hover:ring-blue-200 transition-all duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-1.5 tracking-tight tabular-nums">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition — award-style trust strip */}
      <section className="py-6 sm:py-8 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {recognitions.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08, ease }}
                className="text-center lg:text-left border-l border-slate-800 pl-0 lg:pl-6 first:lg:border-l-0 first:lg:pl-0"
              >
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-amber-400 mb-3">
                  <Award className="w-4 h-4" />
                </div>
                <p className="text-sm sm:text-base font-semibold text-white tracking-tight">
                  {item.label}
                </p>
                <p className="text-xs text-slate-500 mt-1">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className={`${SECTION_PAD} bg-slate-50`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <SectionHeader
            eyebrow="01 — Services"
            title="Our Services"
            subtitle="Comprehensive software solutions tailored to your business."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                {...fadeUp(index * 0.1)}
                whileHover={{ y: -6 }}
                className="relative bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300/90 transition-all duration-500 group cursor-default overflow-hidden"
              >
                <span className="absolute top-6 right-7 font-mono text-xs text-slate-300 group-hover:text-slate-400 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-105 transition-transform duration-500 shadow-lg shadow-slate-200/50`}>
                  {service.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 pr-8">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className={`${SECTION_PAD} bg-white`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <SectionHeader
            eyebrow="02 — Process"
            title="How We Work"
            subtitle="A proven methodology that ensures quality and transparency."
          />
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div
              className="hidden lg:block absolute top-[4.5rem] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
              aria-hidden
            />
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                {...fadeUp(index * 0.08)}
                className="relative"
              >
                <div className="p-6 sm:p-7 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-slate-50/80 transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-5">
                    <div className="text-5xl sm:text-6xl font-bold text-slate-100 leading-none select-none">
                      {step.step}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className={`${SECTION_PAD} bg-slate-50`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <SectionHeader
            eyebrow="03 — Stack"
            title="Technologies"
            subtitle="Modern tools to build scalable applications."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <TechMarquee items={TECHNOLOGIES} />
          </motion.div>
        </div>
      </section>

      {/* Expertise */}
      <section className={`${SECTION_PAD} bg-white border-t border-slate-100`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <SectionHeader
            eyebrow="04 — Why us"
            title="Why Wiser Consulting"
            subtitle="We combine technical expertise with business acumen."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {expertise.map((item, index) => (
              <motion.div
                key={index}
                {...fadeUp(index * 0.08)}
                whileHover={{ y: -4 }}
                className="p-7 sm:p-8 rounded-3xl text-center border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 ring-1 ring-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-blue-600">
                  {item.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div {...stagger()} className="space-y-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Let&apos;s Build Together
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto text-balance leading-relaxed">
              Tell us about your project. We&apos;ll help turn your ideas into reality.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 bg-white text-slate-900 font-semibold rounded-full text-base hover:bg-white/90 transition-colors"
              >
                Start a Project
              </motion.a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-8 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{settings?.contactInfo?.email || "taimour448@gmail.com"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>
                  {settings?.contactInfo?.phone || ""}
                  {settings?.contactInfo?.phone && settings?.contactInfo?.phone2 && " | "}
                  {settings?.contactInfo?.phone2 || ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{settings?.contactInfo?.address || "Peshawar, Pakistan"}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SoftwareConsulting;
