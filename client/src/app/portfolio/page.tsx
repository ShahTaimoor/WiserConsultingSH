"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { PORTFOLIO_CATEGORIES } from "@/constants";
import { PageHero, Sheet, HeadCell, RowNum, SELECTABLE, reveal } from "@/components/shared/Sheet";

interface PortfolioProject {
  _id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  technologies: string[];
  link?: string;
  isActive: boolean;
}

const TESTIMONIALS = [
  {
    name: "Dr Muhammad Wahab",
    role: "Wiser Step Business Suite",
    content: "TECH WISER CONSULTING transformed our business operations with their custom software solution. The team was professional, responsive, and delivered beyond our expectations.",
    rating: 5,
  },
  {
    name: "Muhammad Amir",
    role: "Gultrader",
    content: "TECH WISER CONSULTING built a seamless, high-performance e-commerce platform for Gultraders. Their solution significantly boosted our online sales and provided an exceptional shopping experience for our customers.",
    rating: 5,
  },
  {
    name: "Waheed Murad",
    role: "Consultancy",
    content: "TECH WISER CONSULTING provided exceptional guidance and strategic IT insights for our firm. Their expertise helped us streamline our operations and achieve our business goals much faster than anticipated.",
    rating: 5,
  },
];

const categoryLabel = (id: string) =>
  PORTFOLIO_CATEGORIES.find((c) => c.id === id)?.label ?? id.charAt(0).toUpperCase() + id.slice(1);

const hostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const Portfolio = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      setError(null);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/portfolios?isActive=true`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch portfolios');
      }

      const data = await res.json();
      if (data.success) {
        setProjects(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch portfolios');
      }
    } catch (error) {

      setError(error instanceof Error ? error.message : 'Failed to load portfolios');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Only offer tabs for categories that actually have projects.
  const tabs = useMemo(() => {
    const present = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
    return [{ id: "all", label: "All" }, ...present.map((id) => ({ id, label: categoryLabel(id) }))];
  }, [projects]);

  const visible = category === "all" ? projects : projects.filter((p) => p.category === category);
  const techCount = new Set(projects.flatMap((p) => p.technologies ?? [])).size;

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <PageHero
        eyebrow="Work / Projects"
        title="Selected Projects"
        subtitle="Live products we have designed, built and shipped for our clients."
        meta={
          <div className="grid grid-cols-2 border border-white/10 font-mono text-[11px]">
            <div className="px-3 py-2 border-r border-white/10">
              <p className="text-neutral-500 uppercase tracking-wider">Projects</p>
              <p className="text-white text-lg mt-0.5">{String(projects.length).padStart(2, "0")}</p>
            </div>
            <div className="px-3 py-2">
              <p className="text-neutral-500 uppercase tracking-wider">Technologies</p>
              <p className="text-white text-lg mt-0.5">{String(techCount).padStart(2, "0")}</p>
            </div>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {/* Projects */}
        {loading ? (
          <div className="border border-white/10 bg-[#111214]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-px bg-white/[0.08] border-b border-white/10 last:border-b-0">
                <div className="aspect-[16/10] bg-[#111214] animate-pulse" />
                <div className="bg-[#111214] p-5 space-y-3">
                  <div className="h-3 w-24 bg-white/10 animate-pulse" />
                  <div className="h-6 w-3/4 bg-white/10 animate-pulse" />
                  <div className="h-3 w-full bg-white/5 animate-pulse" />
                  <div className="h-3 w-5/6 bg-white/5 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="border border-red-500/30 bg-red-500/5 p-6 text-center">
            <p className="text-red-400 mb-4 text-sm">{error}</p>
            <button
              onClick={fetchPortfolios}
              className="px-4 py-2 bg-cyan-400 text-neutral-950 text-sm font-semibold hover:bg-cyan-300 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="border border-white/10 p-10 text-center text-neutral-400">No projects found.</div>
        ) : (
          <Sheet
            tone="dark"
            cellRef="A1"
            formula={`=FILTER(Projects, Category = "${category === "all" ? "*" : categoryLabel(category)}")`}
            tabs={tabs}
            activeTab={category}
            onTabChange={setCategory}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[40px_minmax(0,1.1fr)_minmax(0,1fr)] gap-px bg-white/[0.08]">
              <HeadCell tone="dark" className="hidden lg:flex" />
              <HeadCell tone="dark" className="hidden lg:flex">A · Preview</HeadCell>
              <HeadCell tone="dark" className="hidden lg:flex">B · Details</HeadCell>

              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((project, index) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="col-span-full grid grid-cols-1 lg:grid-cols-[40px_minmax(0,1.1fr)_minmax(0,1fr)] gap-px"
                  >
                    <RowNum tone="dark" n={index + 1} className="hidden lg:flex" />
                    <div className="bg-[#111214] p-3">
                      {project.images && project.images.length > 0 ? (
                        <ImageSlider images={project.images} title={project.title} link={project.link} />
                      ) : (
                        <div className="flex items-center justify-center aspect-[16/10] bg-neutral-900 font-mono text-xs text-neutral-600">
                          No preview
                        </div>
                      )}
                    </div>
                    <div className={`bg-[#111214] ${SELECTABLE} p-5 sm:p-6 flex flex-col gap-4`}>
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-wider text-cyan-400 mb-2">
                          {String(index + 1).padStart(2, "0")} · {categoryLabel(project.category)}
                        </p>
                        <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-snug">
                          {project.title}
                        </h2>
                        {project.description && (
                          <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{project.description}</p>
                        )}
                      </div>

                      {project.technologies && project.technologies.length > 0 && (
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600 mb-2">Stack</p>
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="font-mono text-[11px] px-2 py-1 border border-white/10 text-neutral-300 hover:border-cyan-400/60 hover:text-cyan-300 transition-colors"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group mt-auto self-start inline-flex items-center gap-2 px-4 py-2 bg-cyan-400 text-neutral-950 text-sm font-semibold hover:bg-cyan-300 hover:shadow-[0_0_24px_rgba(34,211,238,0.4)] transition-all"
                        >
                          {hostname(project.link)}
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Sheet>
        )}

        {/* Testimonials */}
        <section>
          <motion.div {...reveal()} className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 mb-3">
            <div>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-cyan-400 mb-1">Clients / Reviews</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Client Testimonials</h2>
            </div>
            <p className="text-sm text-neutral-400">What our clients say about working with us</p>
          </motion.div>
          <Sheet tone="light" cellRef="C1" formula="=AVERAGE(Rating) → 5.0" tab="Reviews">
            <div className="grid grid-cols-1 md:grid-cols-[40px_repeat(3,minmax(0,1fr))] gap-px bg-neutral-200">
              <HeadCell tone="light" className="hidden md:flex" />
              {["A", "B", "C"].map((l) => (
                <HeadCell key={l} tone="light" className="hidden md:flex">{l}</HeadCell>
              ))}
              <RowNum tone="light" n={1} className="hidden md:flex" />
              {TESTIMONIALS.map((t, i) => (
                <motion.figure
                  key={t.name}
                  {...reveal(i * 0.08)}
                  className={`bg-white ${SELECTABLE} p-5 flex flex-col gap-4`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-neutral-200" />
                  </div>
                  <blockquote className="text-sm text-neutral-700 leading-relaxed flex-1">
                    &ldquo;{t.content}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                    <span className="w-8 h-8 shrink-0 bg-neutral-950 text-cyan-400 flex items-center justify-center text-xs font-semibold">
                      {t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-neutral-950 truncate">{t.name}</span>
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 truncate">{t.role}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </Sheet>
        </section>

        {/* CTA */}
        <motion.section
          {...reveal()}
          className="relative overflow-hidden border border-white/10 p-6 sm:p-10 bg-gradient-to-br from-cyan-300 via-cyan-600 to-[#0a0a0b] flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-neutral-900/70 mb-2">Next / Your project</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-950 tracking-tight">Ready to Start Your Project?</h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-900/80 max-w-lg">
              Let&apos;s create something amazing together. Get in touch to discuss your project.
            </p>
          </div>
          <a
            href="/contact"
            className="group self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 bg-neutral-950 text-white text-sm font-semibold hover:bg-neutral-900 transition-colors"
          >
            Start Your Project
            <ArrowUpRight className="w-4 h-4 text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.section>
      </div>
    </div>
  );
};

const ImageSlider = ({ images, title, link }: { images: string[]; title: string; link?: string }) => {
  const [[current, direction], setCurrent] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const goTo = useCallback((index: number) => {
    setCurrent(([prev]) => [((index % images.length) + images.length) % images.length, index > prev ? 1 : -1]);
  }, [images.length]);

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, [images.length, paused, goNext]);

  const img = images[current];
  const isUrl = img.startsWith("http") || img.startsWith("/");

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const picture = (
     
    <img
      src={img}
      alt={`${title} ${current + 1}`}
      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/slider:scale-[1.03]"
    />
  );

  return (
    <div
      ref={ref}
      className="group/slider relative overflow-hidden aspect-[16/10] bg-neutral-900 select-none"
      onMouseMove={link ? handleMouseMove : undefined}
      onMouseEnter={() => { setPaused(true); if (link) setHover(true); }}
      onMouseLeave={() => { setPaused(false); setHover(false); }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ x: direction > 0 ? 300 : -300, scale: 0.85, opacity: 0 }}
          animate={{ x: 0, scale: 1, opacity: 1 }}
          exit={{ x: direction > 0 ? -150 : 150, scale: 0.9, opacity: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {isUrl ? (
            link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                {picture}
              </a>
            ) : (
              picture
            )
          ) : (
            <div className="flex items-center justify-center w-full h-full text-6xl">{img || "🛒"}</div>
          )}
        </motion.div>
      </AnimatePresence>

      {link && hover && (
        <div
          className="pointer-events-none absolute flex items-center gap-1.5 bg-cyan-400 px-3 py-1.5 -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ left: pos.x, top: pos.y }}
        >
          <span className="font-mono text-xs font-semibold whitespace-nowrap text-neutral-950">Visit {hostname(link)}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-950" />
        </div>
      )}

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goTo(current - 1); }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-neutral-950/80 text-white flex items-center justify-center hover:bg-cyan-400 hover:text-neutral-950 transition-colors z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goTo(current + 1); }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-neutral-950/80 text-white flex items-center justify-center hover:bg-cyan-400 hover:text-neutral-950 transition-colors z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                aria-label={`Show image ${i + 1}`}
                className={`h-1 transition-all ${i === current ? 'bg-cyan-400 w-6' : 'bg-white/50 w-3'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Portfolio;
