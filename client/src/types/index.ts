export interface TeamMember {
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

export interface PortfolioProject {
  _id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  technologies: string[];
  link?: string;
  isActive: boolean;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: number;
  isActive?: boolean;
}

export interface SiteSettings {
  logoUrl: string;
  socialLinks: SocialLinks;
  contactInfo: ContactInfo;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface PageMeta {
  title: string;
  description: string;
}
