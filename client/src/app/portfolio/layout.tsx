import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const TITLE = "Projects & Portfolio — Software We Have Built";
const DESCRIPTION =
  "Explore web applications, mobile apps and business systems built by Tech Wiser Consulting for real clients, with the technologies used in each project.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/portfolio" });

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema("CollectionPage", TITLE, DESCRIPTION, "/portfolio"),
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Projects", path: "/portfolio" }]),
        ]}
      />
      {children}
    </>
  );
}
