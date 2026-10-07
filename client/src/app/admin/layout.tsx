"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/auth/authSlice";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, navData } from "@/components/shadcn-space/blocks/sidebar-01/app-sidebar";
import { FeedbackProvider } from "@/components/admin/ui";
import { adminFetch } from "@/lib/adminApi";

const isAdmin = (role: string | number | undefined) => role === 1 || role === "1" || role === "admin";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Dark tokens for the admin panel only (portals render outside this tree, so toggle on <html>)
  useEffect(() => {
    document.documentElement.classList.add("admin-invert");
    return () => document.documentElement.classList.remove("admin-invert");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) router.replace("/login");
    else if (!isAdmin(user.role)) router.replace("/");
  }, [mounted, user, router]);

  const handleLogout = async () => {
    try {
      await adminFetch("/logout", { method: "POST" });
    } catch {
      // Clear the local session even if the server call fails
    }
    dispatch(logout());
    router.push("/login");
  };

  if (!mounted || !user || !isAdmin(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const current = [...navData].reverse().find((n) =>
    n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
  );

  return (
    <FeedbackProvider>
      <SidebarProvider>
        <AppSidebar user={user} onLogout={handleLogout} />
        <SidebarInset className="min-h-screen bg-slate-50">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6">
            <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-900" />
            <div className="h-5 w-px bg-slate-200" />
            <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
              <span className="text-slate-400">Admin</span>
              <span className="text-slate-300">/</span>
              <span className="font-medium text-slate-900">{current?.title ?? "Dashboard"}</span>
            </nav>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:py-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </FeedbackProvider>
  );
}
