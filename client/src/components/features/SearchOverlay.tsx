"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchData } from "@/hooks/useSearchData";
import { SearchResultItem } from "./SearchResultItem";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { items } = useSearchData(isOpen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      onClose();
    }
  };

  const filtered = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return items.filter(i =>
      i.label.toLowerCase().includes(lowerQuery) ||
      i.keywords.some(k => k.toLowerCase().includes(lowerQuery))
    );
  }, [query, items]);

  const handleSelect = () => {
    onClose();
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-auto fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
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
                  <button 
                    type="button" 
                    onClick={() => query ? setQuery("") : onClose()} 
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors" 
                    aria-label={query ? "Clear search" : "Close search"}
                  >
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
                    <SearchResultItem 
                      key={`${item.href}-${i}`} 
                      item={item} 
                      onSelect={handleSelect} 
                    />
                  ))}
                  {filtered.length === 0 && (
                    <div className="px-6 py-8 text-center text-slate-500">
                      <p className="text-sm mb-2">No results found for &ldquo;{query}&rdquo;</p>
                      <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={handleSelect}
                        className="text-sm text-slate-900 hover:underline inline-flex items-center gap-1"
                      >
                        View all results <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                  {filtered.length > 8 && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                      <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={handleSelect}
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
