"use client";

import React, { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Clock,
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

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

const Contact = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit contact form');
      }

      const data = await res.json();
      
      if (data.success) {
        setIsSubmitting(false);
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
        
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setIsSubmitting(false);
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  const emailVal = settings?.contactInfo?.email || "taimour448@gmail.com";
  const phoneVal = settings?.contactInfo?.phone || "+92 313 0922988";
  const phone2Val = settings?.contactInfo?.phone2 || "+92 3065779097";
  const addressVal = settings?.contactInfo?.address || "Deans Trade Center, UG 390, Peshawar, Pakistan";
  const officeHoursVal = settings?.contactInfo?.officeHours || "Monday - Saturday: 9:00 AM - 6:00 PM PKT";

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: emailVal,
      link: `mailto:${emailVal}`
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      content: phoneVal,
      link: `tel:${phoneVal.replace(/\s+/g, '')}`
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      content: addressVal,
      link: `https://www.google.com/maps/search/${encodeURIComponent(addressVal)}`
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      content: officeHoursVal,
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-white">


      {/* Contact Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div {...fadeUp()}>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="project">Project Discussion</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900 resize-none"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>
                {submitStatus === "success" && (
                  <div className="p-4 bg-green-50 border border-green-200 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-600">
                      Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </p>
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="p-4 bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">
                      Something went wrong. Please try again later.
                    </p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div {...fadeUp()}>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                Contact Information
              </h2>
              <p className="text-slate-600 mb-8">
                We're here to help! Reach out to us through any of the following channels, 
                and we'll respond as quickly as possible.
              </p>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    {...stagger(index * 0.1)}
                    className="flex gap-4 p-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-50 flex items-center justify-center text-slate-600">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {info.title}
                      </h3>
                      {info.title === "Phone" ? (
                        <div className="flex flex-wrap gap-2">
                          {phoneVal && (
                            <a
                              href={`tel:${phoneVal.replace(/\s+/g, '')}`}
                              className="text-slate-600 hover:text-slate-900 transition-colors"
                            >
                              {phoneVal}
                            </a>
                          )}
                          {phoneVal && phone2Val && (
                            <span className="text-slate-400">|</span>
                          )}
                          {phone2Val && (
                            <a
                              href={`tel:${phone2Val.replace(/\s+/g, '')}`}
                              className="text-slate-600 hover:text-slate-900 transition-colors"
                            >
                              {phone2Val}
                            </a>
                          )}
                        </div>
                      ) : info.link !== "#" ? (
                        <a
                          href={info.link}
                          className="text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-slate-600">{info.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Additional Info */}
              <motion.div {...fadeUp()} className="mt-8">
                <MessageSquare className="w-8 h-8 text-slate-900 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Quick Response Guarantee
                </h3>
                <p className="text-slate-600">
                  We typically respond to all inquiries within 24 hours during business days. 
                  For urgent matters, please call us directly.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()}>
            <div className="text-center mb-6">
              <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Visit Our Office
              </h3>
              <p className="text-slate-600">
                {addressVal}
              </p>
            </div>
            <div>
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(addressVal)}&output=embed&zoom=15`}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title="WISER CONSULTING Office Location"
              ></iframe>
            </div>
            <div className="mt-6 text-center">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(addressVal)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                <MapPin className="w-5 h-5" />
                Open in Google Maps
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
