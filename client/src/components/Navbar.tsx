"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { logout } from "@/redux/slices/auth/authSlice";
import { Menu, X, ChevronDown, Search, X as XIcon, ArrowRight, ExternalLink, LogIn, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";

/** Single continuous zigzag: right → up → down → up → down (repeats) */
const ZIGZAG_PATH =
  "M0 14 L16 4 L32 24 L48 4 L64 24 L80 4 L96 24 L112 4 L128 14";

const NavbarOuterZigzag = ({ side }: { side: "left" | "right" }) => (
  <div
    className={`hidden lg:flex flex-1 items-center min-w-[80px] max-w-[240px] h-10 pointer-events-none ${
      side === "left" ? "justify-end pr-2" : "justify-start pl-2"
    }`}
    aria-hidden
  >
    <div
      className={`w-full h-full ${
        side === "left"
          ? "[mask-image:linear-gradient(to_right,transparent,black_15%,black)]"
          : "[mask-image:linear-gradient(to_left,transparent,black_15%,black)]"
      }`}
    >
      <svg
        viewBox="0 0 132 28"
        className="w-full h-full text-slate-400"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* One unbroken zigzag line */}
        <path
          d={ZIGZAG_PATH}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="opacity-65"
        />
        {/* Arrow moves along the single path: up → down → up → down, left to right */}
        <g className="text-slate-700 motion-reduce:hidden">
          <path
            d="M-5 0 L5 0 M0 -4 L5 0 L0 4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <animateMotion
            dur="3.5s"
            repeatCount="indefinite"
            path={ZIGZAG_PATH}
            rotate="auto"
            calcMode="linear"
          />
        </g>
      </svg>
    </div>
  </div>
);

const Navbar = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Static fallback pages for immediate searchability
  const staticPages = [
    { href: "/", label: "Home", type: "page", keywords: ["home", "main", "landing", "software", "consulting"] },

    { href: "/portfolio", label: "Portfolio", type: "page", keywords: ["portfolio", "projects", "work", "case studies"] },
    { href: "/team", label: "Team", type: "page", keywords: ["team", "members", "staff", "experts", "developers"] },
    { href: "/contact", label: "Contact", type: "page", keywords: ["contact", "get in touch", "reach out", "email", "phone"] },
  ];

  const [searchableContent, setSearchableContent] = useState<any[]>(staticPages);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Prevent hydration mismatch by only rendering user-dependent content on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch live search data from DB on mount
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

        // Fetch services, team, and portfolios in parallel
        const fetchJson = (url: string) =>
          fetch(url)
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null);

        const [servicesRes, teamRes, portfoliosRes] = await Promise.all([
          fetchJson(`${API_URL}/services`),
          fetchJson(`${API_URL}/team?isActive=true`),
          fetchJson(`${API_URL}/portfolios?isActive=true`),
        ]);

        const dynamicContent: any[] = [...staticPages];

        if (servicesRes && servicesRes.success && Array.isArray(servicesRes.data)) {
          servicesRes.data.forEach((service: any) => {
            dynamicContent.push({
              href: `/services`,
              label: service.title,
              type: "service",
              keywords: [
                service.title.toLowerCase(),
                ...(service.description ? service.description.toLowerCase().split(/\s+/) : []),
                "service", "solutions"
              ]
            });
          });
        }

        if (teamRes && teamRes.success && Array.isArray(teamRes.data)) {
          teamRes.data.forEach((member: any) => {
            const roleStr = Array.isArray(member.role) ? member.role[0] : member.role;
            dynamicContent.push({
              href: `/team/${member._id}`,
              label: `${member.name} - ${roleStr}`,
              type: "team",
              keywords: [
                member.name.toLowerCase(),
                roleStr?.toLowerCase() || "",
                ...(member.skills || []).map((s: string) => s.toLowerCase()),
                ...(member.expertise || []).map((e: string) => e.toLowerCase()),
                "team", "member", "expert", "developer"
              ]
            });
          });
        }

        if (portfoliosRes && portfoliosRes.success && Array.isArray(portfoliosRes.data)) {
          portfoliosRes.data.forEach((project: any) => {
            dynamicContent.push({
              href: `/portfolio`,
              label: project.title,
              type: "project",
              keywords: [
                project.title.toLowerCase(),
                project.category?.toLowerCase() || "",
                ...(project.technologies || []).map((t: string) => t.toLowerCase()),
                "project", "work", "portfolio"
              ]
            });
          });
        }

        setSearchableContent(dynamicContent);
      } catch {
        // API unavailable — static pages remain searchable
      }
    };

    fetchSearchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  // Helper function to check if user is admin
  const isAdmin = (role: string | number | undefined): boolean => {
    return role === 1 || role === '1' || role === 'admin';
  };

  const navLinks = [
    { href: "/", label: "Home" },

    { href: "/portfolio", label: "Portfolio" },
    { href: "/team", label: "Team" },
    { href: "/contact", label: "Contact" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
      setIsOpen(false); // Close mobile menu if open
    }
  };

  // Live dynamic searchableContent loaded on mount

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div
        className={`mx-auto px-2 sm:px-4 pt-2 sm:pt-3 transition-all duration-500 ${
          isScrolled ? "max-w-6xl xl:max-w-7xl" : "max-w-7xl xl:max-w-[88rem]"
        }`}
      >
        <div className="flex items-center w-full gap-2 lg:gap-3">
          <NavbarOuterZigzag side="left" />

          <nav
            className={`relative pointer-events-auto flex items-center justify-between gap-2 sm:gap-3 h-12 sm:h-[3rem] px-2.5 sm:px-3.5 rounded-2xl border transition-all duration-500 w-full lg:justify-start lg:w-auto lg:flex-1 lg:min-w-0 lg:max-w-5xl lg:mx-auto ${
              isScrolled
                ? "bg-white/95 backdrop-blur-xl border-slate-200/90 shadow-lg shadow-slate-900/5"
                : "bg-white/80 backdrop-blur-lg border-slate-200/60 shadow-sm shadow-slate-900/[0.03]"
            }`}
          >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center overflow-hidden ring-1 ring-slate-200/80 group-hover:ring-slate-300 transition-all">
              <Image
                src={settings?.logoUrl || "/logo.png"}
                alt="Wiser Consulting"
                width={40}
                height={40}
                className="object-contain w-full h-full"
                priority
                unoptimized
              />
            </div>
            <div className="hidden sm:flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 tracking-tight leading-none truncate">
                Wiser Consulting
              </span>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-slate-400 mt-0.5">
                Software House
              </span>
            </div>
          </Link>

          {/* Desktop Navigation — centered in remaining space */}
          <div className="hidden lg:flex flex-1 justify-center min-w-0">
            <div className="flex items-center rounded-full bg-slate-100/90 p-0.5 ring-1 ring-slate-200/50">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1 text-sm font-medium rounded-full transition-all duration-300 ${
                  isActive(link.href)
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
            </div>
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-0.5 shrink-0 ml-auto">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            {isMounted && !user && (
              <Link
                href="/login"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Login"
              >
                <LogIn className="w-[18px] h-[18px]" />
              </Link>
            )}
            {isMounted && user && (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400/30"
                  aria-label="User menu"
                  aria-expanded={isUserDropdownOpen}
                >
                  <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                      isUserDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isUserDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserDropdownOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-2 w-56 z-20 bg-white rounded-2xl border border-slate-200 shadow-xl py-1 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-sm font-medium text-slate-900 truncate">{user.name || "User"}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{user.email || "user@example.com"}</p>
                      </div>
                      <div className="py-1">
                        {isAdmin(user.role) && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                          >
                            <span className="mr-3 w-2 h-2 rounded-full bg-green-600" />
                            <span>Admin</span>
                          </Link>
                        )}
                        <button
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="mr-3 h-4 w-4" />
                          <span>Profile</span>
                        </button>
                      </div>
                      <div className="border-t border-slate-100 py-1">
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 ml-0.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-colors"
            >
              Start project
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile menu button — right side */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden ml-auto p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          </nav>

          <NavbarOuterZigzag side="right" />
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden pointer-events-auto mx-2 sm:mx-4 mt-1.5 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl overflow-hidden max-h-[calc(100vh-5.5rem)] overflow-y-auto"
          >
            <div className="px-4 py-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive(link.href)
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 mt-3 px-4 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Start project
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Mobile Search */}
              <div className="pt-4 border-t border-slate-200">
                <form onSubmit={handleSearch} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full px-4 py-3 pl-10 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 bg-slate-50"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </form>
              </div>
              {/* Mobile Login Button - Show when user is not logged in */}
              {isMounted && !user && (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </Link>
              )}

              {isMounted && user && (
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  {/* Admin Button for Mobile - Only show for admin users */}
                  {isAdmin(user.role) && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-base font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-center"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="flex items-center space-x-3 px-4 py-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {user.name}
                      </div>
                      <div className="text-xs text-slate-600 truncate">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
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

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm pointer-events-auto"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-[4.5rem] sm:top-24 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 pointer-events-auto"
            >
              <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pages, services, or content..."
                    className="w-full px-6 py-4 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none text-lg"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-slate-600 hover:text-slate-900 transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-16 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Close search"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </form>
                {searchQuery && (
                  <div className="border-t border-slate-200 max-h-96 overflow-y-auto">
                    {searchableContent
                      .filter((item) =>
                        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.keywords.some((keyword: string) =>
                          keyword.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                      )
                      .slice(0, 8)
                      .map((item, index) => (
                        <Link
                          key={`${item.href}-${index}`}
                          href={item.href}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="block px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-slate-900">{item.label}</div>
                              <div className="text-xs text-slate-500 mt-1 uppercase">{item.type}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </Link>
                      ))}
                    {searchableContent.filter((item) =>
                      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.keywords.some((keyword: string) =>
                        keyword.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                    ).length === 0 && (
                        <div className="px-6 py-8 text-center text-slate-500">
                          <div className="text-sm mb-2">No results found for "{searchQuery}"</div>
                          <Link
                            href={`/search?q=${encodeURIComponent(searchQuery)}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="text-sm text-slate-900 hover:underline inline-flex items-center gap-1"
                          >
                            View all results
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    {searchableContent.filter((item) =>
                      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.keywords.some((keyword: string) =>
                        keyword.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                    ).length > 8 && (
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                          <Link
                            href={`/search?q=${encodeURIComponent(searchQuery)}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="text-sm font-semibold text-slate-900 hover:text-slate-700 inline-flex items-center gap-2"
                          >
                            View all {searchableContent.filter((item) =>
                              item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.keywords.some((keyword: string) =>
                                keyword.toLowerCase().includes(searchQuery.toLowerCase())
                              )
                            ).length} results
                            <ArrowRight className="w-4 h-4" />
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
    </header>
  );
};

export default Navbar;
