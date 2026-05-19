"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { logout } from "@/redux/slices/auth/authSlice";
import { Menu, X, ChevronDown, Search, X as XIcon, ArrowRight, ExternalLink, LogIn, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  // Prevent hydration mismatch by only rendering user-dependent content on client
  useEffect(() => {
    setIsMounted(true);
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
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
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

  const searchableContent = [
    // Pages
    { href: "/", label: "Home", type: "page", keywords: ["home", "main", "landing", "software", "consulting"] },
    { href: "/about", label: "About Us", type: "page", keywords: ["about", "company", "story", "values", "mission"] },
    { href: "/services", label: "Services", type: "page", keywords: ["services", "development", "software", "cloud", "mobile"] },
    { href: "/portfolio", label: "Portfolio", type: "page", keywords: ["portfolio", "projects", "work", "case studies"] },
    { href: "/team", label: "Team", type: "page", keywords: ["team", "members", "staff", "experts", "developers"] },
    { href: "/contact", label: "Contact", type: "page", keywords: ["contact", "get in touch", "reach out", "email", "phone"] },
    // Services
    { href: "/services", label: "Custom Software Development", type: "service", keywords: ["custom", "software", "development", "web", "applications", "enterprise"] },
    { href: "/services", label: "Cloud Solutions & Migration", type: "service", keywords: ["cloud", "migration", "aws", "azure", "infrastructure"] },
    { href: "/services", label: "Mobile App Development", type: "service", keywords: ["mobile", "app", "ios", "android", "react native", "flutter"] },
    // Team Members
    { href: "/team/1", label: "Taimour Khan - CEO & Founder", type: "team", keywords: ["taimour", "khan", "ceo", "founder", "leadership"] },
    { href: "/team/2", label: "Abdul Sami - MERN Stack Developer", type: "team", keywords: ["abdul", "sami", "mern", "stack", "developer", "mongodb", "react", "node.js"] },
    { href: "/team/3", label: "Ahmed Ali - Senior Full Stack Developer", type: "team", keywords: ["ahmed", "ali", "full stack", "react", "node.js", "typescript"] },
    { href: "/team/4", label: "Fatima Khan - Mobile App Developer", type: "team", keywords: ["fatima", "khan", "mobile", "app", "react native", "flutter"] },
    { href: "/team/5", label: "Hassan Malik - DevOps Engineer", type: "team", keywords: ["hassan", "malik", "devops", "docker", "kubernetes"] },
    { href: "/team/6", label: "Zainab Ahmed - UI/UX Designer", type: "team", keywords: ["zainab", "ahmed", "ui", "ux", "designer", "frontend", "figma"] },
    // Projects
    { href: "/portfolio", label: "E-Commerce Platform", type: "project", keywords: ["e-commerce", "platform", "payment", "react", "node.js"] },
    { href: "/portfolio", label: "Healthcare Management System", type: "project", keywords: ["healthcare", "management", "angular", "spring boot"] },
    { href: "/portfolio", label: "Fitness Tracking App", type: "project", keywords: ["fitness", "tracking", "mobile", "react native"] },
    { href: "/portfolio", label: "Financial Analytics Dashboard", type: "project", keywords: ["financial", "analytics", "dashboard", "vue.js", "python"] },
    { href: "/portfolio", label: "Learning Management System", type: "project", keywords: ["learning", "lms", "education", "next.js"] },
    { href: "/portfolio", label: "Food Delivery App", type: "project", keywords: ["food", "delivery", "mobile", "flutter"] },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200"
          : "bg-white border-b border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden group-hover:opacity-90 transition-opacity bg-slate-100">
              <Image
                src="/logo.png"
                alt="Wiser Consulting Logo"
                width={40}
                height={40}
                className="object-contain w-full h-full"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 leading-tight">
                WISER CONSULTING
              </span>
              <span className="text-xs text-slate-600 leading-tight">
                SOFTWARE HOUSE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search Section - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            {/* Login Button - Show when user is not logged in */}
            {isMounted && !user && (
              <Link
                href="/login"
                className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                aria-label="Login"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            )}
            {isMounted && user && (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-3 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  aria-label="User menu"
                  aria-expanded={isUserDropdownOpen}
                >
                  <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {user.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserDropdownOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-2 w-56 z-20 bg-white rounded-lg border border-slate-200 shadow-lg py-1">
                      <div className="px-4 py-3 border-b border-slate-200">
                        <p className="text-sm font-medium text-slate-900">{user.name || 'User'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{user.email || 'user@example.com'}</p>
                      </div>
                      <div className="py-1">
                        {isAdmin(user.role) && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                          >
                            <span className="mr-3 w-2 h-2 rounded-full bg-green-600"></span>
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
                      <div className="border-t border-slate-200 py-1">
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
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-slate-200 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}

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
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4"
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
                        item.keywords.some((keyword) =>
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
                      item.keywords.some((keyword) =>
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
                      item.keywords.some((keyword) =>
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
                            item.keywords.some((keyword) =>
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
    </nav>
  );
};

export default Navbar;
