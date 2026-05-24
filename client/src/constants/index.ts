export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Projects" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = [
  { name: "Projects", href: "/portfolio" },
  { name: "Team", href: "/team" },
  { name: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS_2 = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
] as const;

export const PORTFOLIO_CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "web", label: "Web Applications" },
  { id: "mobile", label: "Mobile Apps" },
  { id: "enterprise", label: "Enterprise Solutions" },
  { id: "other", label: "Other Projects" },
] as const;

export const TEAM_ROLE_OPTIONS = [
  { value: "CEO", description: "Chief Executive Officer" },
  { value: "Project Manager", description: "Oversees project planning and execution" },
  { value: "Full Stack Developer", description: "Frontend and backend development" },
  { value: "Full Stack Engineer", description: "End-to-end web applications" },
  { value: "MERN Stack Developer", description: "MongoDB, Express, React, Node.js" },
  { value: "PERN Stack Developer", description: "PostgreSQL, Express, React, Node.js" },
  { value: "Frontend Developer", description: "UI and UX development" },
  { value: "Backend Developer", description: "Server-side logic and APIs" },
  { value: "App Developer", description: "Cross-platform mobile applications" },
  { value: "Cloud Architecture", description: "Cloud infrastructure and solutions" },
  { value: "Mobile App Developer", description: "iOS and Android applications" },
] as const;

export const SOCIAL_PLATFORMS = [
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/..." },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
  { key: "twitter", label: "Twitter", placeholder: "https://twitter.com/..." },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/..." },
  { key: "github", label: "GitHub", placeholder: "https://github.com/..." },
] as const;

export const ANIMATION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.8, delay, ease: ANIMATION_EASE },
});

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const STATS = [
  { end: 50, suffix: "+", label: "Projects Completed" },
  { end: 30, suffix: "+", label: "Expert Developers" },
  { end: 5, suffix: "+", label: "Years Experience" },
  { end: 40, suffix: "+", label: "Happy Clients" },
] as const;

export const SERVICES = [
  {
    title: "Custom Software Development",
    description: "Tailored solutions built with modern technologies to solve your unique business challenges.",
    icon: "Code2",
  },
  {
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure, migration, and management services.",
    icon: "Cloud",
  },
  {
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    icon: "Smartphone",
  },
  {
    title: "UI/UX Design",
    description: "User-centered design that delivers intuitive and engaging experiences.",
    icon: "Palette",
  },
  {
    title: "DevOps & CI/CD",
    description: "Automated deployment pipelines and infrastructure as code.",
    icon: "GitBranch",
  },
  {
    title: "AI & Machine Learning",
    description: "Intelligent solutions powered by cutting-edge AI and ML technologies.",
    icon: "Brain",
  },
] as const;

export const PROCESS_STEPS = [
  { step: 1, title: "Discovery", description: "We analyze your requirements and define project scope." },
  { step: 2, title: "Design", description: "Our team creates wireframes and prototypes for your approval." },
  { step: 3, title: "Development", description: "Agile development with regular updates and iterations." },
  { step: 4, title: "Testing", description: "Rigorous QA testing ensures a bug-free product." },
  { step: 5, title: "Deployment", description: "Smooth deployment with ongoing support and maintenance." },
] as const;

export const TECHNOLOGIES = [
  "React", "Next.js", "Node.js", "TypeScript", "Python",
  "PostgreSQL", "MongoDB", "AWS", "Docker", "GraphQL",
  "Tailwind CSS", "Redux", "Figma", "Git", "Redis",
] as const;
