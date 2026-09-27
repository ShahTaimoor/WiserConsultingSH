"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Inbox, Mail, Settings, Users } from "lucide-react";
import { adminFetch } from "@/lib/adminApi";
import { Badge, PageHeader, PageLoader, Panel } from "@/components/admin/ui";
import { statusTone, type Contact } from "@/components/admin/contacts";

type Stats = { projects: number; activeProjects: number; team: number; newMessages: number };

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Contact[]>([]);

  useEffect(() => {
    Promise.all([
      adminFetch<{ isActive: boolean }[]>("/portfolios").catch(() => []),
      adminFetch<unknown[]>("/team").catch(() => []),
      adminFetch<Contact[]>("/admin/contacts").catch(() => []),
    ]).then(([projects, team, contacts]) => {
      setStats({
        projects: projects.length,
        activeProjects: projects.filter((p) => p.isActive).length,
        team: team.length,
        newMessages: contacts.filter((c) => c.status === "new").length,
      });
      setRecent(contacts.slice(0, 5));
    });
  }, []);

  if (!stats) return <PageLoader />;

  const cards = [
    { label: "Projects", value: stats.projects, sub: `${stats.activeProjects} published`, icon: Briefcase, href: "/admin/portfolio" },
    { label: "Team members", value: stats.team, sub: "Shown on the team page", icon: Users, href: "/admin/team" },
    { label: "New messages", value: stats.newMessages, sub: "Waiting for a reply", icon: Mail, href: "/admin/contacts" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Overview of your website content and enquiries." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors hover:border-slate-300"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{c.label}</p>
              <c.icon className="h-4 w-4 text-slate-400 group-hover:text-cyan-600" />
            </div>
            <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">{c.value}</p>
            <p className="mt-1 text-xs text-slate-500">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel
          title="Recent messages"
          description="Latest enquiries from the contact form"
          className="lg:col-span-2"
          bodyClassName="p-0"
          actions={
            <Link href="/admin/contacts" className="inline-flex items-center gap-1 text-xs font-medium text-cyan-700 hover:text-cyan-800">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          {recent.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Inbox className="h-6 w-6 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">No messages yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((c) => (
                <li key={c._id}>
                  <Link
                    href={`/admin/contacts?id=${c._id}`}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{c.name}</p>
                      <p className="truncate text-sm text-slate-500">{c.subject}</p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <Badge tone={statusTone[c.status]}>{c.status}</Badge>
                      <p className="mt-1 text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Quick actions">
          <div className="space-y-2">
            {[
              { label: "Add a project", href: "/admin/portfolio?new=1", icon: Briefcase },
              { label: "Add a team member", href: "/admin/team?new=1", icon: Users },
              { label: "Update contact details", href: "/admin/settings", icon: Settings },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <a.icon className="h-4 w-4 text-slate-400" />
                <span className="flex-1">{a.label}</span>
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
