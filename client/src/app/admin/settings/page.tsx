"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSettings } from "@/context/SettingsContext";
import { 
  Save, 
  Upload, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Linkedin, 
  AlertCircle, 
  CheckCircle2, 
  Image as ImageIcon,
  Loader2,
  RefreshCw
} from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, loading, error, fetchSettings, updateSettings } = useSettings();
  
  // Local state for forms
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    linkedin: ""
  });
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    phone2: "",
    address: "",
    officeHours: ""
  });

  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync settings context to local state
  useEffect(() => {
    if (settings) {
      setSocialLinks({
        facebook: settings.socialLinks?.facebook || "",
        instagram: settings.socialLinks?.instagram || "",
        linkedin: settings.socialLinks?.linkedin || ""
      });
      setContactInfo({
        email: settings.contactInfo?.email || "",
        phone: settings.contactInfo?.phone || "",
        phone2: settings.contactInfo?.phone2 || "",
        address: settings.contactInfo?.address || "",
        officeHours: settings.contactInfo?.officeHours || ""
      });
      setLogoPreview(settings.logoUrl || null);
    }
  }, [settings]);

  // Handle Logo file changes
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showAlert("error", "Please select a valid image file (PNG, JPG, WEBP, etc.)");
        return;
      }
      // Validate file size (2MB limit for logo)
      if (file.size > 2 * 1024 * 1024) {
        showAlert("error", "Logo size should be less than 2MB");
        return;
      }
      
      setLogoFile(file);
      
      // Generate live preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      showAlert("success", "New logo selected! Click 'Save Settings' to apply.");
    }
  };

  // Drag and Drop Logo handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showAlert("error", "Please select a valid image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showAlert("error", "Logo size should be less than 2MB");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      showAlert("success", "Logo dropped successfully!");
    }
  };

  // Custom alert display helper
  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    try {
      // Construct FormData for multipart submission
      const formData = new FormData();
      
      if (logoFile) {
        formData.append("logo", logoFile);
      }
      
      formData.append("socialLinks", JSON.stringify(socialLinks));
      formData.append("contactInfo", JSON.stringify(contactInfo));

      const success = await updateSettings(formData);
      
      if (success) {
        setLogoFile(null); // Clear selected file state on success
        showAlert("success", "Site configuration saved successfully!");
      } else {
        showAlert("error", "Could not save settings. Please verify admin privileges.");
      }
    } catch (err: any) {
      console.error(err);
      showAlert("error", err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !settings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
        <p className="text-gray-500 font-medium animate-pulse">Loading dynamic configurations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-2 sm:px-4 py-4 sm:py-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <Save className="w-5 h-5" />
            </span>
            Site Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Manage site-wide configurations including the dynamic header logo, official contact endpoints, and social channels.
          </p>
        </div>
        <button
          onClick={() => {
            fetchSettings();
            showAlert("success", "Settings refreshed from database.");
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title="Sync settings"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync State</span>
        </button>
      </div>

      {/* Floating Alert Messages */}
      {alert && (
        <div 
          className={`flex items-center gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-top-4 duration-300 ${
            alert.type === "success" 
              ? "bg-green-50 border-green-200 text-green-800" 
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{alert.message}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Details (2 Cols size on LG) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Card 1: Contact Details */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  Contact Information
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage public-facing email addresses, phone lines, and physical office listings.</p>
              </div>
              
              <div className="p-6 space-y-5">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Primary Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                    placeholder="e.g. info@company.com"
                    required
                  />
                </div>

                {/* Phone Numbers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      Primary Phone Line
                    </label>
                    <input
                      type="text"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                      placeholder="e.g. +92 300 1234567"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      Secondary Phone Line
                    </label>
                    <input
                      type="text"
                      value={contactInfo.phone2}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone2: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                      placeholder="e.g. +92 313 7654321"
                    />
                  </div>
                </div>

                {/* Office Address */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Office Headquarters Address
                  </label>
                  <textarea
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all outline-none min-h-[80px] resize-y"
                    placeholder="e.g. Deans Trade Center, Peshawar, Pakistan"
                    required
                  />
                </div>

                {/* Office Hours */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Office / Business Hours
                  </label>
                  <input
                    type="text"
                    value={contactInfo.officeHours}
                    onChange={(e) => setContactInfo({ ...contactInfo, officeHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                    placeholder="e.g. Monday - Saturday: 9:00 AM - 6:00 PM"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Social Channels */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  Social Media Links
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Customize redirection paths for bottom footer action triggers.</p>
              </div>

              <div className="p-6 space-y-5">
                {/* LinkedIn Link */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-700" />
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={socialLinks.linkedin}
                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                    placeholder="e.g. https://linkedin.com/company/wiserconsulting"
                  />
                </div>

                {/* Facebook Link */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                    placeholder="e.g. https://facebook.com/wiserconsulting"
                  />
                </div>

                {/* Instagram Link */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    Instagram Feed URL
                  </label>
                  <input
                    type="url"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all outline-none"
                    placeholder="e.g. https://instagram.com/wiserconsulting"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Brand Assets (1 Col size on LG) */}
          <div className="space-y-8">
            
            {/* Card 3: Brand Assets / Logo Upload */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden sticky top-6">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                  Header Brand Logo
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Upload a dynamic SVG, WEBP, or PNG site-wide logo representation.</p>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Logo Drag Dropzone / Preview */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group border-2 border-dashed border-gray-300 hover:border-green-500 bg-gray-50 hover:bg-gray-100/50 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 text-center select-none"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {logoPreview ? (
                    <div className="space-y-4 w-full">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-center min-h-[90px] shadow-inner relative group-hover:opacity-90 transition-opacity">
                        <img
                          src={logoPreview}
                          alt="Dynamic Logo Preview"
                          className="max-h-[70px] w-auto object-contain"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 font-semibold group-hover:text-green-600 flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 animate-bounce" />
                        Click or drag to replace logo
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 py-6">
                      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 mx-auto group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-800">Upload Header Logo</p>
                        <p className="text-xs text-gray-400">Drag & drop or browse from explorer</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Resolution / Details Constraints Box */}
                <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100 space-y-1.5">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    Asset Guidelines
                  </h4>
                  <ul className="text-[11px] text-blue-800 list-disc pl-4 space-y-1">
                    <li>Transparent background logo works best (SVG, transparent PNG).</li>
                    <li>Highly recommended target aspect ratio: <strong>3:1 or 4:1</strong>.</li>
                    <li>Auto-scaled to a height limit of <strong>50px</strong> inside Navbar.</li>
                    <li>File size capacity must not exceed <strong>2MB</strong>.</li>
                  </ul>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Floating / Bottom Form Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              if (settings) {
                setSocialLinks({
                  facebook: settings.socialLinks?.facebook || "",
                  instagram: settings.socialLinks?.instagram || "",
                  linkedin: settings.socialLinks?.linkedin || ""
                });
                setContactInfo({
                  email: settings.contactInfo?.email || "",
                  phone: settings.contactInfo?.phone || "",
                  phone2: settings.contactInfo?.phone2 || "",
                  address: settings.contactInfo?.address || "",
                  officeHours: settings.contactInfo?.officeHours || ""
                });
                setLogoPreview(settings.logoUrl || null);
                setLogoFile(null);
                showAlert("success", "Restored to last saved configuration.");
              }
            }}
            disabled={saving}
            className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel / Reset
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-600/70 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed select-none group min-w-[150px]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Applying...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
