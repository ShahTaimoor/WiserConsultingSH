import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("Search");

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
