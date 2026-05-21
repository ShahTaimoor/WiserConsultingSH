"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Linkedin,
  Github,
  Twitter,
  Mail,
  ArrowLeft,
  Code2,
  Database,
  Cloud,
  Smartphone,
  Globe2,
  Cpu,
  CheckCircle2
} from "lucide-react";

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

const TeamMemberPage = () => {
  const params = useParams();
  const memberId = params?.id as string;
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (memberId) {
      fetchTeamMember();
    }
  }, [memberId]);

  const fetchTeamMember = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/team/${memberId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch team member: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Team member response:', data);

      if (data.success && data.data) {
        setMember(data.data);
      } else {
        throw new Error('Team member not found');
      }
    } catch (error) {
      console.error('Error fetching team member:', error);
      setError(error instanceof Error ? error.message : 'Failed to load team member');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading team member...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Team Member Not Found</h1>
          <p className="text-slate-600 mb-6">{error || 'The team member you are looking for does not exist.'}</p>
          <Link href="/team" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Team
          </Link>
        </div>
      </div>
    );
  }

  const skillIcons: { [key: string]: React.ReactNode } = {
    "Frontend Development": <Code2 className="w-5 h-5" />,
    "Backend Development": <Database className="w-5 h-5" />,
    "Cloud Architecture": <Cloud className="w-5 h-5" />,
    "Mobile Development": <Smartphone className="w-5 h-5" />,
    "Full Stack": <Globe2 className="w-5 h-5" />,
  };

  // Get roles
  const roles = Array.isArray(member.role) ? member.role : [member.role];
  const primaryRole = roles[0] || '';
  const secondaryRole = roles.length > 1 ? roles.slice(1).join(', ') : (member.expertise && member.expertise.length > 0 ? member.expertise[0] : 'Software Engineer');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Team Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Link
              href="/team"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
            >
              <motion.div
                whileHover={{ x: -5 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
              <span>Back to Team</span>
            </Link>
          </motion.div>

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-row items-start gap-4 sm:gap-8"
          >
            {/* Profile Picture */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              {member.image && (member.image.startsWith('http') || member.image.startsWith('/')) ? (
                <div className="w-24 h-24 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center text-4xl sm:text-6xl md:text-8xl border-2 border-white/20 shadow-2xl">
                  {member.image || '👨‍💼'}
                </div>
              )}
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 text-left min-w-0">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3"
              >
                {member.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-base sm:text-xl md:text-2xl text-white mb-1 sm:mb-2"
              >
                {primaryRole}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-sm sm:text-base md:text-lg text-slate-300 mb-4 sm:mb-6"
              >
                {secondaryRole}
              </motion.p>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex items-center gap-2 sm:gap-3"
              >
                {member.linkedin && (
                  <motion.a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors backdrop-blur-sm"
                  >
                    <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.a>
                )}
                {member.email && (
                  <motion.a
                    href={`mailto:${member.email}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors backdrop-blur-sm"
                  >
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.a>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Skills & Technologies */}
            <div className="md:col-span-2">
              {member.skills && member.skills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                    Skills & Technologies
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {member.skills.map((skill, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-200 cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Expertise */}
              {member.expertise && member.expertise.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-12"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                    Areas of Expertise
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {member.expertise.map((exp, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ x: 5, scale: 1.02 }}
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        {skillIcons[exp] || <Cpu className="w-5 h-5 text-slate-600" />}
                        <span className="font-semibold text-slate-900">{exp}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Achievements */}
              {member.achievements && member.achievements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-12"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                    Key Achievements
                  </h2>
                  <div className="space-y-4">
                    {member.achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-600 leading-relaxed">{achievement}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Contact and Role */}
            <div className="space-y-6">
              {/* Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">Contact</h3>
                <div className="space-y-4">
                  {member.email && (
                    <motion.a
                      href={`mailto:${member.email}`}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Mail className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm break-all">{member.email}</span>
                    </motion.a>
                  )}
                  {member.linkedin && (
                    <motion.a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">LinkedIn Profile</span>
                    </motion.a>
                  )}
                  {member.github && (
                    <motion.a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Github className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">GitHub Profile</span>
                    </motion.a>
                  )}
                </div>
              </motion.div>

              {/* Role Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">Role</h3>
                <p className="text-slate-600">{primaryRole}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamMemberPage;
