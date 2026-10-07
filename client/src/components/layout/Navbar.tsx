"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Menu, X, Search, ArrowRight } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { NAV_LINKS } from "@/constants";
import { SearchOverlay } from "@/components/features/SearchOverlay";
import { UserDropdown } from "@/components/features/UserDropdown";
import { MobileMenu } from "@/components/features/MobileMenu";

const ZIGZAG_PATH = "M0 14 L16 4 L32 24 L48 4 L64 24 L80 4 L96 24 L112 4 L128 14";

function NavbarOuterZigzag({ side }: { side: "left" | "right" }) {
  return (
    <div className={`hidden lg:flex flex-1 items-center min-w-[80px] max-w-[240px] h-10 pointer-events-none ${side === "left" ? "justify-end pr-2" : "justify-start pl-2"}`} aria-hidden>
      <div className={`w-full h-full ${side === "left" ? "[mask-image:linear-gradient(to_right,transparent,black_15%,black)]" : "[mask-image:linear-gradient(to_left,transparent,black_15%,black)]"}`}>
        <svg viewBox="0 0 132 28" className="w-full h-full text-neutral-700" fill="none" preserveAspectRatio="none">
          <path d={ZIGZAG_PATH} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="opacity-65" />
          <g className="text-cyan-400 motion-reduce:hidden">
            <path d="M-5 0 L5 0 M0 -4 L5 0 L0 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <animateMotion dur="3.5s" repeatCount="indefinite" path={ZIGZAG_PATH} rotate="auto" calcMode="linear" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export function Navbar() {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className={`mx-auto px-2 sm:px-4 pt-2 sm:pt-3 transition-all duration-500 ${isScrolled ? "max-w-6xl xl:max-w-7xl" : "max-w-7xl xl:max-w-[88rem]"}`}>
        <div className="flex items-center w-full gap-2 lg:gap-3">
          <NavbarOuterZigzag side="left" />

          <nav className={`relative pointer-events-auto flex items-center justify-between gap-2 sm:gap-3 h-12 sm:h-[3rem] px-2.5 sm:px-3.5 rounded-lg border transition-all duration-500 w-full lg:justify-start lg:w-auto lg:flex-1 lg:min-w-0 lg:max-w-5xl lg:mx-auto ${
            isScrolled
              ? "bg-[#f4f4f5]/95 backdrop-blur-xl border-white/10 shadow-lg shadow-black/40"
              : "bg-[#f4f4f5]/85 backdrop-blur-lg border-white/10 shadow-sm shadow-black/20"
          }`}>
            <Link href="/" className="flex items-center gap-2 shrink-0 group min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md flex items-center justify-center overflow-hidden bg-white ring-1 ring-white/10 group-hover:ring-cyan-400/60 transition-all">
                <Image src={settings?.logoUrl || "/logo.png"} alt="Tech Wiser Consulting" width={40} height={40}
                  className="object-contain w-full h-full" priority unoptimized />
              </div>
              <div className="hidden sm:flex flex-col min-w-0">
                <span className="text-sm font-bold text-white tracking-tight leading-none truncate">Tech Wiser Consulting</span>
                <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-cyan-400/80 mt-0.5">Software House</span>
              </div>
            </Link>

            <div className="hidden lg:flex flex-1 justify-center min-w-0">
              <div className="flex items-center rounded-md bg-white/[0.04] p-0.5 ring-1 ring-white/10">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href}
                    className={`relative px-3 py-1 text-sm font-medium rounded transition-all duration-300 ${
                      isActive(link.href) ? "bg-white/10 text-white shadow-[inset_0_-2px_0_#22d3ee]" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-0.5 shrink-0 ml-auto">
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors" aria-label="Search">
                <Search className="w-[18px] h-[18px]" />
              </button>
              {mounted && user?.role === 1 && <UserDropdown user={user} />}
              <Link href="/contact" className="inline-flex items-center gap-1 ml-0.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-neutral-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors">
                Start project <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden ml-auto p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md transition-colors shrink-0" aria-label="Toggle menu">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>

          <NavbarOuterZigzag side="right" />
        </div>
      </div>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} user={user?.role === 1 ? user : null} navLinks={NAV_LINKS} isActive={isActive} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
