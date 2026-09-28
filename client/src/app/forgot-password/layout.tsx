import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("Forgot Password");

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
