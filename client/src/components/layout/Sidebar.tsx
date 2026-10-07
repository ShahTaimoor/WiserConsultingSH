"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, FolderKanban, Users, Mail, Search, ArrowUpRight, LogOut,
  ShieldCheck, FileText, PanelLeftClose, PanelLeftOpen, Menu, X, LayoutDashboard,
} from "lucide-react";
import { AppDispatch, RootState } from "@/redux/store";
import { logout } from "@/redux/slices/auth/authSlice";
import { useSettings } from "@/context/SettingsContext";
import { SearchOverlay } from "@/components/features/SearchOverlay";

const EXPANDED_W = 248;
const COLLAPSED_W = 72;
const STORAGE_KEY = "sidebar-collapsed";

const PRIMARY_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/portfolio", label: "Projects", icon: FolderKanban },
  { href: "/team", label: "Team", icon: Users },
  { href: "/contact", label: "Contact", icon: Mail },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
  { href: "/terms", label: "Terms of Service", icon: FileText },
];

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
};

type NavLinkDef = (typeof PRIMARY_LINKS)[number];

function NavItem({
  link, index, active, collapsed, indicatorId, onNavigate,
}: {
  link: NavLinkDef; index: number; active: boolean; collapsed: boolean; indicatorId: string; onNavigate?: () => void;
}) {
  const Icon = link.icon;
  return (
    <motion.li variants={itemVariants}>
      <Link
        href={link.href}
        onClick={onNavigate}
        title={collapsed ? link.label : undefined}
        className={`group relative flex items-center gap-3 h-10 px-3 text-sm transition-colors ${
          active ? "text-white" : "text-neutral-400 hover:text-white"
        } ${collapsed ? "justify-center" : ""}`}
      >
        {active && (
          <motion.span
            layoutId={indicatorId}
            className="absolute inset-0 bg-white/[0.06] border-l-2 border-cyan-400"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          />
        )}
        <span className="absolute inset-0 bg-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon className={`relative w-[18px] h-[18px] shrink-0 transition-colors ${active ? "text-cyan-400" : "group-hover:text-cyan-400"}`} />
        {!collapsed && (
          <>
            <span className="relative flex-1 truncate font-medium">{link.label}</span>
            <span className="relative font-mono text-[10px] text-neutral-600 group-hover:text-neutral-400 transition-colors">
              {String(index + 1).padStart(2, "0")}
            </span>
          </>
        )}
      </Link>
    </motion.li>
  );
}

function SidebarBody({
  collapsed, onToggleCollapse, onOpenSearch, onNavigate, indicatorId,
}: {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  onOpenSearch: () => void;
  onNavigate?: () => void;
  indicatorId: string;
}) {
  const { settings } = useSettings();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
    onNavigate?.();
  };

  const sectionLabel = (text: string) =>
    collapsed ? (
      <div className="mx-3 my-2 h-px bg-white/10" />
    ) : (
      <p className="px-3 mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">{text}</p>
    );

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className={`flex items-center h-16 border-b border-white/10 ${collapsed ? "justify-center px-2" : "gap-2.5 px-4"}`}>
        <Link href="/" onClick={onNavigate} className="flex items-center gap-2.5 min-w-0 group">
          <motion.div
            whileHover={{ rotate: -6, scale: 1.05 }}
            className="w-9 h-9 shrink-0 rounded-md bg-white overflow-hidden ring-1 ring-white/10 group-hover:ring-cyan-400/60 transition-shadow"
          >
            <Image src={settings?.logoUrl || "/logo.png"} alt="Tech Wiser Consulting" width={36} height={36}
              className="object-contain w-full h-full" priority unoptimized />
          </motion.div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white leading-none truncate">Tech Wiser</p>
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-cyan-400/80 mt-1">Software House</p>
            </div>
          )}
        </Link>
      </div>

      {/* Search */}
      <div className="p-3">
        <button
          onClick={onOpenSearch}
          title={collapsed ? "Search" : undefined}
          className={`group flex w-full items-center gap-2.5 h-9 border border-white/10 bg-white/[0.03] text-neutral-500 hover:text-white hover:border-cyan-400/50 transition-colors ${
            collapsed ? "justify-center" : "px-3"
          }`}
        >
          <Search className="w-4 h-4 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left text-sm">Search…</span>
              <kbd className="font-mono text-[10px] px-1.5 py-0.5 border border-white/10 text-neutral-500">Ctrl K</kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 pb-3">
        {sectionLabel("Navigate")}
        <motion.ul variants={listVariants} initial="hidden" animate="show" className="space-y-0.5">
          {PRIMARY_LINKS.map((link, i) => (
            <NavItem key={link.href} link={link} index={i} active={isActive(link.href)}
              collapsed={collapsed} indicatorId={indicatorId} onNavigate={onNavigate} />
          ))}
        </motion.ul>

        <div className="mt-5">
          {sectionLabel("Legal")}
          <motion.ul variants={listVariants} initial="hidden" animate="show" className="space-y-0.5">
            {LEGAL_LINKS.map((link, i) => (
              <NavItem key={link.href} link={link} index={PRIMARY_LINKS.length + i} active={isActive(link.href)}
                collapsed={collapsed} indicatorId={indicatorId} onNavigate={onNavigate} />
            ))}
          </motion.ul>
        </div>
      </nav>

      {/* Footer: CTA + account */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2 px-1 pb-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-60" />
              <span className="relative w-2 h-2 rounded-full bg-cyan-400" />
            </span>
            Available for projects
          </div>
        )}

        <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/contact"
            onClick={onNavigate}
            title={collapsed ? "Start a Project" : undefined}
            className={`flex items-center gap-2 h-10 bg-cyan-400 text-neutral-950 text-sm font-semibold hover:bg-cyan-300 transition-colors ${
              collapsed ? "justify-center" : "justify-between px-3"
            }`}
          >
            {!collapsed && <span>Start a Project</span>}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {mounted && user?.role === 1 && (
          <div className={`flex items-center gap-2.5 ${collapsed ? "flex-col" : "px-1"}`}>
            <div className="w-8 h-8 shrink-0 rounded-full bg-cyan-400 flex items-center justify-center text-[11px] font-semibold text-neutral-950">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white truncate">{user.name}</p>
                <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
              </div>
            )}
            {user.role === 1 && (
              <Link href="/admin" onClick={onNavigate} title="Admin Dashboard"
                className="p-1.5 text-neutral-400 hover:text-cyan-400 transition-colors">
                <LayoutDashboard className="w-4 h-4" />
              </Link>
            )}
            <button onClick={handleLogout} title="Logout"
              className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex w-full items-center gap-2.5 h-8 text-xs text-neutral-500 hover:text-white transition-colors ${
              collapsed ? "justify-center" : "px-3"
            }`}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <><PanelLeftClose className="w-4 h-4" /> Collapse</>}
          </button>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch { /* storage unavailable */ }
  }, []);

  // Content offset is driven by a CSS variable so the layout can follow the sidebar width.
  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-w", `${collapsed ? COLLAPSED_W : EXPANDED_W}px`);
  }, [collapsed]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleCollapse = useCallback(() => {
    setCollapsed((c) => {
      try { localStorage.setItem(STORAGE_KEY, c ? "0" : "1"); } catch { /* storage unavailable */ }
      return !c;
    });
  }, []);

  const openSearch = useCallback(() => {
    setMobileOpen(false);
    setSearchOpen(true);
  }, []);

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="hidden lg:block fixed inset-y-0 left-0 z-40 bg-[#f4f4f5] border-r border-white/10 overflow-hidden"
      >
        <SidebarBody collapsed={collapsed} onToggleCollapse={toggleCollapse}
          onOpenSearch={openSearch} indicatorId="sidebar-active-desktop" />
      </motion.aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed inset-x-0 top-0 z-40 h-14 flex items-center justify-between px-3 bg-[#f4f4f5]/95 backdrop-blur border-b border-white/10">
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu"
          className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="font-semibold text-sm text-white tracking-tight">
          Tech Wiser <span className="text-cyan-400">Consulting</span>
        </Link>
        <button onClick={openSearch} aria-label="Search"
          className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-[272px] max-w-[85vw] bg-[#f4f4f5] border-r border-white/10"
            >
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"
                className="absolute right-2 top-4 z-10 p-2 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <SidebarBody collapsed={false} onOpenSearch={openSearch}
                onNavigate={() => setMobileOpen(false)} indicatorId="sidebar-active-mobile" />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
