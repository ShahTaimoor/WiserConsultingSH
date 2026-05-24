"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE } from "@/constants";

interface SearchItem {
  href: string;
  label: string;
  type: string;
  keywords: string[];
}

const STATIC_PAGES: SearchItem[] = [
  { href: "/", label: "Home", type: "page", keywords: ["home", "main", "landing", "software", "consulting"] },
  { href: "/portfolio", label: "Projects", type: "page", keywords: ["projects", "work", "case studies"] },
  { href: "/team", label: "Team", type: "page", keywords: ["team", "members", "staff", "experts", "developers"] },
  { href: "/contact", label: "Contact", type: "page", keywords: ["contact", "get in touch", "reach out", "email", "phone"] },
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>(STATIC_PAGES);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      try {
        const fetchJson = (url: string) => fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);
        const [servicesRes, teamRes, projectsRes] = await Promise.all([
          fetchJson(`${API_BASE}/services`),
          fetchJson(`${API_BASE}/team?isActive=true`),
          fetchJson(`${API_BASE}/portfolios?isActive=true`),
        ]);
        const dynamic: SearchItem[] = [...STATIC_PAGES];
        if (servicesRes?.success && Array.isArray(servicesRes.data)) {
          servicesRes.data.forEach((s: { title: string; description?: string }) => {
            dynamic.push({ href: "/services", label: s.title, type: "service", keywords: [s.title.toLowerCase(), ...(s.description || "").toLowerCase().split(/\s+/), "service"] });
          });
        }
        if (teamRes?.success && Array.isArray(teamRes.data)) {
          teamRes.data.forEach((m: { _id: string; name: string; role: string | string[]; skills?: string[] }) => {
            const role = Array.isArray(m.role) ? m.role[0] : m.role;
            dynamic.push({ href: `/team/${m._id}`, label: `${m.name} - ${role}`, type: "team", keywords: [m.name.toLowerCase(), role?.toLowerCase() || "", ...(m.skills || []).map((s: string) => s.toLowerCase()), "team", "member"] });
          });
        }
        if (projectsRes?.success && Array.isArray(projectsRes.data)) {
          projectsRes.data.forEach((p: { title: string; category?: string; technologies?: string[] }) => {
            dynamic.push({ href: "/portfolio", label: p.title, type: "project", keywords: [p.title.toLowerCase(), p.category?.toLowerCase() || "", ...(p.technologies || []).map((t: string) => t.toLowerCase()), "project"] });
          });
        }
        setItems(dynamic);
      } catch { /* use static */ }
    };
    fetchData();
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      onClose();
    }
  };

  const filtered = query
    ? items.filter(i =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-[4.5rem] sm:top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages, services, or content..."
                  className="w-full px-6 py-4 pr-24 text-slate-900 placeholder-slate-400 focus:outline-none text-lg"
                  autoFocus
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <button type="button" onClick={() => setQuery("")} className="p-2 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Clear">
                    <X className="w-5 h-5" />
                  </button>
                  <button type="submit" className="p-2 text-slate-600 hover:text-slate-900 transition-colors" aria-label="Search">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
              {query && (
                <div className="border-t border-slate-200 max-h-96 overflow-y-auto">
                  {filtered.slice(0, 8).map((item, i) => (
                    <Link key={`${item.href}-${i}`} href={item.href} onClick={() => { onClose(); setQuery(""); }}
                      className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{item.label}</div>
                        <div className="text-xs text-slate-500 mt-1 uppercase">{item.type}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  ))}
                  {filtered.length === 0 && (
                    <div className="px-6 py-8 text-center text-slate-500">
                      <p className="text-sm mb-2">No results found for &ldquo;{query}&rdquo;</p>
                      <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={() => { onClose(); setQuery(""); }}
                        className="text-sm text-slate-900 hover:underline inline-flex items-center gap-1"
                      >
                        View all results <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                  {filtered.length > 8 && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                      <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={() => { onClose(); setQuery(""); }}
                        className="text-sm font-semibold text-slate-900 hover:text-slate-700 inline-flex items-center gap-2"
                      >
                        View all {filtered.length} results <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
