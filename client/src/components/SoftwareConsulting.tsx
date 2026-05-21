'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  Code2,
  Cloud,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Shield,
  Award,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Globe2,
  Users,
  Target,
  Rocket,
  Layers,
  Cpu,
  Lock,
  BarChart3
} from 'lucide-react';

const AnimatedCounter = ({ value }: { value: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Extract number and suffix from value (e.g. "100+" -> { num: 100, suffix: "+" })
  const match = value.match(/^(\d+)(.*)$/);
  const targetNumber = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    if (!isInView || targetNumber === 0) return;
    
    let start = 0;
    const end = targetNumber;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      
      const currentValue = Math.floor(easeProgress * (end - start) + start);
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, targetNumber]);

  if (targetNumber === 0) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const SoftwareConsulting: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const stats = [
    { value: '100+', label: 'Projects Delivered', icon: <CheckCircle2 className="w-6 h-6" /> },
    { value: '98%', label: 'Client Satisfaction', icon: <TrendingUp className="w-6 h-6" /> },
    { value: '5+', label: 'Years Experience', icon: <Award className="w-6 h-6" /> },
    { value: '24/7', label: 'Support Available', icon: <Shield className="w-6 h-6" /> },
  ];

  const services = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: 'Custom Software Development',
      description: 'Tailored software solutions built to your exact specifications. From web applications to enterprise systems, we deliver scalable and maintainable code.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: 'Cloud Solutions & Migration',
      description: 'Modernize your infrastructure with cloud-native solutions. We help you migrate, optimize, and scale on AWS, Azure, and Google Cloud.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android. We create intuitive, high-performance apps that users love.',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  const technologies = [
    { name: 'React & Next.js', category: 'Frontend' },
    { name: 'Node.js & Python', category: 'Backend' },
    { name: 'PostgreSQL, MongoDB & MySQL', category: 'Database' },
    { name: 'React Native', category: 'Mobile' },
    { name: 'TypeScript & JavaScript', category: 'Languages' },
    { name: 'GraphQL & REST', category: 'APIs' },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description: 'We analyze your requirements, understand your business goals, and create a comprehensive project roadmap.',
      icon: <Target className="w-8 h-8" />,
    },
    {
      step: '02',
      title: 'Design & Architecture',
      description: 'Our architects design scalable solutions with modern best practices, ensuring security and performance.',
      icon: <Layers className="w-8 h-8" />,
    },
    {
      step: '03',
      title: 'Development & Testing',
      description: 'Agile development with continuous integration, automated testing, and regular progress updates.',
      icon: <Code2 className="w-8 h-8" />,
    },
    {
      step: '04',
      title: 'Deployment & Support',
      description: 'Smooth deployment to production with ongoing maintenance, monitoring, and 24/7 support.',
      icon: <Rocket className="w-8 h-8" />,
    },
  ];

  const expertise = [
    { icon: <Cpu className="w-6 h-6" />, title: 'Enterprise Solutions', description: 'Large-scale systems for Fortune 500 companies' },
    { icon: <Lock className="w-6 h-6" />, title: 'Security First', description: 'Bank-level security and compliance standards' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Data-Driven', description: 'Analytics and insights that drive growth' },
    { icon: <Globe2 className="w-6 h-6" />, title: 'Global Reach', description: 'Projects delivered across 30+ countries' },
  ];

  return (
    <div className="relative">
      {/* Hero Section - Modern Design */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Software_House_Banner_Video_Creation (1).mp4" type="video/mp4" />
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80"></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Building Digital
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                Excellence Together
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
              We transform your ideas into powerful software solutions. Expert consulting,
              custom development, and cutting-edge technology to drive your business forward.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <motion.a
                href="/portfolio"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg text-lg border-2 border-white/30 hover:bg-white/10 transition-all"
              >
                View Our Work
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.03,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)"
                }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer group text-center flex flex-col items-center justify-center"
              >
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl mb-4 text-blue-700 group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300 shadow-sm"
                >
                  {stat.icon}
                </motion.div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors duration-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Our Software Services
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive software solutions tailored to your business needs. From concept to deployment, we've got you covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-200 hover:border-slate-300 h-full group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Our Development Process
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              A proven methodology that ensures quality, transparency, and successful project delivery
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-5xl font-bold text-slate-200">{step.step}</div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center text-blue-700">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-200 to-cyan-200 transform -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Technologies We Master
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Cutting-edge tools and frameworks to build modern, scalable applications
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-6">
            {technologies.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-200 hover:border-blue-300 cursor-pointer group"
              >
                <div className="text-center">
                  <h3 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                    {tech.name}
                  </h3>
                  <p className="text-xs text-slate-500">{tech.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Choose Wiser Consulting
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We combine technical expertise with business acumen to deliver solutions that drive real results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {expertise.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-700">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Let's discuss your project and explore how we can help transform your ideas into powerful software solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg text-lg border-2 border-white/30 hover:bg-white/10 transition-all flex items-center gap-2"
              >
                Contact Us
              </motion.a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span className="text-sm">taimour448@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <div className="flex flex-wrap items-center gap-2">
                  <a href="tel:+923130922988" className="text-sm hover:text-white transition-colors">+92 313 0922988</a>
                  <span className="text-slate-500">|</span>
                  <a href="tel:+923065779097" className="text-sm hover:text-white transition-colors">+92 3065779097</a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">Deans Trade Center, UG 390, Peshawar</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SoftwareConsulting;
