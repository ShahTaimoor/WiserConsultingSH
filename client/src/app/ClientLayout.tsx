"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { Sidebar } from "@/components/layout/Sidebar";
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
        {isAdminRoute ? (
          <main className="relative">{children}</main>
        ) : (
          <>
            <Sidebar />
            <div className="pt-14 lg:pt-0 lg:pl-[var(--sidebar-w,248px)] transition-[padding] duration-300 ease-out">
              <main className="relative min-h-screen">{children}</main>
              <Footer />
            </div>
          </>
        )}
      </LenisScrollHandler>
    </ReactLenis>
  );
}
