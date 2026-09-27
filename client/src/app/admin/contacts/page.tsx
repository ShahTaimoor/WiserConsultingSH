"use client";

import { useEffect, useMemo, useState } from "react";
import { Archive, ArrowLeft, CheckCheck, Copy, Inbox, Mail, Phone, Reply, Search, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/adminApi";
import { cn } from "@/lib/utils";
import { Badge, Button, EmptyState, PageHeader, PageLoader, inputClass, useFeedback } from "@/components/admin/ui";
import { CONTACT_STATUSES, statusTone, type Contact, type ContactStatus } from "@/components/admin/contacts";
import { CONTACTS_CHANGED_EVENT } from "@/components/shadcn-space/blocks/sidebar-01/app-sidebar";

const notifyContactsChanged = () => window.dispatchEvent(new Event(CONTACTS_CHANGED_EVENT));

// Pre-filled reply: Gmail compose in a new tab (works without a desktop mail app), or the default mail app
const replyLinks = (c: Contact) => {
  const subject = `Re: ${c.subject}`;
  const quoted = c.message.split("\n").map((l) => `> ${l}`).join("\n");
  const body = `Hi ${c.name},\n\n\n\n---\nOn ${new Date(c.createdAt).toLocaleString()}, ${c.name} wrote:\n${quoted}`;
  const q = (v: string) => encodeURIComponent(v);
  return {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${q(c.email)}&su=${q(subject)}&body=${q(body)}`,
    mailto: `mailto:${c.email}?subject=${q(subject)}&body=${q(body)}`,
  };
};

const formatDate = (d: string) =>
  new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function AdminContacts() {
  const { toast, confirm } = useFeedback();
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [filter, setFilter] = useState<"all" | ContactStatus>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = async (openId?: string | null) => {
    try {
      const data = await adminFetch<Contact[]>("/admin/contacts");
      setContacts(data);
      const target = openId && data.find((c) => c._id === openId);
      if (target) open(target);
    } catch (err) {
      setContacts([]);
      toast("error", err instanceof Error ? err.message : "Could not load messages");
    }
  };

  useEffect(() => {
    // Open a specific message when linked from the dashboard (?id=...)
    load(new URLSearchParams(window.location.search).get("id"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: contacts?.length ?? 0 };
    CONTACT_STATUSES.forEach((s) => (c[s] = contacts?.filter((x) => x.status === s).length ?? 0));
    return c;
  }, [contacts]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (contacts ?? []).filter(
      (c) =>
        (filter === "all" || c.status === filter) &&
        (!q || [c.name, c.email, c.subject].some((v) => v?.toLowerCase().includes(q)))
    );
  }, [contacts, filter, query]);

  const selected = contacts?.find((c) => c._id === selectedId) ?? null;

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast("success", "Email address copied");
    } catch {
      toast("error", "Could not copy — please select it manually");
    }
  };

  const setStatus = async (id: string, status: ContactStatus, silent = false) => {
    try {
      await adminFetch(`/admin/contacts/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
      setContacts((list) => list?.map((c) => (c._id === id ? { ...c, status } : c)) ?? null);
      notifyContactsChanged();
      if (!silent) toast("success", `Marked as ${status}`);
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not update message");
    }
  };

  const open = (c: Contact) => {
    setSelectedId(c._id);
    if (c.status === "new") setStatus(c._id, "read", true);
  };

  const remove = async (c: Contact) => {
    const ok = await confirm({
      title: "Delete message?",
      description: `The message from ${c.name} will be removed from the inbox.`,
    });
    if (!ok) return;
    try {
      await adminFetch(`/admin/contacts/${c._id}`, { method: "DELETE" });
      setContacts((list) => list?.filter((x) => x._id !== c._id) ?? null);
      notifyContactsChanged();
      setSelectedId(null);
      toast("success", "Message deleted");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not delete message");
    }
  };

  if (!contacts) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Enquiries sent through the website contact form." />

      {contacts.length === 0 ? (
        <EmptyState icon={Inbox} title="No messages yet" description="When someone uses the contact form, their message will appear here." />
      ) : (
        <div className="grid min-h-[600px] grid-cols-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs lg:grid-cols-[380px_1fr]">
          {/* List */}
          <div className={cn("flex flex-col border-slate-200 lg:border-r", selected && "hidden lg:flex")}>
            <div className="space-y-3 border-b border-slate-100 p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, email or subject"
                  className={cn(inputClass, "pl-9")}
                />
              </div>
              <div className="flex gap-1 overflow-x-auto">
                {(["all", ...CONTACT_STATUSES] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={cn(
                      "shrink-0 rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                      filter === s ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    {s} <span className={filter === s ? "text-slate-300" : "text-slate-400"}>{counts[s]}</span>
                  </button>
                ))}
              </div>
            </div>

            <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto" data-lenis-prevent>
              {visible.length === 0 && <li className="p-8 text-center text-sm text-slate-500">No messages match.</li>}
              {visible.map((c) => (
                <li key={c._id}>
                  <button
                    onClick={() => open(c)}
                    className={cn(
                      "w-full px-4 py-3.5 text-left transition-colors hover:bg-slate-50",
                      selectedId === c._id && "bg-cyan-50/60 hover:bg-cyan-50/60"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {c.status === "new" && <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-500" aria-label="Unread" />}
                      <p className={cn("flex-1 truncate text-sm", c.status === "new" ? "font-semibold text-slate-900" : "font-medium text-slate-700")}>
                        {c.name}
                      </p>
                      <span className="shrink-0 text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-slate-600">{c.subject}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">{c.message}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Detail */}
          <div className={cn("flex flex-col", !selected && "hidden lg:flex")}>
            {!selected ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <Mail className="h-8 w-8 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">Select a message to read it</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-5 py-3">
                  <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSelectedId(null)} aria-label="Back">
                    <ArrowLeft />
                  </Button>
                  <Badge tone={statusTone[selected.status]}>{selected.status}</Badge>
                  <div className="ml-auto flex gap-1.5">
                    {selected.status !== "replied" && (
                      <Button variant="secondary" size="sm" onClick={() => setStatus(selected._id, "replied")}>
                        <CheckCheck /> Mark replied
                      </Button>
                    )}
                    {selected.status !== "archived" && (
                      <Button variant="secondary" size="sm" onClick={() => setStatus(selected._id, "archived")}>
                        <Archive /> Archive
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => remove(selected)} aria-label="Delete" className="hover:text-red-600">
                      <Trash2 />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6" data-lenis-prevent>
                  <h2 className="text-lg font-semibold text-slate-900">{selected.subject}</h2>
                  <div className="mt-4 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600">
                      {selected.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="font-medium text-slate-900">{selected.name}</p>
                      <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-slate-500">
                        <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1 hover:text-cyan-700">
                          <Mail className="h-3.5 w-3.5" /> {selected.email}
                        </a>
                        {selected.phone && (
                          <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-1 hover:text-cyan-700">
                            <Phone className="h-3.5 w-3.5" /> {selected.phone}
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="shrink-0 text-xs text-slate-400">{formatDate(selected.createdAt)}</p>
                  </div>
                  <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{selected.message}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-6 py-4">
                  <a
                    href={replyLinks(selected).gmail}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-900 px-3.5 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    <Reply className="h-4 w-4" /> Reply in Gmail
                  </a>
                  <Button variant="secondary" onClick={() => copyEmail(selected.email)}>
                    <Copy /> Copy email
                  </Button>
                  <a
                    href={replyLinks(selected).mailto}
                    className="ml-auto text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline"
                  >
                    Open in mail app
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
