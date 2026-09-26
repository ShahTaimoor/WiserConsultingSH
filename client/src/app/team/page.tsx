"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHero, Sheet, HeadCell, RowNum, reveal } from "@/components/shared/Sheet";

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

const getRoles = (member: TeamMember) =>
  (Array.isArray(member.role) ? member.role : [member.role]).filter(Boolean);

const getPrimaryRole = (member: TeamMember) => getRoles(member)[0] || "Team Member";

const hasImageUrl = (member: TeamMember) =>
  !!member.image && (member.image.startsWith("http") || member.image.startsWith("/"));

const initials = (name: string) =>
  name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const Team = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const url = `${API_URL}/team?isActive=true`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to fetch team members: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      const sortTeamMembers = (members: TeamMember[]): TeamMember[] => {
        return members.sort((a, b) => {
          const rolesA = Array.isArray(a.role) ? a.role.map(r => String(r).toLowerCase()) : [String(a.role || '').toLowerCase()];
          const rolesB = Array.isArray(b.role) ? b.role.map(r => String(r).toLowerCase()) : [String(b.role || '').toLowerCase()];

          const getPriority = (roles: string[]) => {
            for (const role of roles) {
              if (role.includes('ceo')) return 1;
              if (role.includes('project manager')) return 2;
              if (role.includes('full stack')) return 3;
            }
            return 4;
          };

          const priorityA = getPriority(rolesA);
          const priorityB = getPriority(rolesB);

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }

          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return a.name.localeCompare(b.name);
        });
      };

      if (data.success) {
        let members: TeamMember[] = [];
        if (Array.isArray(data.data)) {
          members = data.data;
        } else if (Array.isArray(data)) {
          members = data;
        } else {
          setTeamMembers([]);
          return;
        }
        setTeamMembers(sortTeamMembers(members));
      } else {
        setTeamMembers([]);
      }
    } catch (error: any) {
      let errorMessage = 'Failed to load team members. ';
      if (error.name === 'AbortError') {
        errorMessage += 'Request timed out. Please check your connection and try again.';
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage += 'Unable to connect to the server. Please ensure the backend is running on port 5000.';
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again later.';
      }

      setError(errorMessage);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    fetchTeamMembers();
  };

  useEffect(() => {
    if (activeIndex >= teamMembers.length) {
      setActiveIndex(0);
    }
  }, [teamMembers.length, activeIndex]);

  const select = useCallback((index: number) => {
    setActiveIndex((prev) => {
      setDirection(index >= prev ? 1 : -1);
      return index;
    });
  }, []);

  const step = useCallback((delta: number) => {
    if (teamMembers.length <= 1) return;
    setDirection(delta);
    setActiveIndex((prev) => (prev + delta + teamMembers.length) % teamMembers.length);
  }, [teamMembers.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const activeMember = teamMembers[activeIndex];

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <PageHero
        eyebrow="People / Team"
        title="Meet the Team"
        subtitle="The engineers and designers who plan, build and ship every project."
        meta={
          <div className="border border-white/10 font-mono text-[11px] px-3 py-2">
            <p className="text-neutral-500 uppercase tracking-wider">Members</p>
            <p className="text-white text-lg mt-0.5">{String(teamMembers.length).padStart(2, "0")}</p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {loading ? (
          <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-px bg-white/[0.08] border border-white/10">
            <div className="aspect-[1792/1024] bg-[#111214] animate-pulse" />
            <div className="bg-[#111214] p-6 space-y-3">
              <div className="h-3 w-20 bg-white/10 animate-pulse" />
              <div className="h-7 w-2/3 bg-white/10 animate-pulse" />
              <div className="h-3 w-full bg-white/5 animate-pulse" />
              <div className="h-3 w-4/5 bg-white/5 animate-pulse" />
            </div>
          </div>
        ) : error ? (
          <div className="border border-red-500/30 bg-red-500/5 p-6 text-center max-w-xl mx-auto">
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={retryFetch}
              className="px-4 py-2 bg-cyan-400 text-neutral-950 text-sm font-semibold hover:bg-cyan-300 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="border border-white/10 p-10 text-center">
            <p className="text-neutral-400 mb-4">No team members found.</p>
            <button
              onClick={retryFetch}
              className="px-4 py-2 bg-cyan-400 text-neutral-950 text-sm font-semibold hover:bg-cyan-300 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Featured member */}
            {activeMember && (
              <Sheet
                tone="dark"
                cellRef={`A${activeIndex + 2}`}
                formula={`=INDEX(Team, ${activeIndex + 1}) → "${activeMember.name}"`}
                tab="Profile"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-px bg-white/[0.08]">
                  <div className="relative aspect-[1792/1024] overflow-hidden bg-black">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                      <motion.div
                        key={activeMember._id}
                        custom={direction}
                        initial={{ x: direction > 0 ? "12%" : "-12%", opacity: 0, scale: 1.04 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: direction > 0 ? "-8%" : "8%", opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0"
                      >
                        {hasImageUrl(activeMember) ? (
                           
                          <img
                            src={activeMember.image}
                            alt={activeMember.name}
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-7xl">{activeMember.image || "👨‍💼"}</div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                    <span className="absolute left-0 bottom-0 z-10 bg-neutral-950 text-cyan-400 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(teamMembers.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="bg-[#111214] p-5 sm:p-7 flex flex-col gap-5">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeMember._id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35 }}
                        className="flex-1"
                      >
                        <p className="font-mono text-[11px] uppercase tracking-wider text-cyan-400 mb-2">
                          {getPrimaryRole(activeMember)}
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">{activeMember.name}</h2>
                        {getRoles(activeMember).length > 1 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {getRoles(activeMember).slice(1).map((role) => (
                              <span key={role} className="font-mono text-[10px] px-2 py-1 border border-white/10 text-neutral-300">{role}</span>
                            ))}
                          </div>
                        )}
                        {activeMember.bio && (
                          <p className="mt-4 text-sm text-neutral-400 leading-relaxed line-clamp-[9]">{activeMember.bio}</p>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                      <Link
                        href={`/team/${activeMember._id}`}
                        className="group inline-flex items-center gap-2 px-4 py-2 bg-cyan-400 text-neutral-950 text-sm font-semibold hover:bg-cyan-300 transition-colors"
                      >
                        View Profile
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => step(-1)}
                          disabled={teamMembers.length <= 1}
                          aria-label="Previous team member"
                          className="w-9 h-9 flex items-center justify-center border border-white/10 text-neutral-300 hover:text-neutral-950 hover:bg-cyan-400 hover:border-cyan-400 transition-colors disabled:opacity-40"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => step(1)}
                          disabled={teamMembers.length <= 1}
                          aria-label="Next team member"
                          className="w-9 h-9 -ml-px flex items-center justify-center border border-white/10 text-neutral-300 hover:text-neutral-950 hover:bg-cyan-400 hover:border-cyan-400 transition-colors disabled:opacity-40"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Sheet>
            )}

            {/* Roster */}
            <section>
              <motion.div {...reveal()} className="flex items-end justify-between gap-4 mb-3">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-cyan-400 mb-1">Roster</p>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">All Members</h2>
                </div>
                <p className="hidden sm:block font-mono text-[11px] text-neutral-500">Click a row · ← → to browse</p>
              </motion.div>
              <Sheet tone="light" cellRef="A1" formula="=SORT(Team, Role)" tab="Roster">
                <div className="grid grid-cols-[40px_minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-[40px_minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,2fr)] gap-px bg-neutral-200">
                  <HeadCell tone="light" />
                  <HeadCell tone="light">A</HeadCell>
                  <HeadCell tone="light">B</HeadCell>
                  <HeadCell tone="light" className="hidden md:flex">C</HeadCell>

                  <RowNum tone="light" n={1} className="flex" />
                  <div className="bg-white px-3 py-2 text-xs font-semibold text-neutral-950">Member</div>
                  <div className="bg-white px-3 py-2 text-xs font-semibold text-neutral-950">Role</div>
                  <div className="hidden md:block bg-white px-3 py-2 text-xs font-semibold text-neutral-950">About</div>

                  {teamMembers.map((member, i) => {
                    const active = i === activeIndex;
                    return (
                      <motion.button
                        key={member._id}
                        type="button"
                        onClick={() => {
                          select(i);
                          if (lenis) lenis.scrollTo(0);
                          else window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        {...reveal(i * 0.05)}
                        className="group col-span-full grid grid-cols-subgrid text-left gap-px"
                      >
                        <RowNum tone="light" n={i + 2} className={`flex ${active ? "!bg-cyan-400 !text-neutral-950" : ""}`} />
                        <span className={`relative flex items-center gap-3 px-3 py-2.5 transition-colors ${active ? "bg-cyan-50" : "bg-white group-hover:bg-neutral-50"}`}>
                          {active && (
                            <motion.span layoutId="roster-active" className="absolute inset-y-0 left-0 w-0.5 bg-cyan-500" />
                          )}
                          {hasImageUrl(member) ? (
                             
                            <img src={member.image} alt="" className="w-10 h-7 shrink-0 object-cover object-right bg-neutral-100" />
                          ) : (
                            <span className="w-10 h-7 shrink-0 bg-neutral-950 text-cyan-400 flex items-center justify-center text-[10px] font-semibold">
                              {initials(member.name)}
                            </span>
                          )}
                          <span className="text-sm font-medium text-neutral-950 truncate">{member.name}</span>
                        </span>
                        <span className={`flex items-center px-3 py-2.5 font-mono text-[11px] uppercase tracking-wide text-cyan-700 transition-colors ${active ? "bg-cyan-50" : "bg-white group-hover:bg-neutral-50"}`}>
                          <span className="truncate">{getPrimaryRole(member)}</span>
                        </span>
                        <span className={`hidden md:flex items-center px-3 py-2.5 text-sm text-neutral-600 transition-colors ${active ? "bg-cyan-50" : "bg-white group-hover:bg-neutral-50"}`}>
                          <span className="truncate">{member.bio}</span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </Sheet>
            </section>
          </>
        )}

        {/* CTA */}
        <motion.section
          {...reveal()}
          className="relative overflow-hidden border border-white/10 p-6 sm:p-10 bg-gradient-to-br from-cyan-300 via-cyan-600 to-[#0a0a0b] flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-neutral-900/70 mb-2">Careers / Open</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-950 tracking-tight">Join Our Team</h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-900/80 max-w-lg">
              We&apos;re always looking for talented individuals to join our growing team.
            </p>
          </div>
          <Link
            href="/contact"
            className="group self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 bg-neutral-950 text-white text-sm font-semibold hover:bg-neutral-900 transition-colors"
          >
            Get In Touch
            <ArrowUpRight className="w-4 h-4 text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.section>
      </div>
    </div>
  );
};

export default Team;
