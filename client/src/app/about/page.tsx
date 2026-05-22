"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  Award, 
  Rocket, 
  Heart,
  Lightbulb,
  Zap,
  Globe2,
  CheckCircle2,
  Briefcase,
  Smile,
  Calendar,
  UserCheck
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

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

const About = () => {
  const values = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation First",
      description: "We stay ahead of technology trends to deliver cutting-edge solutions."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Client-Centric",
      description: "Your success is our priority. We build solutions tailored to your needs."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Agile Excellence",
      description: "Fast delivery without compromising quality or attention to detail."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Transparency",
      description: "Clear communication and honest collaboration throughout every project."
    }
  ];

  const stats = [
    { 
      number: "100+", 
      label: "Projects Completed",
      icon: <Briefcase className="w-6 h-6" />,
    },
    { 
      number: "200+", 
      label: "Happy Clients",
      icon: <Smile className="w-6 h-6" />,
    },
    { 
      number: "5+", 
      label: "Years Experience",
      icon: <Calendar className="w-6 h-6" />,
    },
    { 
      number: "10+", 
      label: "Expert Team Members",
      icon: <UserCheck className="w-6 h-6" />,
    }
  ];

  const heroWords = ["About", "Wiser", "Consulting"];

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/back.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/70 to-slate-900/60" />
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 text-center">
          <div className="space-y-10">
            <h1 className="text-[clamp(3rem,10vw,8rem)] font-bold text-white leading-[0.85] tracking-[-0.04em]">
              {heroWords.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: i * 0.2, ease }}
                  className="block"
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6, ease }}
                className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300"
              >
                Since 2020
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease }}
              className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed text-balance"
            >
              Transforming businesses through innovative software solutions. 
              We are a trusted software house delivering excellence since 2020.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1, ease }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-full text-base hover:bg-white/90 transition-colors"
              >
                Get In Touch
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp()}>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                Our Story
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed mb-4 text-balance">
                WISER CONSULTING was founded in 2020 with a simple mission: to help businesses 
                leverage technology to achieve their goals. What started as a small team of 
                passionate developers has grown into a full-service software house.
              </p>
              <p className="text-lg text-slate-500 leading-relaxed mb-4 text-balance">
                Over the years, we've helped hundreds of companies transform their operations, 
                streamline processes, and scale their businesses through custom software solutions. 
                Our commitment to quality, innovation, and client success has made us a trusted 
                partner for businesses of all sizes.
              </p>
              <p className="text-lg text-slate-500 leading-relaxed text-balance">
                Today, we continue to push boundaries, embracing new technologies and methodologies 
                to deliver solutions that not only meet but exceed our clients' expectations.
              </p>
            </motion.div>
            <motion.div
              {...fadeUp(0.2)}
              className="relative"
            >
              <div className="bg-slate-50 rounded-3xl p-16 h-full flex items-center justify-center">
                <Globe2 className="w-32 h-32 text-slate-400" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20 bg-slate-50">
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
                  {stat.number}
                </div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div {...stagger()} className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              Our Values
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto text-balance">
              The principles that guide everything we do
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                {...fadeUp(index * 0.1)}
                whileHover={{ y: -8 }}
                className="p-8 rounded-3xl hover:bg-slate-50 transition-all group cursor-default"
              >
                <div className="text-slate-900 mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div {...stagger()} className="space-y-8">
            <Rocket className="w-16 h-16 mx-auto text-white/60" />
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Ready to Work With Us?
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto text-balance leading-relaxed">
              Let's discuss how we can help transform your business with innovative software solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 bg-white text-slate-900 font-semibold rounded-full text-base hover:bg-white/90 transition-colors"
              >
                Get In Touch
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
