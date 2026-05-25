"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  Building2,
  GraduationCap,
  Heart,
  Code2,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.8, delay, ease },
});

const stagger = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

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

const Portfolio = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
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
      console.error('Error fetching portfolios:', error);
      setError(error instanceof Error ? error.message : 'Failed to load portfolios');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">




      {/* Projects Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-slate-900"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 sm:py-20">
              <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
              <button
                onClick={fetchPortfolios}
                className="px-4 sm:px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm sm:text-base"
              >
                Retry
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <p className="text-slate-600 text-base sm:text-lg">No projects found.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 sm:gap-12">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  {...stagger(index * 0.1)}
                  className="group pb-8 border-b border-gray-200"
                >
                  <Card className="p-0 overflow-hidden rounded-2xl bg-transparent border-0 shadow-none">
                    <CardContent className="p-0 flex flex-col-reverse md:flex-row gap-6 md:gap-8 items-center">
                      <div className="flex-1 flex flex-col gap-3 px-2 md:px-0">
                        <h3 className="text-foreground text-xl sm:text-2xl font-semibold">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {project.description}
                          </p>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.technologies.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-normal bg-background text-foreground"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-normal bg-background text-foreground">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="w-full md:w-[45%] shrink-0">
                        {project.images && project.images.length > 0 ? (
                          <ImageSlider images={project.images} title={project.title} link={project.link} />
                        ) : (
                          <div className="flex items-center justify-center h-48 sm:h-64 text-6xl rounded-2xl bg-slate-100">🛒</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-4">
              Client Testimonials
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              What our clients say about working with us
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO, TechStart Inc.",
                content: "WISER CONSULTING transformed our business operations with their custom software solution. The team was professional, responsive, and delivered beyond our expectations.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "CTO, HealthCare Plus",
                content: "Outstanding work on our healthcare management system. The platform is robust, scalable, and has significantly improved our efficiency.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "Founder, FitLife App",
                content: "The mobile app they developed exceeded all our expectations. User feedback has been overwhelmingly positive, and the app has been a huge success.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                {...fadeUp(index * 0.1)}
                className="bg-white rounded-3xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-slate-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-slate-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-600">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp()}>
            <Code2 className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Let's create something amazing together. Get in touch to discuss your project.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors"
            >
              Start Your Project
            </a>
          </motion.div>
        </div>
      </section>
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

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl bg-slate-100 select-none"
      style={{ height: 280 }}
      onMouseMove={link ? handleMouseMove : undefined}
      onMouseEnter={() => { setPaused(true); if (link) setHover(true); }}
      onMouseLeave={() => { setPaused(false); setHover(false); }}
    >
      {/* Background layer — prev slide moves out slowly (parallax) */}
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
                <img src={img} alt={`${title} ${current + 1}`} className="w-full h-full object-contain" />
              </a>
            ) : (
              <img src={img} alt={`${title} ${current + 1}`} className="w-full h-full object-contain" />
            )
          ) : (
            <div className="flex items-center justify-center w-full h-full text-6xl">{img || "🛒"}</div>
          )}
        </motion.div>
      </AnimatePresence>

      {link && hover && (
        <div
          className="pointer-events-none absolute flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-lg -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ left: pos.x, top: pos.y }}
        >
          <span className="text-sm font-semibold tracking-wide whitespace-nowrap text-black">{link}</span>
        </div>
      )}

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goTo(current - 1); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors z-10"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goTo(current + 1); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors z-10"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-5' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Portfolio;
