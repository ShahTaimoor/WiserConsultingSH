import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const TITLE = "Contact Us — Start Your Software Project";
const DESCRIPTION =
  "Get in touch with Tech Wiser Consulting in Peshawar, Pakistan. Tell us about your software, website or mobile app project and we will get back to you with next steps.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/contact" });

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema("ContactPage", TITLE, DESCRIPTION, "/contact"),
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]),
        ]}
      />
      {children}
    </>
  );
}
