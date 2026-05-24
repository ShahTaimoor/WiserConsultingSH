"use client";

import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.8, delay, ease },
});

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

const getPrimaryRole = (member: TeamMember) => {
  const roles = Array.isArray(member.role) ? member.role : [member.role];
  return roles[0] || "Team Member";
};

const CARD_WIDTH_RATIO = 2 / 3; // active card 2/3 width → next card shows ~half on the right

function HoverCard({
  children,
  cardWidth,
  CARD_WIDTH_RATIO,
}: {
  children: React.ReactNode;
  cardWidth: number;
  CARD_WIDTH_RATIO: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex-shrink-0 aspect-[1792/1024] min-h-[200px] max-h-[600px] sm:min-h-[260px] lg:min-h-[300px] rounded-[32px] sm:rounded-[40px] overflow-hidden bg-black cursor-pointer transition-all duration-300 hover:scale-[1.01]"
      style={{
        width: cardWidth > 0 ? cardWidth : `${CARD_WIDTH_RATIO * 100}%`,
        aspectRatio: "1792 / 1024",
      }}
    >
      {children}
      {hover && (
        <div
          className="pointer-events-none absolute flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-lg -translate-x-1/2 -translate-y-1/2"
          style={{ left: pos.x, top: pos.y }}
        >
          <Play className="w-5 h-5 fill-black text-black" />
          <span className="text-sm font-semibold tracking-wide whitespace-nowrap text-black">Watch Video</span>
        </div>
      )}
    </div>
  );
}

const Team = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [slideStep, setSlideStep] = useState(0);

  const measureCarousel = useCallback(() => {
    const viewport = carouselRef.current;
    const track = trackRef.current;
    if (!viewport) return;

    const cardW = Math.round(viewport.clientWidth * CARD_WIDTH_RATIO);
    setCardWidth(cardW);

    const measureStep = () => {
      if (track && track.children.length > 1) {
        const first = track.children[0] as HTMLElement;
        const second = track.children[1] as HTMLElement;
        const step = second.offsetLeft - first.offsetLeft;
        setSlideStep(step > 0 ? step : cardW + 20);
      } else {
        setSlideStep(cardW + 20);
      }
    };

    measureStep();
    requestAnimationFrame(measureStep);
  }, []);

  useLayoutEffect(() => {
    if (loading || teamMembers.length === 0) return;

    measureCarousel();

    const observer = new ResizeObserver(measureCarousel);
    const node = carouselRef.current;
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [loading, teamMembers.length, measureCarousel]);

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
        let errorText = '';
        try {
          errorText = await res.text();
          console.error('API Error Response:', errorText);
        } catch (e) {
          console.error('Could not read error response');
        }
        throw new Error(`Failed to fetch team members: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Team members response:', data);

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
          console.warn('Unexpected API response format:', data);
          setTeamMembers([]);
          return;
        }
        setTeamMembers(sortTeamMembers(members));
      } else {
        console.warn('API returned success: false', data);
        setTeamMembers([]);
      }
    } catch (error: any) {
      console.error('Error fetching team members:', error);

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
    setLoading(true);
    fetchTeamMembers();
  };

  useEffect(() => {
    if (activeIndex >= teamMembers.length) {
      setActiveIndex(0);
    }
  }, [teamMembers.length, activeIndex]);

  const goToPrev = () => {
    if (teamMembers.length <= 1) return;
    setActiveIndex((prev) =>
      prev === 0 ? teamMembers.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    if (teamMembers.length <= 1) return;
    setActiveIndex((prev) =>
      prev === teamMembers.length - 1 ? 0 : prev + 1
    );
  };

  const activeMember = teamMembers[activeIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">


      {/* Team Carousel */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className=" w-full min-h-[300px] px-3 sm:px-5 lg:px-8">
          {error ? (
            <div className="text-center py-12 sm:py-20">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
                <p className="text-red-800 text-sm sm:text-lg mb-4">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    fetchTeamMembers();
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm sm:text-base"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <p className="text-slate-600 text-base sm:text-lg mb-4">No team members found.</p>
              <button
                onClick={retryFetch}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm sm:text-base"
              >
                Retry
              </button>
            </div>
          ) : (
            <motion.div {...fadeUp(0.15)}>
              {/* Carousel — active card ~72% width, next card peeks on the right */}
              <div ref={carouselRef} className="overflow-hidden">
                <div
                  ref={trackRef}
                  className="flex gap-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: `translateX(-${activeIndex * slideStep}px)`,
                  }}
                >
                  {teamMembers.map((member) => {
                    const primaryRole = getPrimaryRole(member);
                    const hasImage =
                      member.image &&
                      (member.image.startsWith("http") ||
                        member.image.startsWith("/"));

                    return (
                      <HoverCard
                        key={member._id}
                        cardWidth={cardWidth}
                        CARD_WIDTH_RATIO={CARD_WIDTH_RATIO}
                      >
                        {hasImage ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="absolute inset-0 h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-7xl sm:text-8xl">
                            {member.image || "👨‍💼"}
                          </div>
                        )}
                      </HoverCard>
                    );
                  })}
                </div>
              </div>

              {/* Info + navigation */}
              {activeMember && (
                <div className="mt-4 sm:mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <motion.div
                    key={activeMember._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="max-w-2xl"
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                      {getPrimaryRole(activeMember)}
                    </h3>
                    {activeMember.bio && (
                      <p className="mt-1 text-base sm:text-lg text-neutral-600 leading-relaxed">
                        {activeMember.bio}
                      </p>
                    )}
                  </motion.div>

                  <div className="flex items-center gap-3 self-start md:self-auto">
                    <span className="text-sm text-neutral-400 tabular-nums">
                      {String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(teamMembers.length).padStart(2, "0")}
                    </span>
                    <div className="inline-flex items-center rounded-full bg-neutral-100 p-1.5">
                      <button
                        type="button"
                        onClick={goToPrev}
                        disabled={teamMembers.length <= 1}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Previous team member"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={goToNext}
                        disabled={teamMembers.length <= 1}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Next team member"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Join Our Team
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our growing team
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors"
            >
              Get In Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Team;
