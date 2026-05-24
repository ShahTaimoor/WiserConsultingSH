"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  FileText, 
  Users, 
  Briefcase, 
  Code2,
  ArrowRight,
  ExternalLink
} from "lucide-react";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);

  // All searchable content loaded dynamically from API
  const [allContent, setAllContent] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      const staticPages = [
        { 
          type: "page", 
          title: "Home", 
          description: "Main landing page with software consulting services",
          href: "/",
          keywords: ["home", "main", "landing", "software", "consulting", "solutions"]
        },
        { 
          type: "page", 
          title: "About Us", 
          description: "Learn about WISER CONSULTING, our story, values, and mission",
          href: "/about",
          keywords: ["about", "company", "story", "values", "mission", "team", "history"]
        },
        { 
          type: "page", 
          title: "Services", 
          description: "Our software development services including custom development, cloud solutions, and mobile apps",
          href: "/services",
          keywords: ["services", "development", "software", "cloud", "mobile", "solutions", "consulting"]
        },
        { 
          type: "page", 
          title: "Projects", 
          description: "View our completed projects and case studies",
          href: "/portfolio",
          keywords: ["projects", "work", "case studies", "examples"]
        },
        { 
          type: "page", 
          title: "Team", 
          description: "Meet our expert team members and developers",
          href: "/team",
          keywords: ["team", "members", "staff", "experts", "developers", "professionals"]
        },
        { 
          type: "page", 
          title: "Contact", 
          description: "Get in touch with us for your software development needs",
          href: "/contact",
          keywords: ["contact", "get in touch", "reach out", "email", "phone", "address"]
        }
      ];

      try {
        setLoadingData(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        const [servicesRes, teamRes, portfoliosRes] = await Promise.all([
          fetch(`${API_URL}/services`).then(res => res.ok ? res.json() : null),
          fetch(`${API_URL}/team?isActive=true`).then(res => res.ok ? res.json() : null),
          fetch(`${API_URL}/portfolios?isActive=true`).then(res => res.ok ? res.json() : null),
        ]);

        const merged: any[] = [...staticPages];

        if (servicesRes && servicesRes.success && Array.isArray(servicesRes.data)) {
          servicesRes.data.forEach((service: any) => {
            merged.push({
              type: "service",
              title: service.title,
              description: service.description || "Tailored software solution built to your specifications.",
              href: `/services`,
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
            const roleStr = Array.isArray(member.role) ? member.role.join(", ") : member.role;
            merged.push({
              type: "team",
              title: member.name,
              description: `${roleStr} - ${member.bio || "Expert team member at Wiser Consulting."}`,
              href: `/team/${member._id}`,
              keywords: [
                member.name.toLowerCase(),
                roleStr?.toLowerCase() || "",
                ...(member.skills || []).map((s: string) => s.toLowerCase()),
                ...(member.expertise || []).map((e: string) => e.toLowerCase()),
                "team", "member"
              ]
            });
          });
        }

        if (portfoliosRes && portfoliosRes.success && Array.isArray(portfoliosRes.data)) {
          portfoliosRes.data.forEach((project: any) => {
            merged.push({
              type: "project",
              title: project.title,
              description: project.description || "A completed client project highlighting our engineering excellence.",
              href: `/portfolio`,
              keywords: [
                project.title.toLowerCase(),
                project.category?.toLowerCase() || "",
                ...(project.technologies || []).map((t: string) => t.toLowerCase()),
                "project", "portfolio"
              ]
            });
          });
        }

        setAllContent(merged);
      } catch (err) {
        console.error("Error loading searchable content:", err);
        setAllContent(staticPages);
      } finally {
        setLoadingData(false);
      }
    };

    fetchAllData();
  }, []);

  // Filter results based on search query
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const queryLower = searchQuery.toLowerCase();
    return allContent.filter(item => {
      const titleMatch = item.title?.toLowerCase().includes(queryLower);
      const descMatch = item.description?.toLowerCase().includes(queryLower);
      const keywordMatch = item.keywords?.some((keyword: string) => 
        keyword.toLowerCase().includes(queryLower)
      );
      return titleMatch || descMatch || keywordMatch;
    });
  }, [searchQuery, allContent]);

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups: { [key: string]: typeof filteredResults } = {
      page: [],
      service: [],
      team: [],
      project: []
    };
    
    filteredResults.forEach(item => {
      if (groups[item.type]) {
        groups[item.type].push(item);
      }
    });
    
    return groups;
  }, [filteredResults]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "page":
        return <FileText className="w-5 h-5" />;
      case "service":
        return <Code2 className="w-5 h-5" />;
      case "team":
        return <Users className="w-5 h-5" />;
      case "project":
        return <Briefcase className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "page":
        return "Pages";
      case "service":
        return "Services";
      case "team":
        return "Team Members";
      case "project":
        return "Projects";
      default:
        return "Results";
    }
  };

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Search Results
            </h1>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anything on our website..."
                  className="w-full px-6 py-4 pl-14 pr-4 text-slate-900 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loadingData ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
              <p className="text-slate-600">Searching all components in the website...</p>
            </div>
          ) : !query ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Start Searching
              </h2>
              <p className="text-slate-600">
                Enter a search term to find pages, services, team members, and projects
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                No Results Found
              </h2>
              <p className="text-slate-600 mb-4">
                We couldn't find anything matching "{query}"
              </p>
              <p className="text-sm text-slate-500">
                Try different keywords or check your spelling
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="text-sm text-slate-600 mb-6">
                Found {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""} for "{query}"
              </div>
              
              {Object.entries(groupedResults).map(([type, items]) => {
                if (items.length === 0) return null;
                
                return (
                  <div key={type} className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      {getTypeIcon(type)}
                      <h2 className="text-2xl font-bold text-slate-900">
                        {getTypeLabel(type)}
                      </h2>
                      <span className="text-sm text-slate-500">
                        ({items.length})
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((item, index) => (
                        <motion.div
                          key={`${item.type}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className="block bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all group h-full"
                          >
                            <div className="flex items-start gap-4 mb-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                {getTypeIcon(item.type)}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">
                                  {item.title}
                                </h3>
                                <span className="text-xs text-slate-500 uppercase">
                                  {getTypeLabel(item.type)}
                                </span>
                              </div>
                              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchPage;
