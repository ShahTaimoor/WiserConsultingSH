"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminFetch } from "@/lib/adminApi";
import { Briefcase, ExternalLink, LayoutDashboard, LogOut, Mail, Settings, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export const navData = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { title: "Projects", icon: Briefcase, href: "/admin/portfolio" },
  { title: "Team", icon: Users, href: "/admin/team" },
  { title: "Messages", icon: Mail, href: "/admin/contacts" },
  { title: "Settings", icon: Settings, href: "/admin/settings" },
];

// Event the Messages page fires after changing a message, so the badge updates immediately
export const CONTACTS_CHANGED_EVENT = "admin:contacts-changed";

/** Number of unread ("new") contact messages, refreshed every minute and on changes. */
function useNewMessageCount() {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let alive = true;
    const refresh = () =>
      adminFetch<{ status: string }[]>("/admin/contacts")
        .then((list) => alive && setCount(list.filter((c) => c.status === "new").length))
        .catch(() => {});

    refresh();
    const timer = setInterval(refresh, 60_000);
    window.addEventListener(CONTACTS_CHANGED_EVENT, refresh);
    window.addEventListener("focus", refresh);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener(CONTACTS_CHANGED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [pathname]);

  return count;
}

export function AppSidebar({
  user,
  onLogout,
}: {
  user: { name?: string; email?: string } | null;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const closeOnMobile = () => isMobile && setOpenMobile(false);
  const newMessages = useNewMessageCount();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 px-4 py-4">
        <Link href="/admin" onClick={closeOnMobile} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
            { }
            <img src="/logo.png" alt="" className="h-full w-full object-contain" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Tech Wiser</p>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Admin Console</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Manage
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navData.map((item) => {
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={
                        active
                          ? "bg-slate-900! font-medium text-white! hover:bg-slate-900!"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }
                    >
                      <Link href={item.href} onClick={closeOnMobile}>
                        <item.icon />
                        <span>{item.title}</span>
                        {item.href === "/admin/contacts" && newMessages > 0 && (
                          <span
                            className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-600 px-1.5 text-[11px] font-semibold tabular-nums text-white"
                            aria-label={`${newMessages} new messages`}
                          >
                            {newMessages > 99 ? "99+" : newMessages}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                <Link href="/" target="_blank">
                  <ExternalLink />
                  <span>View website</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-3 rounded-lg px-1 py-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-xs font-semibold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{user?.name || "Admin"}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <button
            onClick={onLogout}
            title="Log out"
            aria-label="Log out"
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
