"use client";

import { FileCheck, Scale, AlertCircle, CheckCircle } from "lucide-react";
import { LegalPage, type LegalSection } from "@/components/shared/LegalPage";

const SECTIONS: LegalSection[] = [
  {
    icon: FileCheck,
    title: "Acceptance of Terms",
    items: [
      "By accessing and using our website, you accept and agree to be bound by these Terms of Service.",
      "If you do not agree to these terms, please do not use our services.",
      "We reserve the right to modify these terms at any time, and such modifications will be effective immediately.",
    ],
  },
  {
    icon: Scale,
    title: "Use of Services",
    items: [
      "You agree to use our services only for lawful purposes and in accordance with these Terms.",
      "You must not use our services in any way that could damage, disable, or impair our website.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree to provide accurate and complete information when using our services.",
    ],
  },
  {
    icon: AlertCircle,
    title: "Intellectual Property",
    items: [
      "All content on this website, including text, graphics, logos, and software, is the property of TECH WISER CONSULTING.",
      "You may not reproduce, distribute, or create derivative works without our written permission.",
      "Our trademarks and service marks may not be used without our prior written consent.",
    ],
  },
  {
    icon: CheckCircle,
    title: "Limitation of Liability",
    items: [
      "We provide our services 'as is' without warranties of any kind.",
      "We are not liable for any indirect, incidental, or consequential damages.",
      "Our total liability shall not exceed the amount you paid for our services.",
      "We do not guarantee that our services will be uninterrupted or error-free.",
    ],
  },
];

export default function TermsOfService() {
  return (
    <LegalPage
      eyebrow="Legal / Terms"
      title="Terms of Service"
      subtitle="Please read these terms carefully before using our services. By using our website, you agree to these terms."
      lastUpdated="September 27, 2026"
      sheetName="Terms"
      intro={{
        title: "Agreement to Terms",
        paragraphs: [
          'These Terms of Service ("Terms") govern your access to and use of the TECH WISER CONSULTING website and services. By accessing or using our services, you agree to be bound by these Terms.',
          "If you disagree with any part of these terms, then you may not access our services.",
        ],
      }}
      sections={SECTIONS}
      contactTitle="Contact Information"
      contactLead="If you have any questions about these Terms of Service, please contact us:"
    />
  );
}
