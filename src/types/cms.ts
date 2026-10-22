export interface AgencyConfig {
  name: string;
  subtext: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  workingHours: string;
  socials: {
    instagram: string;
    twitter: string;
    linkedin: string;
    facebook: string;
    github: string;
  };
}

export type ThemeMode = 'reference-hybrid' | 'dark-obsidian' | 'light-minimal' | 'midnight' | 'custom';

export interface CustomThemeColors {
  primary: string;   // Main background
  secondary: string; // Section / panel background
  tertiary: string;  // Card / surface background
  accent: string;    // Accent / CTA color
}

export interface ThemeConfig {
  bgMode: ThemeMode;
  accentColor: string;
  headingFont: 'Plus Jakarta Sans' | 'Syne' | 'Outfit' | 'Space Grotesk';
  bodyFont: 'Plus Jakarta Sans' | 'Manrope' | 'JetBrains Mono';
  surfaceOpacity: number;
  customColors?: CustomThemeColors;
}

export type SectionKey =
  | 'hero'
  | 'about'
  | 'services'
  | 'midBanner'
  | 'portfolio'
  | 'workflow'
  | 'testimonials'
  | 'contact'
  | 'clients'
  | 'footer';

export interface SectionMeta {
  id: SectionKey;
  name: string;
  enabled: boolean;
  order: number;
}

export type HeroTextSize = 'xs' | 'sm' | 'md' | 'lg';
export type HeroEditorialSize = 'sm' | 'md' | 'lg' | 'xl';

export interface HeroData {
  headlineMain: string;
  headlineAccent: string;
  headlineSize: HeroTextSize;
  editorialLead: string;
  editorialSize: HeroEditorialSize;
  ctaText: string;
  ctaLink: string;
  bgImageUrl: string;
  floatingCard: {
    title: string;
    category: string;
    year: string;
    imageUrl: string;
    linkUrl: string;
  };
  sideCategories: { number: string; title: string }[];
}

export interface AboutData {
  pretitle: string;
  mainHeadlineBold: string;
  mainHeadlineMuted: string;
  paragraph: string;
  subhead: string;
  ctaText: string;
  imageUrl: string;
  floatingCardTag: string;
  badges: string[];
  stats: {
    id: string;
    number: string;
    label: string;
  }[];
}

export interface ServiceItem {
  id: string;
  number: string;
  name: string;
  tags: string[];
  features: string[];
  startingPrice: string;
  previewImage: string;
  description: string;
}

export interface ServicesData {
  badge: string;
  headline: string;
  description: string;
  ctaText: string;
  items: ServiceItem[];
}

export interface MidBannerData {
  topLabelLeft: string;
  topLabelRight: string;
  headline: string;
  bottomLabel: string;
  ctaText: string;
  bgImageUrl: string;
  partners: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  year: string;
  category: string;
  tags: string[];
  imageUrl: string;
  gallery: string[];
  aspectRatio?: 'landscape' | 'square' | 'portrait';
  summary: string;
  client: string;
  challenge: string;
  solution: string;
  metrics?: string;
  liveUrl?: string;
}

export interface PortfolioData {
  badge: string;
  headline: string;
  description: string;
  ctaText: string;
  items: ProjectItem[];
}

export interface WorkflowStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  icon: 'search' | 'pen' | 'layers' | 'rocket';
}

export interface WorkflowData {
  badge: string;
  headline: string;
  steps: WorkflowStep[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  avatarUrl: string;
}

export interface TestimonialsData {
  badge: string;
  headline: string;
  customerSatisfactionScore: string;
  items: TestimonialItem[];
}

export interface ContactData {
  leftBadge: string;
  headline: string;
  officeCity: string;
  workingHours: string;
  rightBadge: string;
  formTitle: string;
  formSubtitle: string;
  submitButtonText: string;
  consentText: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  services: string[];
  budget: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'archived';
}

export interface ClientLogoItem {
  id: string;
  name: string;
  tagline: string;
  url: string;
}

export interface ClientsData {
  badge: string;
  headline: string;
  items: ClientLogoItem[];
}

export interface EditorialOffset {
  x: number;
  y: number;
}

export interface EditorialData {
  offsets: Record<string, EditorialOffset>;
  texts: Record<string, string>;
}

export interface CMSData {
  config: AgencyConfig;
  theme: ThemeConfig;
  sections: SectionMeta[];
  hero: HeroData;
  about: AboutData;
  services: ServicesData;
  midBanner: MidBannerData;
  portfolio: PortfolioData;
  workflow: WorkflowData;
  testimonials: TestimonialsData;
  contact: ContactData;
  clients: ClientsData;
  inquiries: ContactInquiry[];
  editorial: EditorialData;
}
