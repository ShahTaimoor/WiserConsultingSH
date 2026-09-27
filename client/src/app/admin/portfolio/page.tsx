"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Briefcase, ExternalLink, ImageIcon, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { adminFetch, isImageUrl } from "@/lib/adminApi";
import { cn } from "@/lib/utils";
import {
  Badge,
  Button,
  EmptyState,
  Field,
  FormDrawer,
  FormSection,
  PageHeader,
  PageLoader,
  Switch,
  TagInput,
  inputClass,
  useFeedback,
} from "@/components/admin/ui";

interface Portfolio {
  _id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  technologies: string[];
  link: string;
  order: number;
  isActive: boolean;
}

const CATEGORIES = [
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "enterprise", label: "Enterprise" },
  { value: "other", label: "Other" },
];

type ImageItem = { url: string; file?: File };

const emptyForm = {
  title: "",
  description: "",
  category: "web",
  technologies: [] as string[],
  link: "",
  order: 0,
  isActive: true,
};

export default function AdminPortfolio() {
  const { toast, confirm } = useFeedback();
  const [projects, setProjects] = useState<Portfolio[] | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      setProjects(await adminFetch<Portfolio[]>("/portfolios"));
    } catch (err) {
      setProjects([]);
      toast("error", err instanceof Error ? err.message : "Could not load projects");
    }
  };

  useEffect(() => {
    load();
    if (new URLSearchParams(window.location.search).get("new")) openCreate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (projects ?? []).filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (!q || p.title.toLowerCase().includes(q) || p.technologies.some((t) => t.toLowerCase().includes(q)))
    );
  }, [projects, query, category]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImages([]);
    setDrawerOpen(true);
  };

  const openEdit = (p: Portfolio) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      category: p.category,
      technologies: p.technologies ?? [],
      link: p.link ?? "",
      order: p.order ?? 0,
      isActive: p.isActive,
    });
    setImages(p.images.filter(isImageUrl).map((url) => ({ url })));
    setDrawerOpen(true);
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: ImageItem[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return toast("error", `${file.name} is not an image`);
      if (file.size > 5 * 1024 * 1024) return toast("error", `${file.name} is larger than 5 MB`);
      next.push({ url: URL.createObjectURL(file), file });
    });
    setImages((prev) => [...prev, ...next].slice(0, 10));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = new FormData();
      body.append("title", form.title);
      body.append("description", form.description);
      body.append("category", form.category);
      body.append("link", form.link);
      body.append("order", String(form.order || 0));
      body.append("isActive", String(form.isActive));
      form.technologies.forEach((t, i) => body.append(`technologies[${i}]`, t));
      images.forEach((img) => (img.file ? body.append("images", img.file) : body.append("existingImages[]", img.url)));

      await adminFetch(editing ? `/admin/portfolios/${editing._id}` : "/admin/portfolios", {
        method: editing ? "PUT" : "POST",
        body,
      });
      toast("success", editing ? "Project updated" : "Project added");
      setDrawerOpen(false);
      load();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Portfolio) => {
    const ok = await confirm({
      title: "Delete project?",
      description: `"${p.title}" will be removed from the website.`,
    });
    if (!ok) return;
    try {
      await adminFetch(`/admin/portfolios/${p._id}`, { method: "DELETE" });
      setProjects((list) => list?.filter((x) => x._id !== p._id) ?? null);
      toast("success", "Project deleted");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not delete project");
    }
  };

  if (!projects) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Case studies shown on the portfolio page."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Add project
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No projects yet"
          description="Add your first project to show it on the website."
          action={
            <Button onClick={openCreate}>
              <Plus /> Add project
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or technology"
                className={cn(inputClass, "pl-9")}
              />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={cn(inputClass, "sm:w-44")}>
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {visible.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">No projects match your search.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((p) => (
                <article key={p._id} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
                  <div className="relative aspect-[16/10] bg-slate-100">
                    {isImageUrl(p.images?.[0]) ? (
                       
                      <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute left-3 top-3">
                      <Badge tone={p.isActive ? "green" : "neutral"}>{p.isActive ? "Published" : "Hidden"}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-slate-900">{p.title}</h3>
                      <span className="shrink-0 text-xs font-medium capitalize text-slate-500">{p.category}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{p.description}</p>
                    {p.technologies.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {p.technologies.slice(0, 4).map((t) => (
                          <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                            {t}
                          </span>
                        ))}
                        {p.technologies.length > 4 && (
                          <span className="px-1 py-0.5 text-xs text-slate-400">+{p.technologies.length - 4}</span>
                        )}
                      </div>
                    )}
                    </div>
                    <div className="flex items-center gap-1 border-t border-slate-100 pt-3">
                      <Button variant="secondary" size="sm" onClick={() => openEdit(p)}>
                        <Pencil /> Edit
                      </Button>
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          aria-label="Open project link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto hover:text-red-600"
                        onClick={() => handleDelete(p)}
                        aria-label="Delete project"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      <FormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editing ? "Edit project" : "Add project"}
        description="Details shown on the public portfolio page."
        onSubmit={handleSubmit}
        submitLabel={editing ? "Save changes" : "Add project"}
        saving={saving}
      >
        <FormSection title="Project details">
          <Field label="Title" required>
            <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </Field>
          <Field label="Description" required>
            <textarea
              className={cn(inputClass, "min-h-24 resize-y")}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Live link">
              <input
                type="url"
                className={inputClass}
                placeholder="https://"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Technologies" hint="Press Enter after each one.">
            <TagInput
              values={form.technologies}
              onChange={(technologies) => setForm({ ...form, technologies })}
              placeholder="e.g. React, Node.js"
            />
          </Field>
        </FormSection>

        <FormSection title="Images" description="The first image is used as the cover. Up to 10 images, 5 MB each.">
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, i) => (
              <div key={img.url} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                { }
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-slate-600 opacity-0 shadow transition-opacity hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {images.length < 10 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 transition-colors hover:border-cyan-500 hover:text-cyan-700"
              >
                <Upload className="h-5 w-5" />
                <span className="text-xs font-medium">Upload</span>
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </FormSection>

        <FormSection title="Visibility">
          <Switch
            checked={form.isActive}
            onChange={(isActive) => setForm({ ...form, isActive })}
            label="Published"
            description="Show this project on the website."
          />
          <Field label="Display order" hint="Lower numbers appear first.">
            <input
              type="number"
              min={0}
              className={cn(inputClass, "w-32")}
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
            />
          </Field>
        </FormSection>
      </FormDrawer>
    </div>
  );
}
