'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, easeInOut } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';
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

const SoftwareConsulting: React.FC = () => {
  const { settings } = useSettings();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.8]);

  const stats = [
    { value: '100+', label: 'Projects Delivered', icon: <CheckCircle2 className="w-6 h-6" /> },
    { value: '98%', label: 'Client Satisfaction', icon: <TrendingUp className="w-6 h-6" /> },
    { value: '5+', label: 'Years Experience', icon: <Award className="w-6 h-6" /> },
    { value: '24/7', label: 'Support Available', icon: <Shield className="w-6 h-6" /> },
  ];

  const services = [
    { icon: <Code2 className="w-8 h-8" />, title: 'Custom Software Development', description: 'Tailored software solutions built to your exact specifications. From web applications to enterprise systems, we deliver scalable and maintainable code.', color: 'from-blue-500 to-cyan-500' },
    { icon: <Cloud className="w-8 h-8" />, title: 'Cloud Solutions & Migration', description: 'Modernize your infrastructure with cloud-native solutions. We help you migrate, optimize, and scale on AWS, Azure, and Google Cloud.', color: 'from-purple-500 to-pink-500' },
    { icon: <Smartphone className="w-8 h-8" />, title: 'Mobile App Development', description: 'Native and cross-platform mobile applications for iOS and Android. We create intuitive, high-performance apps that users love.', color: 'from-green-500 to-emerald-500' },
  ];

  const technologies = [
    { name: 'React & Next.js', category: 'Frontend' },
    { name: 'Node.js & Python', category: 'Backend' },
    { name: 'PostgreSQL & MongoDB', category: 'Database' },
    { name: 'React Native', category: 'Mobile' },
    { name: 'TypeScript', category: 'Languages' },
    { name: 'GraphQL & REST', category: 'APIs' },
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

  return (
    <div className="relative">
      {/* Hero */}
      <section ref={heroRef} className="relative w-full min-h-screen flex items-end justify-center  overflow-hidden bg-slate-950">
        <motion.video
          autoPlay loop muted playsInline
          style={{ scale: videoScale }}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/WISERBANNER.mp4" type="video/mp4" />
        </motion.video>
        <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-slate-950/60" />
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="/portfolio"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-full text-base hover:bg-white/90 transition-colors"
            >
              View Our Work
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                {...fadeUp(index * 0.1)}
                whileHover={{ y: -6 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 text-blue-600 bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1.5 tracking-tight">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div {...stagger()} className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              Our Services
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto text-balance">
              Comprehensive software solutions tailored to your business.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                {...fadeUp(index * 0.12)}
                whileHover={{ y: -8 }}
                className="bg-white p-8 sm:p-10 rounded-3xl hover:shadow-sm transition-all group cursor-default"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div {...stagger()} className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              How We Work
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto text-balance">
              A proven methodology that ensures quality and transparency.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                {...fadeUp(index * 0.1)}
                className="relative"
              >
                <div className="p-8 rounded-3xl hover:bg-slate-50 transition-colors h-full">
                  <div className="text-6xl font-bold text-slate-100 mb-6 leading-none">{step.step}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div {...stagger()} className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              Technologies
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto text-balance">
              Modern tools to build scalable applications.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {technologies.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05, ease }}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl hover:shadow-sm transition-all text-center cursor-default"
              >
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{tech.name}</h3>
                <p className="text-xs text-slate-400">{tech.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div {...stagger()} className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              Why Wiser Consulting
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto text-balance">
              We combine technical expertise with business acumen.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {expertise.map((item, index) => (
              <motion.div
                key={index}
                {...fadeUp(index * 0.1)}
                className="p-8 rounded-3xl text-center hover:bg-slate-50 transition-colors"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-blue-600">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
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
