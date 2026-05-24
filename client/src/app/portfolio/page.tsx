"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Globe2,
  Smartphone,
  ShoppingCart,
  Building2,
  GraduationCap,
  Heart,
  Briefcase,
  Code2,
  ExternalLink,
  Github,
  Smile,
  Calendar,
  UserCheck,
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
  image: string;
  technologies: string[];
  link?: string;
  isActive: boolean;
}

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Applications" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "enterprise", label: "Enterprise Solutions" },
    { id: "other", label: "Other Projects" }
  ];

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

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter(project => project.category === activeFilter);

  const stats = [
    {
      number: "5+",
      label: "Projects Delivered",
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      number: "5+",
      label: "Happy Clients",
      icon: <Smile className="w-6 h-6" />,
    },
    {
      number: "4",
      label: "Team Members",
      icon: <UserCheck className="w-6 h-6" />,
    },
    {
      number: "5+",
      label: "Years Experience",
      icon: <Calendar className="w-6 h-6" />,
    }
  ];

  return (
    <div className="min-h-screen bg-white">


      {/* Stats */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                {...fadeUp(index * 0.1)}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-xl p-6 transition-all group"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 mb-4 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                  {stat.number}
                </div>
                <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeFilter === category.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

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
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <p className="text-slate-600 text-base sm:text-lg">No projects found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  {...stagger(index * 0.1)}
                  className="group"
                >
                  <Card className="p-0 overflow-hidden rounded-2xl bg-transparent border-0">
                    <CardContent className="p-0 flex flex-col gap-4">
                      <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            {project.image &&
                              (project.image.startsWith("http") ||
                                project.image.startsWith("/")) ? (
                              <img
                                src={project.image}
                                alt={project.title}
                                width="100%"
                                height={260}
                                className="rounded-2xl object-cover w-full h-[260px] transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-[260px] text-6xl">
                                {project.image || "🛒"}
                              </div>
                            )}
                          </a>
                        ) : project.image &&
                          (project.image.startsWith("http") ||
                            project.image.startsWith("/")) ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            width="100%"
                            height={260}
                            className="rounded-2xl object-cover w-full h-[260px] transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-[260px] text-6xl">
                            {project.image || "🛒"}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <h3 className="text-foreground text-xl font-semibold">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-normal h-7 bg-background text-foreground"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-normal h-7 bg-background text-foreground">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
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

export default Portfolio;
