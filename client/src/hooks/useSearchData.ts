import { useState, useEffect } from "react";
import { API_BASE } from "@/constants";
import { SearchItem, Service, TeamMember, PortfolioProject } from "@/types";

const STATIC_PAGES: SearchItem[] = [
  { href: "/", label: "Home", type: "page", keywords: ["home", "main", "landing", "software", "consulting"] },
  { href: "/portfolio", label: "Projects", type: "page", keywords: ["projects", "work", "case studies"] },
  { href: "/team", label: "Team", type: "page", keywords: ["team", "members", "staff", "experts", "developers"] },
  { href: "/contact", label: "Contact", type: "page", keywords: ["contact", "get in touch", "reach out", "email", "phone"] },
];

export function useSearchData(isOpen: boolean) {
  const [items, setItems] = useState<SearchItem[]>(STATIC_PAGES);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        const fetchJson = async (url: string) => {
          const res = await fetch(url);
          return res.ok ? res.json() : null;
        };

        const [servicesRes, teamRes, projectsRes] = await Promise.all([
          fetchJson(`${API_BASE}/services`),
          fetchJson(`${API_BASE}/team?isActive=true`),
          fetchJson(`${API_BASE}/portfolios?isActive=true`),
        ]);

        if (!isMounted) return;

        const dynamic: SearchItem[] = [...STATIC_PAGES];

        if (servicesRes?.success && Array.isArray(servicesRes.data)) {
          servicesRes.data.forEach((s: Service) => {
            dynamic.push({
              href: "/services",
              label: s.title,
              type: "service",
              keywords: [
                s.title.toLowerCase(),
                ...(s.description || "").toLowerCase().split(/\s+/),
                "service",
              ],
            });
          });
        }

        if (teamRes?.success && Array.isArray(teamRes.data)) {
          teamRes.data.forEach((m: TeamMember) => {
            const role = Array.isArray(m.role) ? m.role[0] : m.role;
            dynamic.push({
              href: `/team/${m._id}`,
              label: `${m.name} - ${role}`,
              type: "team",
              keywords: [
                m.name.toLowerCase(),
                role?.toLowerCase() || "",
                ...(m.skills || []).map((s) => s.toLowerCase()),
                "team",
                "member",
              ],
            });
          });
        }

        if (projectsRes?.success && Array.isArray(projectsRes.data)) {
          projectsRes.data.forEach((p: PortfolioProject) => {
            dynamic.push({
              href: "/portfolio",
              label: p.title,
              type: "project",
              keywords: [
                p.title.toLowerCase(),
                p.category?.toLowerCase() || "",
                ...(p.technologies || []).map((t) => t.toLowerCase()),
                "project",
              ],
            });
          });
        }

        setItems(dynamic);
      } catch (error) {
        console.error("Failed to fetch search data", error);
        if (isMounted) setItems(STATIC_PAGES);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  return { items };
}
