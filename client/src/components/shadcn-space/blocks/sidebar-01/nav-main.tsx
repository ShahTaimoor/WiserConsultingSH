"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";

export type NavItem = {
  label?: string;
  isSection?: boolean;
  title?: string;
  icon?: LucideIcon;
  href?: string;
  children?: NavItem[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [activeParent, setActiveParent] = React.useState<string | null>(null);
  const [activeChild, setActiveChild] = React.useState<string | null>(null);

  // Set active parent based on pathname
  React.useEffect(() => {
    const currentItem = items.find((item) => item.href === pathname);
    if (currentItem?.title) {
      setActiveParent(currentItem.title);
    }
  }, [pathname, items]);

  return (
    <>
      {items.map((item, index) => (
        <NavMainItem
          key={item.title || item.label || index}
          item={item}
          activeParent={activeParent}
          setActiveParent={setActiveParent}
          activeChild={activeChild}
          setActiveChild={setActiveChild}
        />
      ))}
    </>
  );
}

function NavMainItem({
  item,
  activeParent,
  setActiveParent,
  activeChild,
  setActiveChild,
}: {
  item: NavItem;
  activeParent: string | null;
  activeChild: string | null;
  setActiveParent: (val: string) => void;
  setActiveChild: (val: string | null) => void;
}) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const hasChildren = !!item.children?.length;
  const isParentActive = activeParent === item.title || pathname === item.href;
  const [isOpen, setIsOpen] = React.useState(isParentActive);

  // Close sidebar on mobile when navigation item is clicked
  const handleNavClick = () => {
    setActiveParent(item.title!);
    setActiveChild(null);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Sync open state when activeParent changes
  React.useEffect(() => {
    if (isParentActive) {
      setIsOpen(true);
    }
  }, [isParentActive]);

  // Section label
  if (item.isSection && item.label) {
    return (
      <SidebarGroup className="p-0 pt-5 first:pt-0">
        <SidebarGroupLabel className="p-0 text-xs font-medium uppercase text-sidebar-foreground">
          {item.label}
        </SidebarGroupLabel>
      </SidebarGroup>
    );
  }

  // Item with children → collapsible
  if (hasChildren && item.title) {
    return (
      <SidebarGroup className="p-0">
        <SidebarMenu>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  id={`nav-main-trigger-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  tooltip={item.title}
                  isActive={isParentActive}
                  onClick={() => setActiveParent(item.title!)}
                  className={cn(
                    "w-full rounded-md text-sm font-medium px-3 py-2 h-9 transition-colors cursor-pointer",
                    isParentActive ? "bg-primary! text-primary-foreground!" : ""
                  )}
                >
                  {item.icon && <item.icon size={16} />}
                  <span>{item.title}</span>
                  <ChevronRight
                    className={cn(
                      "ml-auto transition-transform duration-200",
                      isOpen && "rotate-90"
                    )}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="me-0 pe-0">
                  {item.children!.map((child, index) => (
                    <NavMainSubItem
                      key={child.title || index}
                      item={child}
                      activeParent={activeParent}
                      setActiveParent={setActiveParent}
                      activeChild={activeChild}
                      setActiveChild={setActiveChild}
                      parentTitle={item.title}
                    />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  // Item without children
  if (item.title) {
    return (
      <SidebarGroup className="p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              id={`nav-main-button-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              tooltip={item.title}
              isActive={isParentActive}
              onClick={handleNavClick}
              className={cn(
                "rounded-md text-sm font-medium px-3 py-2 h-9 transition-colors cursor-pointer",
                isParentActive ? "bg-primary! text-primary-foreground!" : ""
              )}
              asChild
            >
              <Link href={item.href || "#"}>
                {item.icon && <item.icon />}
                {item.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return null;
}

function NavMainSubItem({
  item,
  activeParent,
  setActiveParent,
  activeChild,
  setActiveChild,
  parentTitle,
}: {
  item: NavItem;
  activeParent: string | null;
  activeChild: string | null;
  setActiveParent: (val: string) => void;
  setActiveChild: (val: string | null) => void;
  parentTitle?: string;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const hasChildren = !!item.children?.length;
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  // Close sidebar on mobile when sub-navigation item is clicked
  const handleSubNavClick = () => {
    setActiveParent(parentTitle || "");
    setActiveChild(item.title!);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (hasChildren && item.title) {
    return (
      <SidebarMenuSubItem>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton 
              id={`nav-sub-trigger-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="w-full rounded-md text-sm font-medium px-3 py-2 h-9"
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <ChevronRight
                className={cn(
                  "ml-auto transition-transform duration-200",
                  isOpen && "rotate-90"
                )}
              />
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub className="me-0 pe-0">
              {item.children!.map((child, index) => (
                <NavMainSubItem
                  key={child.title || index}
                  item={child}
                  activeParent={activeParent}
                  setActiveParent={setActiveParent}
                  activeChild={activeChild}
                  setActiveChild={setActiveChild}
                  parentTitle={parentTitle}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuSubItem>
    );
  }

  if (item.title) {
    const isChildActive = activeChild === item.title || pathname === item.href;
    return (
      <SidebarMenuSubItem className="w-full">
        <SidebarMenuSubButton
          id={`nav-sub-button-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
          className={cn(
            "w-full rounded-md transition-colors",
            isChildActive ? "bg-muted! text-foreground!" : ""
          )}
          isActive={isChildActive}
          onClick={handleSubNavClick}
          asChild
        >
          <Link href={item.href || "#"}>{item.title}</Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  return null;
}
