import type { Metadata } from "next";
import { cache } from "react";
import JsonLd from "@/components/seo/JsonLd";
import { API_BASE } from "@/constants";
import { ORG_ID, absoluteUrl, breadcrumbSchema, pageMetadata } from "@/lib/seo";

type Member = { name: string; role: string | string[]; bio?: string; fullBio?: string; image?: string; skills?: string[]; linkedin?: string; github?: string };

const getMember = cache(async (id: string): Promise<Member | null> => {
  try {
    const res = await fetch(`${API_BASE}/team/${encodeURIComponent(id)}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success && json.data ? json.data : null;
  } catch {
    return null;
  }
});

const roleText = (role: Member["role"]) => (Array.isArray(role) ? role.join(", ") : role);
const imageUrl = (image?: string) => (image?.startsWith("http") ? image : image?.startsWith("/") ? absoluteUrl(image) : undefined);
const trim = (text: string, max = 160) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) return { title: "Team Member", robots: { index: false, follow: true } };

  const role = roleText(member.role);
  return pageMetadata({
    title: `${member.name} — ${role}`,
    description: trim(member.bio || `${member.name} is ${role} at Tech Wiser Consulting.`),
    path: `/team/${id}`,
    image: imageUrl(member.image),
    type: "profile",
  });
}

export default async function TeamMemberLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getMember(id);

  return (
    <>
      {member && (
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Person",
              name: member.name,
              jobTitle: roleText(member.role),
              description: member.fullBio || member.bio,
              url: absoluteUrl(`/team/${id}`),
              worksFor: { "@id": ORG_ID },
              ...(imageUrl(member.image) && { image: imageUrl(member.image) }),
              ...(member.skills?.length && { knowsAbout: member.skills }),
              ...([member.linkedin, member.github].filter(Boolean).length && { sameAs: [member.linkedin, member.github].filter(Boolean) }),
            },
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Team", path: "/team" },
              { name: member.name, path: `/team/${id}` },
            ]),
          ]}
        />
      )}
      {children}
    </>
  );
}
