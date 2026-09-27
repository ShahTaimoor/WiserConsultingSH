"use client";

import { useEffect, useRef, useState } from "react";
import { Facebook, Instagram, Linkedin, Upload } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";
import { Button, Field, PageHeader, PageLoader, Panel, inputClass, useFeedback } from "@/components/admin/ui";

const emptySocial = { facebook: "", instagram: "", linkedin: "" };
const emptyContact = { email: "", phone: "", phone2: "", address: "", officeHours: "" };

export default function AdminSettingsPage() {
  const { settings, loading, updateSettings } = useSettings();
  const { toast } = useFeedback();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [socialLinks, setSocialLinks] = useState(emptySocial);
  const [contactInfo, setContactInfo] = useState(emptyContact);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    if (!settings) return;
    const sl = settings.socialLinks;
    const ci = settings.contactInfo;
    setSocialLinks({ facebook: sl?.facebook || "", instagram: sl?.instagram || "", linkedin: sl?.linkedin || "" });
    setContactInfo({
      email: ci?.email || "",
      phone: ci?.phone || "",
      phone2: ci?.phone2 || "",
      address: ci?.address || "",
      officeHours: ci?.officeHours || "",
    });
    setLogoPreview(settings.logoUrl || "");
    setLogoFile(null);
  };

   
  useEffect(reset, [settings]);

  const pickLogo = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast("error", "Please choose an image file");
    if (file.size > 2 * 1024 * 1024) return toast("error", "Logo must be smaller than 2 MB");
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = new FormData();
      if (logoFile) body.append("logo", logoFile);
      body.append("socialLinks", JSON.stringify(socialLinks));
      body.append("contactInfo", JSON.stringify(contactInfo));
      const ok = await updateSettings(body);
      if (!ok) throw new Error("Could not save settings");
      setLogoFile(null);
      toast("success", "Settings saved");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !settings) return <PageLoader />;

  const contact = (key: keyof typeof emptyContact) => ({
    value: contactInfo[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setContactInfo({ ...contactInfo, [key]: e.target.value }),
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PageHeader
        title="Settings"
        description="Logo, contact details and social links used across the website."
        actions={
          <>
            <Button type="button" variant="secondary" onClick={reset} disabled={saving}>
              Discard
            </Button>
            <Button type="submit" loading={saving}>
              Save changes
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Contact details" description="Shown on the contact page and in the footer.">
            <div className="space-y-4">
              <Field label="Email" required>
                <input type="email" className={inputClass} placeholder="info@company.com" required {...contact("email")} />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Phone" required>
                  <input className={inputClass} placeholder="+92 300 1234567" required {...contact("phone")} />
                </Field>
                <Field label="Second phone">
                  <input className={inputClass} placeholder="Optional" {...contact("phone2")} />
                </Field>
              </div>
              <Field label="Office address" required>
                <textarea className={cn(inputClass, "min-h-20 resize-y")} required {...contact("address")} />
              </Field>
              <Field label="Office hours" required>
                <input className={inputClass} placeholder="Mon – Sat, 9:00 AM – 6:00 PM" required {...contact("officeHours")} />
              </Field>
            </div>
          </Panel>

          <Panel title="Social links" description="Leave empty to hide an icon from the footer.">
            <div className="space-y-4">
              {(
                [
                  ["linkedin", "LinkedIn", Linkedin],
                  ["facebook", "Facebook", Facebook],
                  ["instagram", "Instagram", Instagram],
                ] as const
              ).map(([key, label, Icon]) => (
                <Field key={key} label={label}>
                  <div className="relative">
                    <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      className={cn(inputClass, "pl-9")}
                      placeholder="https://"
                      value={socialLinks[key]}
                      onChange={(e) => setSocialLinks({ ...socialLinks, [key]: e.target.value })}
                    />
                  </div>
                </Field>
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="Logo" description="Transparent PNG or SVG, up to 2 MB." className="h-fit lg:sticky lg:top-20">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              pickLogo(e.dataTransfer.files?.[0]);
            }}
            className="flex h-36 items-center justify-center rounded-lg border border-slate-200 bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] p-4"
          >
            {logoPreview ? (
               
              <img src={logoPreview} alt="Logo preview" className="max-h-full max-w-full object-contain" />
            ) : (
              <p className="text-sm text-slate-400">No logo uploaded</p>
            )}
          </div>
          <Button type="button" variant="secondary" className="mt-4 w-full" onClick={() => fileRef.current?.click()}>
            <Upload /> {logoPreview ? "Replace logo" : "Upload logo"}
          </Button>
          {logoFile && <p className="mt-2 text-center text-xs text-amber-600">New logo selected. Save to apply.</p>}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              pickLogo(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </Panel>
      </div>
    </form>
  );
}
