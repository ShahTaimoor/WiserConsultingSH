"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function LenisScrollHandler({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, lock: true });
      requestAnimationFrame(() => {
        lenis.resize();
      });
    }
  }, [pathname, lenis]);

  return <>{children}</>;
}

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
      <LenisScrollHandler>
        {!isAdminRoute && <Navbar />}
        <main className={!isAdminRoute ? "relative min-h-[calc(100vh-160px)] pt-[4.25rem] sm:pt-20" : "relative"}>
          {children}
        </main>
        {!isAdminRoute && <Footer />}
      </LenisScrollHandler>
    </ReactLenis>
  );
}
