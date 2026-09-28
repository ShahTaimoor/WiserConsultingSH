import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const TITLE = "Our Team — Developers & Engineers";
const DESCRIPTION =
  "Meet the developers and engineers behind Tech Wiser Consulting, led by founder Shah Taimoor Bin Khalid, and the skills they bring to your project.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/team" });

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema("AboutPage", TITLE, DESCRIPTION, "/team"),
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Team", path: "/team" }]),
        ]}
      />
      {children}
    </>
  );
}
