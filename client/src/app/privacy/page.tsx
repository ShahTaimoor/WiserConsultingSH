"use client";

import { Shield, Lock, Eye, FileText } from "lucide-react";
import { LegalPage, type LegalSection } from "@/components/shared/LegalPage";

const SECTIONS: LegalSection[] = [
  {
    icon: FileText,
    title: "Information We Collect",
    items: [
      "We collect information that you provide directly to us, such as when you create an account, submit a form, or contact us.",
      "We automatically collect certain information about your device and how you interact with our website.",
      "We may collect information from third-party sources to enhance our services.",
    ],
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    items: [
      "To provide, maintain, and improve our services",
      "To process your requests and transactions",
      "To send you technical notices and support messages",
      "To respond to your comments and questions",
      "To detect, prevent, and address technical issues",
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    items: [
      "We implement appropriate technical and organizational measures to protect your personal information.",
      "We use encryption and secure protocols to safeguard data transmission.",
      "Access to personal information is restricted to authorized personnel only.",
    ],
  },
  {
    icon: Shield,
    title: "Your Rights",
    items: [
      "You have the right to access, update, or delete your personal information",
      "You can opt-out of certain communications from us",
      "You may request a copy of your data or data portability",
      "You have the right to object to certain processing activities",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="Legal / Privacy"
      title="Privacy Policy"
      subtitle="Your privacy is important to us. This policy explains how we collect, use, and protect your information."
      sheetName="Privacy"
      intro={{
        title: "Introduction",
        paragraphs: [
          'TECH WISER CONSULTING ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.',
          "By using our website, you agree to the collection and use of information in accordance with this policy.",
        ],
      }}
      sections={SECTIONS}
      contactTitle="Contact Us"
      contactLead="If you have any questions about this Privacy Policy, please contact us:"
    />
  );
}
