"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { User as UserType } from "@/types";

import { MobileMenuSearch } from "./MobileMenuSearch";
import { MobileMenuUserInfo } from "./MobileMenuUserInfo";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  navLinks: readonly { href: string; label: string }[];
  isActive: (href: string) => boolean;
}

export function MobileMenu({ isOpen, onClose, user, navLinks, isActive }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-auto lg:hidden mx-2 sm:mx-4 mt-1.5 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl overflow-hidden max-h-[calc(100vh-5.5rem)] overflow-y-auto"
        >
          <div className="px-4 py-5 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={onClose}
                className={`block px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive(link.href) ? "bg-slate-900 text-white" : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" onClick={onClose}
              className="flex items-center justify-center gap-2 mt-3 px-4 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Start project <ArrowRight className="w-4 h-4" />
            </Link>

            <MobileMenuSearch onClose={onClose} />

            {mounted && !user && (
              <Link href="/login" onClick={onClose}
                className="flex items-center gap-2 mt-3 px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <LogIn className="w-5 h-5" /> Login
              </Link>
            )}

            {mounted && user && (
              <MobileMenuUserInfo user={user} onClose={onClose} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
