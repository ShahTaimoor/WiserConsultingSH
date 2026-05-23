"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  phone2: string;
  address: string;
  officeHours: string;
}

export interface SiteSettings {
  _id?: string;
  logoUrl: string;
  socialLinks: SocialLinks;
  contactInfo: ContactInfo;
}

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (formData: FormData) => Promise<boolean>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/settings`);
      if (!res.ok) {
        throw new Error('Failed to fetch site settings');
      }
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
      } else {
        throw new Error(data.message || 'Failed to parse site settings');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while loading settings';
      setError(message);
      // Set some fallback settings to avoid UI breaking if API is down
      setSettings({
        logoUrl: '/logo.png',
        socialLinks: { facebook: '', instagram: '', linkedin: '' },
        contactInfo: {
          email: 'taimour448@gmail.com',
          phone: '+92 313 0922988',
          phone2: '+92 3065779097',
          address: 'Deans Trade Center, UG 390, Peshawar, Pakistan',
          officeHours: 'Monday - Saturday: 9:00 AM - 6:00 PM PKT'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (formData: FormData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: 'include',
        body: formData, // FormData contains the multipart logo file and JSON strings or flat keys
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update settings');
      }

      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
        return true;
      } else {
        throw new Error(data.message || 'Failed to update settings');
      }
    } catch (err: any) {
      console.error('Error updating settings:', err);
      setError(err.message || 'An error occurred while saving settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, error, fetchSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
