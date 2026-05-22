"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { useMemo } from "react";
import { useSettings, type SocialLinks } from "@/context/SettingsContext";

type SocialKey = keyof SocialLinks;

const SOCIAL_PLATFORMS: {
  key: SocialKey;
  label: string;
  Icon: typeof Linkedin;
}[] = [
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "instagram", label: "Instagram", Icon: Instagram },
];

const linkColumn1 = [
  { name: "Portfolio", href: "/portfolio" },
  { name: "Team", href: "/team" },
  { name: "Contact", href: "/contact" },
];

const linkColumn2 = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  const socialLinks = useMemo(
    () =>
      SOCIAL_PLATFORMS.map(({ key, label, Icon }) => ({
        key,
        label,
        Icon,
        href: settings?.socialLinks?.[key]?.trim() || "",
      })).filter((item) => item.href.length > 0),
    [settings?.socialLinks]
  );

  return (
    <footer className="bg-white text-neutral-900 border-t border-neutral-200">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 pt-12 sm:pt-16 pb-8 sm:pb-10">
        {/* Top — tagline + link columns */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4 sm:gap-5 shrink-0">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-md">
                <Image
                  src={settings?.logoUrl || "/logo.png"}
                  alt="Wiser Consulting"
                  width={32}
                  height={32}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-neutral-900 group-hover:opacity-70 transition-opacity">
                Wiser Consulting
              </span>
            </Link>
           
          </div>

          <div className="flex flex-wrap gap-x-16 sm:gap-x-24 gap-y-8">
            <ul className="space-y-2.5">
              {linkColumn1.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5">
              {linkColumn2.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hero brand wordmark */}
        <div className="mt-14 sm:mt-14 lg:mt-16 overflow-hidden">
          <p
            className="font-bold leading-[0.85] tracking-tighter text-neutral-900 select-none whitespace-nowrap"
            style={{ fontSize: "clamp(2rem, 10vw, 9rem)" }}
          >
            WISER CONSULTING
          </p>
        </div>

        {/* Bottom bar */}
        <div
          className={`mt-10 sm:mt-14 flex flex-col gap-4 sm:flex-row sm:items-center ${
            socialLinks.length > 0 ? "sm:justify-between" : "sm:justify-end"
          }`}
        >
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {socialLinks.map(({ key, label, Icon, href }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600">
            <Link href="/about" className="hover:text-neutral-900 transition-colors">
              About
            </Link>
            <Link href="/services" className="hover:text-neutral-900 transition-colors">
              Services
            </Link>
            <Link href="/privacy" className="hover:text-neutral-900 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-neutral-900 transition-colors">
              Terms
            </Link>
            <span className="text-neutral-400">
              © {currentYear}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
