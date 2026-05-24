"use client";

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/assets/logo/logo";
import { NavItem, NavMain } from "@/components/shadcn-space/blocks/sidebar-01/nav-main";
import { PieChart, Briefcase, Users, FileText, Mail, User, Settings } from "lucide-react";

export const navData: NavItem[] = [
  // Main Sectiion
  { label: "Main", isSection: true },
  { title: "Dashboard", icon: PieChart, href: "/admin" },
  { title: "Projects", icon: Briefcase, href: "/admin/portfolio" },
  { title: "Team", icon: Users, href: "/admin/team" },
  { title: "Content", icon: FileText, href: "/admin/content" },
  { title: "Contact Submissions", icon: Mail, href: "/admin/contacts" },
  { title: "Users", icon: User, href: "/admin/users" },
  { title: "Settings", icon: Settings, href: "/admin/settings" },
];

export function AppSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLogoClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className="px-0 h-full [&_[data-slot=sidebar-inner]]:h-full">
      <div className="flex flex-col gap-6">
        {/* ---------------- Header ---------------- */}
        <SidebarHeader className="px-2 sm:px-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <a href="/admin" className="w-full h-full" aria-label="Admin Dashboard" onClick={handleLogoClick}>
                <Logo />
              </a>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* ---------------- Content ---------------- */}
        <SidebarContent className="overflow-hidden">
          <ScrollArea className="h-[calc(100vh-100px)]">
            <div className="px-2 sm:px-4">
              <NavMain items={navData} />
            </div>
          </ScrollArea>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
