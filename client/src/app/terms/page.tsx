"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileCheck, Scale, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const TermsOfService = () => {
  const sections = [
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using our website, you accept and agree to be bound by these Terms of Service.",
        "If you do not agree to these terms, please do not use our services.",
        "We reserve the right to modify these terms at any time, and such modifications will be effective immediately."
      ]
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Use of Services",
      content: [
        "You agree to use our services only for lawful purposes and in accordance with these Terms.",
        "You must not use our services in any way that could damage, disable, or impair our website.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You agree to provide accurate and complete information when using our services."
      ]
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Intellectual Property",
      content: [
        "All content on this website, including text, graphics, logos, and software, is the property of TECH WISER CONSULTING.",
        "You may not reproduce, distribute, or create derivative works without our written permission.",
        "Our trademarks and service marks may not be used without our prior written consent."
      ]
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Limitation of Liability",
      content: [
        "We provide our services 'as is' without warranties of any kind.",
        "We are not liable for any indirect, incidental, or consequential damages.",
        "Our total liability shall not exceed the amount you paid for our services.",
        "We do not guarantee that our services will be uninterrupted or error-free."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Please read these terms carefully before using our services. By using our website, you agree to these terms.
            </p>
            <p className="text-sm text-slate-400 mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          <div className="prose prose-slate max-w-none">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Agreement to Terms</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                These Terms of Service ("Terms") govern your access to and use of the TECH WISER CONSULTING website 
                and services. By accessing or using our services, you agree to be bound by these Terms.
              </p>
              <p className="text-slate-600 leading-relaxed">
                If you disagree with any part of these terms, then you may not access our services.
              </p>
            </div>

            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="mb-12 p-6 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-slate-900">{section.icon}</div>
                  <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li key={i} className="text-slate-600 leading-relaxed flex items-start gap-2">
                      <span className="text-slate-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            <div className="mb-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Information</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-slate-600">
                <p><strong>Email:</strong> taimour448@gmail.com</p>
                <p><strong>Address:</strong> Deans Trade Center, UG 390, Peshawar, Pakistan</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
