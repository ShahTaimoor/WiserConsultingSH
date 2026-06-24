"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Information We Collect",
      content: [
        "We collect information that you provide directly to us, such as when you create an account, submit a form, or contact us.",
        "We automatically collect certain information about your device and how you interact with our website.",
        "We may collect information from third-party sources to enhance our services."
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "How We Use Your Information",
      content: [
        "To provide, maintain, and improve our services",
        "To process your requests and transactions",
        "To send you technical notices and support messages",
        "To respond to your comments and questions",
        "To detect, prevent, and address technical issues"
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Data Security",
      content: [
        "We implement appropriate technical and organizational measures to protect your personal information.",
        "We use encryption and secure protocols to safeguard data transmission.",
        "Access to personal information is restricted to authorized personnel only."
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Your Rights",
      content: [
        "You have the right to access, update, or delete your personal information",
        "You can opt-out of certain communications from us",
        "You may request a copy of your data or data portability",
        "You have the right to object to certain processing activities"
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                TECH WISER CONSULTING ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you visit our website 
                and use our services.
              </p>
              <p className="text-slate-600 leading-relaxed">
                By using our website, you agree to the collection and use of information in accordance with this policy.
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us:
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

export default PrivacyPolicy;
