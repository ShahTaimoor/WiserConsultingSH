"use client";

import React, { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { PageHero, Sheet, reveal } from "@/components/shared/Sheet";

const SUBJECTS = ["Project Discussion", "General Inquiry", "Technical Support", "Partnership", "Other"];

const emptyForm = { name: "", email: "", phone: "", subject: SUBJECTS[0], message: "" };

const inputCls =
  "w-full bg-[#0b0c0e] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-cyan-400 focus:bg-[#0d0f11]";

const Label = ({ htmlFor, children, optional }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) => (
  <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-wider text-neutral-500">
    {children}
    {optional && <span className="normal-case tracking-normal text-neutral-600">Optional</span>}
  </label>
);

const Contact = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) throw new Error();
      setSubmitStatus("success");
      setFormData(emptyForm);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailVal = settings?.contactInfo?.email || "taimour448@gmail.com";
  const phoneVal = settings?.contactInfo?.phone || "+92 313 0922988";
  const phone2Val = settings?.contactInfo?.phone2 || "";
  const addressVal = settings?.contactInfo?.address || "Deans Trade Center, UG 400, Peshawar, Pakistan";
  const officeHoursVal = settings?.contactInfo?.officeHours || "Monday - Saturday: 9:00 AM - 6:00 PM PKT";
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(addressVal)}`;

  const channels = [
    { icon: Mail, label: "Email", values: [{ text: emailVal, href: `mailto:${emailVal}` }] },
    {
      icon: Phone,
      label: "Phone",
      values: [phoneVal, phone2Val].filter(Boolean).map((p) => ({ text: p, href: `tel:${p.replace(/\s+/g, "")}` })),
    },
    { icon: MapPin, label: "Office", values: [{ text: addressVal, href: mapsUrl, external: true }] },
    { icon: Clock, label: "Hours", values: [{ text: officeHoursVal }] },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      <PageHero
        eyebrow="Contact / Get in touch"
        title="Let's build something"
        subtitle="Tell us about your project or question. We usually reply within one business day."
        meta={
          <div className="inline-flex items-center gap-2 border border-white/10 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            Accepting new projects
          </div>
        }
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          {/* Form */}
          <Sheet tone="dark" cellRef="A1" formula='=SEND(Message, "Tech Wiser")' tab="New enquiry">
            {submitStatus === "success" ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">
                <div className="mb-5 flex h-12 w-12 items-center justify-center border border-cyan-400/40 bg-cyan-400/10">
                  <CheckCircle2 className="h-6 w-6 text-cyan-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Message sent</h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-400">
                  Thanks for reaching out. We&apos;ll get back to you by email, usually within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitStatus("idle")}
                  className="mt-6 border border-white/15 px-4 py-2 text-sm text-neutral-300 transition-colors hover:border-cyan-400 hover:text-white"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <input id="name" name="name" required value={formData.name} onChange={handleChange} className={inputCls} placeholder="Your name" autoComplete="name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className={inputCls} placeholder="you@company.com" autoComplete="email" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" optional>Phone</Label>
                  <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className={inputCls} placeholder="+92 300 0000000" autoComplete="tel" />
                </div>

                <fieldset>
                  <legend className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-neutral-500">Topic</legend>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map((s) => {
                      const on = formData.subject === s;
                      return (
                        <label
                          key={s}
                          className={`cursor-pointer border px-3 py-1.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cyan-400 ${
                            on ? "border-cyan-400 bg-cyan-400/10 text-white" : "border-white/10 text-neutral-400 hover:border-white/25 hover:text-neutral-200"
                          }`}
                        >
                          <input type="radio" name="subject" value={s} checked={on} onChange={handleChange} className="sr-only" />
                          {s}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`${inputCls} resize-y`}
                    placeholder="What are you building? Share goals, timeline and budget if you have them."
                  />
                </div>

                {submitStatus === "error" && (
                  <p role="alert" className="border border-red-500/30 bg-red-500/5 px-3.5 py-2.5 text-sm text-red-400">
                    Something went wrong. Please try again, or email us directly at {emailVal}.
                  </p>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-neutral-500">We only use your details to reply to this message.</p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        Send message <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Sheet>

          {/* Contact channels */}
          <motion.aside {...reveal(0.1)} className="flex flex-col border border-white/10 bg-[#ffffff]">
            <div className="border-b border-white/10 bg-[#ececee] px-5 py-2.5 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
              Direct channels
            </div>
            <ul className="divide-y divide-white/10">
              {channels.map(({ icon: Icon, label, values }) => (
                <li key={label} className="flex gap-4 px-5 py-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-cyan-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{label}</p>
                    <div className="mt-1 space-y-0.5">
                      {values.map((v) =>
                        "href" in v && v.href ? (
                          <a
                            key={v.text}
                            href={v.href}
                            target={"external" in v && v.external ? "_blank" : undefined}
                            rel={"external" in v && v.external ? "noopener noreferrer" : undefined}
                            className="group flex items-start gap-1 break-words text-sm text-white transition-colors hover:text-cyan-400"
                          >
                            {v.text}
                            <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-600 transition-colors group-hover:text-cyan-400" />
                          </a>
                        ) : (
                          <p key={v.text} className="text-sm text-white">{v.text}</p>
                        )
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-auto border-t border-white/10 px-5 py-4 text-sm text-neutral-400">
              For urgent matters, calling is the fastest way to reach us during office hours.
            </div>
          </motion.aside>
        </div>

        {/* Map */}
        <Sheet tone="dark" cellRef="C1" formula={`=MAP("${addressVal}")`} tab="Office location">
          <div className="relative">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(addressVal)}&output=embed&zoom=15`}
              height="380"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full border-0 [filter:invert(0.9)_hue-rotate(180deg)_grayscale(0.4)_contrast(0.9)]"
              title="Tech Wiser Consulting office location"
            />
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 inline-flex items-center gap-2 border border-white/10 bg-[#f4f4f5]/90 px-3.5 py-2 text-sm text-white backdrop-blur transition-colors hover:border-cyan-400"
            >
              <MapPin className="h-4 w-4 text-cyan-400" /> Open in Google Maps
            </a>
          </div>
        </Sheet>
      </div>
    </div>
  );
};

export default Contact;
