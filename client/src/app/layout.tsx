import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import ClientLayout from "./ClientLayout";
import JsonLd from "@/components/seo/JsonLd";
import { SITE, SITE_URL, FOUNDER, organizationSchema, websiteSchema } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEFAULT_TITLE = `${SITE.name} — Software House in Peshawar, Pakistan`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [...SITE.keywords],
  authors: [{ name: FOUNDER.name, url: SITE_URL }],
  creator: FOUNDER.name,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: SITE.description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: [{ rel: "icon", url: "/logo.png" }],
  formatDetection: { telephone: false },
  // Paste the token from Search Console > Settings > Ownership verification (HTML tag) into NEXT_PUBLIC_GSC_VERIFICATION.
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION && { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
        suppressHydrationWarning
      >
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
