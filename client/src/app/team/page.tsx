"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Linkedin, 
  Github, 
  Twitter, 
  Mail, 
  ArrowRight,
  Code2,
  Smartphone,
  Globe2,
  Briefcase,
  UserCircle
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

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

const Team = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const skills = [
    { name: "CEO", icon: <UserCircle className="w-5 h-5" /> },
    { name: "Project Manager", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Frontend Development", icon: <Code2 className="w-5 h-5" /> },
    { name: "Mobile Development", icon: <Smartphone className="w-5 h-5" /> },
    { name: "Full Stack", icon: <Globe2 className="w-5 h-5" /> },
  ];

  const retryFetch = () => {
    setLoading(true);
    fetchTeamMembers();
  };

  const filteredMembers = (() => {
    if (activeFilter === "all") return teamMembers;

    const filterName = activeFilter.toLowerCase();

    return teamMembers.filter((member) => {
      const roles = Array.isArray(member.role) 
        ? member.role.map(r => String(r).toLowerCase())
        : [String(member.role || '').toLowerCase()];
      const roleString = roles.join(' ');
      const expertise = (member.expertise || []).map((e) => String(e).toLowerCase());
      
      if (filterName === 'ceo') {
        return roles.some(r => r.includes('ceo'));
      }
      
      if (filterName === 'project manager') {
        return roles.some(r => r.includes('project manager'));
      }
      
      if (filterName === 'frontend development') {
        return roles.some(r => r.includes('frontend')) || expertise.includes('frontend development');
      }
      
      if (filterName === 'mobile development') {
        return roles.some(r => r.includes('mobile')) || expertise.includes('mobile development');
      }
      
      if (filterName === 'full stack') {
        return roles.some(r => r.includes('full stack')) || expertise.includes('full stack');
      }

      return false;
    });
  })();

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
      {/* Hero Section */}
      <section className="relative text-white pt-32 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: 'url(/back.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/60 to-slate-900/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 px-4">
              Our Team
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto px-4">
              Meet the talented individuals who bring innovation and expertise to every project
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0.1)} className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeFilter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Team
            </button>
            {skills.map((skill) => (
              <button
                key={skill.name}
                onClick={() => setActiveFilter(skill.name)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  activeFilter === skill.name
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {skill.icon}
                {skill.name}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[300px] flex items-center justify-center">
          {loading ? (
            <div className="text-center py-12 sm:py-20">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
              <p className="text-slate-600 text-base sm:text-lg">Loading team members...</p>
            </div>
          ) : error ? (
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
          ) : filteredMembers.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredMembers.map((member, index) => {
                const roles = Array.isArray(member.role) ? member.role : [member.role];
                const primaryRole = roles[0] || '';
                const secondaryRole = roles.length > 1 ? roles.slice(1).join(', ') : (member.expertise && member.expertise.length > 0 ? member.expertise[0] : 'Software Engineer');
                
                return (
                  <motion.div
                    key={member._id}
                    {...stagger(index * 0.1)}
                    className="bg-slate-50 rounded-3xl overflow-hidden hover:bg-slate-100 transition-colors duration-300"
                  >
                    <div className="p-6">
                      <div 
                        onClick={() => router.push(`/team/${member._id}`)}
                        className="cursor-pointer"
                      >
                        {/* Profile Picture */}
                        <div className="flex justify-center mb-6">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            whileHover={{ scale: 1.05 }}
                            className="relative"
                          >
                            <div className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden">
                              {member.image && (member.image.startsWith('http') || member.image.startsWith('/')) ? (
                                <motion.img
                                  src={member.image}
                                  alt={member.name}
                                  className="w-full h-full rounded-full object-cover"
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.3 }}
                                />
                              ) : (
                                <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-6xl">
                                  {member.image || '👨‍💼'}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </div>

                        {/* Name */}
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                          {member.name}
                        </h3>

                        {/* Primary Role */}
                        <p className="text-slate-700 text-sm font-medium text-center mb-1">
                          {primaryRole}
                        </p>

                        {/* Secondary Role/Specialization */}
                        <p className="text-slate-500 text-xs text-center mb-4">
                          {secondaryRole}
                        </p>

                        {/* Skills/Technologies */}
                        {member.skills && member.skills.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {member.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-white text-slate-700 text-xs font-medium rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {member.skills.length > 3 && (
                              <span className="px-3 py-1 bg-white text-slate-700 text-xs font-medium rounded-full">
                                +{member.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer with Icons and View Profile */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                          {member.email && (
                            <motion.a
                              href={`mailto:${member.email}`}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-slate-400 hover:text-slate-700 transition-colors"
                              aria-label={`Email ${member.name}`}
                            >
                              <Mail className="w-5 h-5" />
                            </motion.a>
                          )}
                          {member.linkedin && (
                            <motion.a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                              aria-label={`${member.name}'s LinkedIn`}
                            >
                              <Linkedin className="w-5 h-5" />
                            </motion.a>
                          )}
                        </div>
                        <motion.div 
                          onClick={() => router.push(`/team/${member._id}`)}
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-semibold cursor-pointer"
                        >
                          View Profile
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
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
