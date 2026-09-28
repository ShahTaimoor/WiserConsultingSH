import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("Reset Password");

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
