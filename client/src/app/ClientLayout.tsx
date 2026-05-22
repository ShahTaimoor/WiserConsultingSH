"use client";

import { usePathname } from "next/navigation";
import { ReactLenis } from "lenis/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1,
        smoothWheel: true,
      }}
    >
      {!isAdminRoute && <Navbar />}
      <main className={!isAdminRoute ? "min-h-[calc(100vh-160px)] mt-20" : ""}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </ReactLenis>
  );
}
