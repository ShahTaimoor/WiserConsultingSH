"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Search, ArrowRight, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AppDispatch } from "@/redux/store";
import { logout } from "@/redux/slices/auth/authSlice";
import { useRouter } from "next/navigation";
import type { User as UserType } from "@/types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  navLinks: readonly { href: string; label: string }[];
  isActive: (href: string) => boolean;
}

export function MobileMenu({ isOpen, onClose, user, navLinks, isActive }: MobileMenuProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      onClose();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
    onClose();
  };

  const isAdmin = user?.role === 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="lg:hidden mx-2 sm:mx-4 mt-1.5 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl overflow-hidden max-h-[calc(100vh-5.5rem)] overflow-y-auto"
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

            <div className="pt-4 border-t border-slate-200">
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="relative">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..." className="w-full px-4 py-3 pl-10 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 bg-slate-50"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4" /> <span>Search</span>
                </button>
              </form>
            </div>

            {mounted && !user && (
              <Link href="/login" onClick={onClose}
                className="flex items-center gap-2 px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <LogIn className="w-5 h-5" /> Login
              </Link>
            )}

            {mounted && user && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                {isAdmin && (
                  <Link href="/admin" onClick={onClose}
                    className="block px-4 py-3 text-base font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-center"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-3 px-4 py-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-semibold">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-900 truncate">{user.name}</div>
                    <div className="text-xs text-slate-600 truncate">{user.email}</div>
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="w-full px-4 py-3 text-base font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
