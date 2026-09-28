import type { Metadata } from "next";

/**
 * Single source of truth for everything SEO-related.
 * Only put facts here that are true and visible on the site — schema must
 * describe what a visitor can actually see (no invented ratings/awards/clients).
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tech.wiserconsulting.info").replace(/\/$/, "");

export const SITE = {
  name: "Tech Wiser Consulting",
  alternateName: "Tech Wiser",
  tagline: "Software House & Technology Consulting Company",
  description:
    "Tech Wiser Consulting is a software house in Peshawar, Pakistan. We build custom software, e-commerce platforms, business websites, mobile apps and POS / business management systems for growing businesses.",
  locale: "en_US",
  logo: "/logo.png",
  email: "taimour448@gmail.com",
  phone: "+92 313 0922988",
  address: {
    streetAddress: "Deans Trade Center, UG 400",
    addressLocality: "Peshawar",
    addressRegion: "Khyber Pakhtunkhwa",
    addressCountry: "PK",
  },
  // Add real, verified profile URLs here (LinkedIn, GitHub, Facebook...). They become `sameAs` in the schema.
  sameAs: [
    "https://www.linkedin.com/in/shah-taimoor-bin-khalid-b86191268/",
    "https://github.com/ShahTaimoor",
    "https://www.facebook.com/profile.php?id=61592478127964",
  ] as string[],
  keywords: [
    "software house in Peshawar",
    "software development company Peshawar",
    "custom software development Pakistan",
    "web application development",
    "e-commerce website development",
    "mobile app development",
    "POS software Pakistan",
    "business management software",
    "Tech Wiser Consulting",
  ],
} as const;

export const FOUNDER = {
  name: "Shah Taimoor Bin Khalid",
  jobTitle: "CEO & Founder",
  description:
    "Founder and CEO of Tech Wiser Consulting. Full Stack Engineer specializing in MERN and PERN stack development, building scalable web applications, e-commerce platforms and business management systems.",
  knowsAbout: ["React", "Next.js", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "E-commerce development", "Business management systems"],
} as const;

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const FOUNDER_ID = `${SITE_URL}/#founder`;

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  image?: string;
  type?: "website" | "article" | "profile";
};

/** Consistent per-page metadata: canonical, Open Graph, Twitter and (optionally) noindex. */
export function pageMetadata({ title, description, path, noindex, image, type = "website" }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const images = image ? [{ url: image }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE.name, locale: SITE.locale, type, ...(images && { images }) },
    twitter: { card: "summary_large_image", title, description, ...(image && { images: [image] }) },
    ...(noindex && { robots: { index: false, follow: false } }),
  };
}

export const noIndexMetadata = (title: string): Metadata => ({
  title,
  robots: { index: false, follow: false },
});

/* ------------------------------ JSON-LD builders ------------------------------ */

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE.name,
  alternateName: SITE.alternateName,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: absoluteUrl(SITE.logo) },
  description: SITE.description,
  email: SITE.email,
  telephone: SITE.phone,
  founder: { "@id": FOUNDER_ID },
  address: { "@type": "PostalAddress", ...SITE.address },
  ...(SITE.sameAs.length > 0 && { sameAs: SITE.sameAs }),
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE.name,
  alternateName: SITE.alternateName,
  inLanguage: "en",
  publisher: { "@id": ORG_ID },
});

export const founderSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": FOUNDER_ID,
  name: FOUNDER.name,
  jobTitle: FOUNDER.jobTitle,
  description: FOUNDER.description,
  url: absoluteUrl("/"),
  worksFor: { "@id": ORG_ID },
  knowsAbout: FOUNDER.knowsAbout,
  ...(SITE.sameAs.length > 0 && { sameAs: SITE.sameAs }),
});

/** Local business entity for the home page (ProfessionalService is a LocalBusiness subtype). */
export const localBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#localbusiness`,
  name: SITE.name,
  url: SITE_URL,
  image: absoluteUrl(SITE.logo),
  description: SITE.description,
  email: SITE.email,
  telephone: SITE.phone,
  address: { "@type": "PostalAddress", ...SITE.address },
  areaServed: [
    { "@type": "City", name: "Peshawar" },
    { "@type": "Country", name: "Pakistan" },
  ],
  parentOrganization: { "@id": ORG_ID },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Software development services",
    itemListElement: [
      "Custom Software Development",
      "Cloud Solutions & Migration",
      "Mobile App Development",
      "E-commerce & Business Websites",
      "POS & Business Management Systems",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name, provider: { "@id": ORG_ID } } })),
  },
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const webPageSchema = (type: "WebPage" | "ContactPage" | "AboutPage" | "CollectionPage", name: string, description: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": type,
  name,
  description,
  url: absoluteUrl(path),
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": ORG_ID },
});
