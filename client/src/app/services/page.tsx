"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Code2, 
  Cloud, 
  Smartphone, 
  ArrowRight,
  BarChart3,
  Zap,
  Shield,
  CheckCircle2
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease, delay }
  };
}

function stagger(index: number, base = 0.08) {
  return { duration: 0.7, ease, delay: index * base };
}

const Services = () => {
  const services = [
    {
      icon: <Code2 className="w-10 h-10" />,
      title: "Custom Software Development",
      description: "Tailored software solutions built to your exact specifications. From web applications to enterprise systems, we deliver scalable and maintainable code.",
      features: [
        "Web Application Development",
        "Enterprise Software Solutions",
        "API Development & Integration",
        "Legacy System Modernization"
      ]
    },
    {
      icon: <Cloud className="w-10 h-10" />,
      title: "Cloud Solutions & Migration",
      description: "Modernize your infrastructure with cloud-native solutions. We help you migrate, optimize, and scale on AWS, Azure, and Google Cloud.",
      features: [
        "Cloud Migration Services",
        "Infrastructure as Code",
        "Cloud Architecture Design",
        "Cost Optimization"
      ]
    },
    {
      icon: <Smartphone className="w-10 h-10" />,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android devices.",
      features: [
        "iOS & Android Development",
        "React Native & Flutter",
        "Mobile UI/UX Design",
        "App Store Optimization"
      ]
    }
  ];

  const process = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "We understand your business needs, goals, and technical requirements through detailed consultations."
    },
    {
      step: "02",
      title: "Design & Architecture",
      description: "Our team designs the solution architecture and creates detailed technical specifications."
    },
    {
      step: "03",
      title: "Development & Testing",
      description: "Agile development with continuous testing ensures quality delivery at every stage."
    },
    {
      step: "04",
      title: "Deployment & Support",
      description: "We deploy your solution and provide ongoing support to ensure optimal performance."
    }
  ];

  return (
    <div className="min-h-screen bg-white">


      {/* Services Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                {...fadeUp()}
                transition={stagger(index)}
                className="bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors group"
              >
                <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center text-slate-700 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-slate-700 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-slate-900 font-semibold hover:gap-3 transition-all"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-4 px-4">
              Our Process
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
              A proven methodology that ensures successful project delivery
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                {...fadeUp()}
                transition={stagger(index)}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 h-full">
                  <div className="text-4xl font-bold text-slate-200 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">
                    {step.description}
                  </p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-slate-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
              Why Choose Us
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div {...fadeUp()} className="text-center bg-slate-50 rounded-2xl p-8">
              <Shield className="w-12 h-12 text-slate-900 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Proven Track Record
              </h3>
              <p className="text-slate-600">
                100+ successful projects delivered with 98% client satisfaction rate
              </p>
            </motion.div>
            <motion.div {...fadeUp()} transition={stagger(1)} className="text-center bg-slate-50 rounded-2xl p-8">
              <Zap className="w-12 h-12 text-slate-900 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-slate-600">
                Agile methodologies ensure rapid development without compromising quality
              </p>
            </motion.div>
            <motion.div {...fadeUp()} transition={stagger(2)} className="text-center bg-slate-50 rounded-2xl p-8">
              <BarChart3 className="w-12 h-12 text-slate-900 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Scalable Solutions
              </h3>
              <p className="text-slate-600">
                Built to grow with your business, handling increased load and complexity
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help bring your vision to life with our expert services.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors"
            >
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
