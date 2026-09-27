"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Crop, Github, Linkedin, Mail, Pencil, Plus, Search, Trash2, Twitter, Upload, Users } from "lucide-react";
import { adminFetch, isImageUrl } from "@/lib/adminApi";
import { ImageCropper } from "@/components/admin/ImageCropper";
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

interface TeamMember {
  _id: string;
  name: string;
  role: string | string[];
  bio: string;
  fullBio?: string;
  image: string;
  skills: string[];
  email?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  expertise: string[];
  achievements?: string[];
  order: number;
  isActive: boolean;
}

// The team page shows photos in a 1792×1024 frame; the profile page uses the centre square
const TEAM_PHOTO_ASPECT = 1792 / 1024;

const ROLE_OPTIONS = [
  "CEO",
  "Project Manager",
  "Full Stack Developer",
  "Full Stack Engineer",
  "MERN Stack Developer",
  "PERN Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "App Developer",
  "Mobile App Developer",
  "Cloud Architecture",
];

const emptyForm = {
  name: "",
  role: [] as string[],
  bio: "",
  fullBio: "",
  image: "",
  skills: [] as string[],
  expertise: [] as string[],
  achievements: [] as string[],
  email: "",
  linkedin: "",
  github: "",
  twitter: "",
  order: 0,
  isActive: true,
};

const rolesOf = (m: TeamMember) => (Array.isArray(m.role) ? m.role : m.role ? [m.role] : []);

// Leadership first, then by display order, then name
const rolePriority = (roles: string[]) => {
  const r = roles.map((x) => x.toLowerCase());
  if (r.some((x) => x.includes("ceo"))) return 1;
  if (r.some((x) => x.includes("project manager"))) return 2;
  if (r.some((x) => x.includes("full stack"))) return 3;
  return 4;
};

function Avatar({ member, size = "md" }: { member: { name: string; image?: string }; size?: "md" | "lg" }) {
  const cls = size === "lg" ? "h-20 w-20 text-xl" : "h-12 w-12 text-sm";
  return isImageUrl(member.image) ? (
     
    <img src={member.image} alt={member.name} className={cn(cls, "shrink-0 rounded-full object-cover ring-1 ring-slate-200")} />
  ) : (
    <div className={cn(cls, "flex shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-500")}>
      {member.name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

export default function AdminTeam() {
  const { toast, confirm } = useFeedback();
  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [query, setQuery] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  // Full-size source shown in the cropper (kept so "Adjust" can re-crop from the original)
  const [cropSource, setCropSource] = useState<string>("");
  const [cropOpen, setCropOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const data = await adminFetch<TeamMember[]>("/team");
      data.sort(
        (a, b) =>
          rolePriority(rolesOf(a)) - rolePriority(rolesOf(b)) || a.order - b.order || a.name.localeCompare(b.name)
      );
      setMembers(data);
    } catch (err) {
      setMembers([]);
      toast("error", err instanceof Error ? err.message : "Could not load team");
    }
  };

  useEffect(() => {
    load();
    if (new URLSearchParams(window.location.search).get("new")) openCreate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (members ?? []).filter(
      (m) => !q || m.name.toLowerCase().includes(q) || rolesOf(m).some((r) => r.toLowerCase().includes(q))
    );
  }, [members, query]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setCropSource("");
    setCropOpen(false);
    setDrawerOpen(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({
      name: m.name,
      role: rolesOf(m),
      bio: m.bio ?? "",
      fullBio: m.fullBio ?? "",
      image: m.image ?? "",
      skills: m.skills ?? [],
      expertise: m.expertise ?? [],
      achievements: m.achievements ?? [],
      email: m.email ?? "",
      linkedin: m.linkedin ?? "",
      github: m.github ?? "",
      twitter: m.twitter ?? "",
      order: m.order ?? 0,
      isActive: m.isActive,
    });
    setImageFile(null);
    setImagePreview(isImageUrl(m.image) ? m.image : "");
    setCropSource(isImageUrl(m.image) ? m.image : "");
    setCropOpen(false);
    setDrawerOpen(true);
  };

  // New photo chosen: open the cropper on it
  const pickImage = (original?: File) => {
    if (!original) return;
    if (!original.type.startsWith("image/")) return toast("error", "Please choose an image file");
    setCropSource(URL.createObjectURL(original));
    setCropOpen(true);
  };

  // Cropper returns a square WebP, ready to upload
  const applyCrop = (file: File) => {
    if (file.size > 5 * 1024 * 1024) return toast("error", "Image must be smaller than 5 MB");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setCropOpen(false);
  };

  const toggleRole = (role: string) =>
    setForm((f) => ({ ...f, role: f.role.includes(role) ? f.role.filter((r) => r !== role) : [...f.role, role] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.role.length === 0) return toast("error", "Select at least one role");
    setSaving(true);
    try {
      const body = new FormData();
      (["name", "bio", "fullBio", "email", "linkedin", "github", "twitter"] as const).forEach((k) =>
        body.append(k, form[k])
      );
      body.append("order", String(form.order || 0));
      body.append("isActive", String(form.isActive));
      form.role.forEach((v, i) => body.append(`role[${i}]`, v));
      form.skills.forEach((v, i) => body.append(`skills[${i}]`, v));
      form.expertise.forEach((v, i) => body.append(`expertise[${i}]`, v));
      form.achievements.forEach((v, i) => body.append(`achievements[${i}]`, v));
      if (imageFile) body.append("image", imageFile);
      else if (form.image && !isImageUrl(form.image)) body.append("image", form.image);

      await adminFetch(editing ? `/admin/team/${editing._id}` : "/admin/team", {
        method: editing ? "PUT" : "POST",
        body,
      });
      toast("success", editing ? "Team member updated" : "Team member added");
      setDrawerOpen(false);
      load();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not save team member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (m: TeamMember) => {
    const ok = await confirm({
      title: "Remove team member?",
      description: `${m.name} will be removed from the team page.`,
      confirmLabel: "Remove",
    });
    if (!ok) return;
    try {
      await adminFetch(`/admin/team/${m._id}`, { method: "DELETE" });
      setMembers((list) => list?.filter((x) => x._id !== m._id) ?? null);
      toast("success", "Team member removed");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not remove team member");
    }
  };

  if (!members) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="People shown on the team page."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Add member
          </Button>
        }
      />

      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No team members yet"
          description="Add the people behind your company."
          action={
            <Button onClick={openCreate}>
              <Plus /> Add member
            </Button>
          }
        />
      ) : (
        <>
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or role"
              className={cn(inputClass, "pl-9")}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((m) => (
              <article key={m._id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <Avatar member={m} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-medium text-slate-900">{m.name}</h3>
                      {!m.isActive && <Badge>Hidden</Badge>}
                    </div>
                    <p className="truncate text-sm text-slate-500">{rolesOf(m).join(" · ")}</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 flex-1 text-sm text-slate-600">{m.bio}</p>
                <div className="mt-4 flex items-center gap-1 border-t border-slate-100 pt-3">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(m)}>
                    <Pencil /> Edit
                  </Button>
                  <div className="ml-2 flex gap-1 text-slate-400">
                    {m.email && <Mail className="h-3.5 w-3.5" aria-label="Has email" />}
                    {m.linkedin && <Linkedin className="h-3.5 w-3.5" aria-label="Has LinkedIn" />}
                    {m.github && <Github className="h-3.5 w-3.5" aria-label="Has GitHub" />}
                    {m.twitter && <Twitter className="h-3.5 w-3.5" aria-label="Has Twitter" />}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto hover:text-red-600"
                    onClick={() => handleDelete(m)}
                    aria-label="Remove team member"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </article>
            ))}
          </div>
          {visible.length === 0 && <p className="py-12 text-center text-sm text-slate-500">No team members match.</p>}
        </>
      )}

      <FormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editing ? "Edit team member" : "Add team member"}
        description="Profile shown on the team page."
        onSubmit={handleSubmit}
        submitLabel={editing ? "Save changes" : "Add member"}
        saving={saving}
        overlay={
          cropOpen && cropSource ? (
            <ImageCropper
              src={cropSource}
              aspect={TEAM_PHOTO_ASPECT}
              outputWidth={1792}
              guide="square"
              guideLabel="Profile page"
              allowFit
              onCancel={() => setCropOpen(false)}
              onDone={applyCrop}
            />
          ) : null
        }
      >
        <FormSection title="Profile">
          <div className="flex items-center gap-4">
            <Avatar member={{ name: form.name || "?", image: imagePreview }} size="lg" />
            <div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                  <Upload /> {imagePreview ? "Change photo" : "Upload photo"}
                </Button>
                {cropSource && (
                  <Button type="button" variant="secondary" size="sm" onClick={() => setCropOpen(true)}>
                    <Crop /> Adjust
                  </Button>
                )}
              </div>
              <p className="mt-1.5 text-xs text-slate-500">Crop and zoom to fit the team page frame. Saved as WebP.</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                pickImage(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </div>
          <Field label="Full name" required>
            <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <div className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">
              Roles<span className="ml-0.5 text-red-500">*</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ROLE_OPTIONS.map((role) => {
                const on = form.role.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    aria-pressed={on}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      on
                        ? "border-cyan-600 bg-cyan-50 text-cyan-800"
                        : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    {on && <Check className="h-3 w-3" />}
                    {role}
                  </button>
                );
              })}
            </div>
          </div>
        </FormSection>

        <FormSection title="About">
          <Field label="Short bio" hint="One or two sentences, shown on the team card." required>
            <textarea
              className={cn(inputClass, "min-h-20 resize-y")}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              required
            />
          </Field>
          <Field label="Full bio" hint="Shown on the member's profile page.">
            <textarea
              className={cn(inputClass, "min-h-28 resize-y")}
              value={form.fullBio}
              onChange={(e) => setForm({ ...form, fullBio: e.target.value })}
            />
          </Field>
        </FormSection>

        <FormSection title="Skills & experience" description="Press Enter after each item.">
          <Field label="Skills">
            <TagInput values={form.skills} onChange={(skills) => setForm({ ...form, skills })} placeholder="e.g. React" />
          </Field>
          <Field label="Areas of expertise">
            <TagInput
              values={form.expertise}
              onChange={(expertise) => setForm({ ...form, expertise })}
              placeholder="e.g. System design"
            />
          </Field>
          <Field label="Achievements">
            <TagInput
              values={form.achievements}
              onChange={(achievements) => setForm({ ...form, achievements })}
              placeholder="e.g. AWS Certified"
            />
          </Field>
        </FormSection>

        <FormSection title="Contact & social">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email">
              <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="LinkedIn">
              <input type="url" placeholder="https://" className={inputClass} value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
            </Field>
            <Field label="GitHub">
              <input type="url" placeholder="https://" className={inputClass} value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
            </Field>
            <Field label="Twitter / X">
              <input type="url" placeholder="https://" className={inputClass} value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Visibility">
          <Switch
            checked={form.isActive}
            onChange={(isActive) => setForm({ ...form, isActive })}
            label="Show on website"
            description="Hidden members are kept but not displayed."
          />
          <Field label="Display order" hint="Lower numbers appear first within the same role group.">
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
