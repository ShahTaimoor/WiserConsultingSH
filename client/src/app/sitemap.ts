import type { MetadataRoute } from "next";
import { API_BASE } from "@/constants";
import { absoluteUrl } from "@/lib/seo";

// Public, indexable routes only — admin, auth and search pages are noindex and stay out.
const STATIC_ROUTES: { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/portfolio", changeFrequency: "weekly", priority: 0.9 },
  { path: "/team", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.8 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

async function getTeamIds(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/team?isActive=true`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data.map((m: { _id: string }) => m._id).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const teamIds = await getTeamIds();
  return [
    ...STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({ url: absoluteUrl(path), changeFrequency, priority })),
    ...teamIds.map((id) => ({ url: absoluteUrl(`/team/${id}`), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
