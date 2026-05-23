'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AssessmentForm from './AssessmentForm';
import { useSettings } from '@/context/SettingsContext';
import { 
  Globe2, 
  FileCheck2, 
  Users, 
  // ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Clock,
  Shield,
  Award,
  TrendingUp,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchAdminComments } from '@/redux/slices/formSubmission/formSubmissionSlice';

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

interface AuthState {
  user: {
    email: string;
  } | null;
}

type AdminComment = {
  documentId: string;
  documentName: string;
  comment: string;
  createdAt: string;
};

const SoftwareConsultation: React.FC = () => {
  const { settings } = useSettings();
  const dispatch = useDispatch<AppDispatch>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const technologies: { name: string; icon: string }[] = [
    { name: 'Web Development', icon: '🌐' },
    { name: 'Mobile Apps', icon: '📱' },
    { name: 'Cloud Solutions', icon: '☁️' },
    { name: 'Enterprise Software', icon: '🏢' },
    { name: 'E-Commerce', icon: '🛒' },
  ];

  const { user } = useSelector((state: RootState) => state.auth) as { user: { email: string } | null };
  const { adminComments } = useSelector((state: RootState) => state.formSubmission);

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchAdminComments(user.email));
    }
  }, [user?.email, dispatch]);

  const groupCommentsByDocument = (comments: AdminComment[]) => {
    const grouped: { [key: string]: AdminComment[] } = {};
    comments.forEach((c) => {
      if (!grouped[c.documentName]) grouped[c.documentName] = [];
      grouped[c.documentName].push(c);
    });
    return grouped;
  };

  const stats = [
    { value: '5+', label: 'Projects Delivered', icon: <CheckCircle2 className="w-6 h-6" /> },
    { value: '98%', label: 'Client Satisfaction', icon: <TrendingUp className="w-6 h-6" /> },
    { value: '5+', label: 'Years Experience', icon: <Award className="w-6 h-6" /> },
    { value: '24/7', label: 'Support Available', icon: <Shield className="w-6 h-6" /> },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Free Consultation',
      description: 'Schedule a free consultation to discuss your software requirements and project goals.',
      icon: <Phone className="w-8 h-8" />,
    },
    {
      step: '02',
      title: 'Project Planning',
      description: 'Our experts analyze your requirements and create a comprehensive project plan.',
      icon: <FileCheck2 className="w-8 h-8" />,
    },
    {
      step: '03',
      title: 'Development',
      description: 'We develop your software solution with attention to detail and quality.',
      icon: <CheckCircle2 className="w-8 h-8" />,
    },
    {
      step: '04',
      title: 'Project Delivery',
      description: 'Track your project progress and receive your completed software solution.',
      icon: <Award className="w-8 h-8" />,
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/U.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div {...fadeUp()} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">Trusted Software House Since 2020</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight px-4">
              {"Transform Your Business".split(' ').map((word, i) => (
                <motion.span key={i} {...stagger(i * 0.1)} className="inline-block">{word}{' '}</motion.span>
              ))}
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                {"With Software Solutions".split(' ').map((word, i) => (
                  <motion.span key={i} {...stagger(0.3 + i * 0.1)} className="inline-block">{word}{' '}</motion.span>
                ))}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed px-4">
              Expert software development services for businesses of all sizes. 
              Get personalized software solutions tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white font-semibold rounded-lg text-base sm:text-lg border-2 border-white hover:bg-white/10 transition-all"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                {...fadeUp(index * 0.1)}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-2xl mb-4 text-slate-700">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-4 px-4">
              Why Choose Our Software Services
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              We combine expertise, personalized service, and proven success rates to make your software development journey smooth and successful.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Globe2 className="w-8 h-8" />} 
              title="Personalized Solutions" 
              description="Custom software solutions tailored to your specific business needs. Our experts understand every project is unique."
            />
            <ServiceCard 
              icon={<FileCheck2 className="w-8 h-8" />} 
              title="Complete Development" 
              description="From requirements analysis to deployment, everything is handled with precision and attention to detail by our team."
            />
            <ServiceCard 
              icon={<Users className="w-8 h-8" />} 
              title="Team Collaboration" 
              description="Dedicated support for your team throughout the development process ensuring smooth communication and delivery."
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-4 px-4">
              Our Simple Process
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Four simple steps to get your software solution delivered
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                {...stagger(index * 0.1)}
                className="relative"
              >
                <div className="bg-white p-8 rounded-2xl transition-all h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-5xl font-bold text-slate-200">{step.step}</div>
                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-200 transform -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-4 px-4">
              Our Technology Stack
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              We use cutting-edge technologies to build modern, scalable software solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {technologies.map((tech, i) => (
              <motion.div
                key={i}
                {...stagger(i * 0.1)}
                whileHover={{ y: -8, scale: 1.05 }}
                className="bg-white p-6 rounded-2xl transition-all cursor-pointer group"
              >
                <div className="aspect-video mb-4 relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <span className="text-6xl">{tech.icon}</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-center group-hover:text-slate-700 transition-colors">
                  {tech.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp()} className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Start Your Software Project?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Contact us today for a free consultation and let our expert team guide you through every step of the software development process.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <motion.a
                href={`tel:${(settings?.contactInfo?.phone || "+923130922988").replace(/\s+/g, '')}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-slate-950 font-semibold rounded-full text-lg transition-all flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Us Now
              </motion.a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span className="text-sm">{settings?.contactInfo?.email || "taimour448@gmail.com"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <div className="flex flex-wrap items-center gap-2">
                  {settings?.contactInfo?.phone && (
                    <a href={`tel:${settings.contactInfo.phone.replace(/\s+/g, '')}`} className="text-sm hover:text-white transition-colors">
                      {settings.contactInfo.phone}
                    </a>
                  )}
                  {settings?.contactInfo?.phone && settings?.contactInfo?.phone2 && (
                    <span className="text-slate-500">|</span>
                  )}
                  {settings?.contactInfo?.phone2 && (
                    <a href={`tel:${settings.contactInfo.phone2.replace(/\s+/g, '')}`} className="text-sm hover:text-white transition-colors">
                      {settings.contactInfo.phone2}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">{settings?.contactInfo?.address || "Deans Trade Center, UG 390, Peshawar, Pakistan"}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comments Toggle Button */}
      {user && (
        <>
          <button
            onClick={() => setShowComments(!showComments)}
            className="fixed top-40 right-0 z-50 bg-slate-900 text-white p-3 rounded-l-xl hover:bg-slate-800 transition-all border border-slate-700"
          >
            {showComments ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {adminComments.length > 0 && (
              <span className="absolute -top-2 -left-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {adminComments.length}
              </span>
            )}
          </button>

          {/* Comments Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: showComments ? 0 : "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-20 right-0 w-96 h-[85vh] bg-white border-l border-slate-200 rounded-l-2xl overflow-hidden z-40"
          >
            <div className="h-full flex flex-col">
              <div className="px-6 py-4 bg-slate-900 text-white border-b border-slate-700">
                <h3 className="text-lg font-semibold">Admin Comments</h3>
                <p className="text-sm text-slate-300 mt-1">Review feedback on your documents</p>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {adminComments.length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(groupCommentsByDocument(adminComments)).map(([docName, comments]) => (
                      <div key={docName} className="mb-6">
                        <h4 className="font-semibold text-sm text-slate-900 mb-3 pb-2 border-b border-slate-200">
                          {docName}
                        </h4>
                        <div className="space-y-3">
                          {comments.map((c, i) => (
                            <div
                              key={i}
                              className="bg-slate-50 p-4 rounded-lg border-l-4 border-slate-600"
                            >
                              <p className="text-sm text-slate-800 leading-relaxed">{c.comment}</p>
                              <span className="text-xs text-slate-500 mt-2 block">
                                {new Date(c.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <FileCheck2 className="w-12 h-12 text-slate-300 mb-4" />
                    <p className="text-slate-500">No comments yet.</p>
                    <p className="text-sm text-slate-400 mt-2">Check back later for updates</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}

      <AssessmentForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};

const ServiceCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <motion.div
    {...fadeUp()}
    whileHover={{ y: -8 }}
    className="bg-white p-8 rounded-3xl transition-all h-full"
  >
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-700">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-slate-900">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
);

export default SoftwareConsultation;
