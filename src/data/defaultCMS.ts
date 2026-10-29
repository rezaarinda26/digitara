import { CMSData } from '../types/cms';
import appliedCMS from './appliedCMS.json';

const BASE_CMS_DATA: CMSData = {
  config: {
    name: 'DIGITARA',
    subtext: 'NUANSA DIGITARA TEKNOLOGI',
    tagline: 'High-End Digital Agency & Creative Engineering',
    email: 'contact@digitara.id',
    phone: '+62 21 8062 8900',
    location: 'Jakarta, Indonesia · Remote Worldwide',
    workingHours: 'Monday - Friday / 09:00 AM - 06:00 PM WIB',
    socials: {
      instagram: '',
      twitter: '',
      linkedin: '',
      facebook: '',
      github: '',
    },
  },
  theme: {
    bgMode: 'reference-hybrid',
    uiStyle: 'classic',
    accentColor: '#6B5CE7', // Digitara brand purple
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Plus Jakarta Sans',
    surfaceOpacity: 0.9,
  },
  sections: [
    { id: 'hero', name: 'Hero Showcase', enabled: true, order: 1 },
    { id: 'about', name: 'About Agency', enabled: true, order: 2 },
    { id: 'services', name: 'Services & Rates', enabled: true, order: 3 },
    { id: 'midBanner', name: 'Cinematic Mid-Banner', enabled: true, order: 4 },
    { id: 'portfolio', name: 'Selected Projects', enabled: true, order: 5 },
    { id: 'workflow', name: 'Creative Workflow', enabled: true, order: 6 },
    { id: 'testimonials', name: 'Client Testimonials', enabled: true, order: 7 },
    { id: 'contact', name: 'Contact & Brief', enabled: true, order: 8 },
    { id: 'clients', name: 'Trusted By Clients', enabled: true, order: 9 },
  ],
  hero: {
    headlineMain: 'WE MAKE',
    headlineAccent: 'DIGITAL',
    headlineSize: 'sm',
    editorialLead:
      'We craft timeless websites, memorable brands, and modern digital products inspired by the creativity of the past and built for the future.',
    editorialSize: 'md',
    ctaText: 'View Our Work',
    ctaLink: '#portfolio',
    bgImageUrl: '/src/assets/images/hero_cinematic_portrait_1792030862157.jpg',
    floatingCard: {
      title: 'Noxen House',
      category: 'Brand Direction',
      year: '2026',
      imageUrl: '/src/assets/images/showcase_noxen_house_1792030863092.jpg',
      linkUrl: '#portfolio',
    },
    sideCategories: [
      { number: '//01', title: 'UI/UX Design' },
      { number: '//02', title: 'Web Design' },
      { number: '//03', title: 'Brand Identity' },
      { number: '//04', title: 'Motion Graphics' },
    ],
  },
  about: {
    pretitle: 'About Us',
    mainHeadlineBold: 'We craft timeless',
    mainHeadlineMuted: 'websites, memorable brands, and modern digital products',
    paragraph:
      'Our studio combines vintage creative influences with modern digital innovation to build brands, websites, and experiences that feel both familiar and refreshingly new.',
    subhead: 'Beyond Trends Built To Last',
    ctaText: 'More About Us',
    imageUrl: '/src/assets/images/showcase_noxen_house_1792030863092.jpg',
    floatingCardTag: 'Creative Agency · 2026',
    badges: [
      'Creative Problem Solving',
      'Human-Centered Design',
      'Design Built On Clarity',
      'Thoughtful Execution',
      'Strategic Brand Thinking',
      'Pixel-Perfect Engineering',
    ],
    stats: [
      { id: 'stat-1', number: '15+', label: 'Years Of Craft' },
      { id: 'stat-2', number: '75+', label: 'Creative Partnerships' },
      { id: 'stat-3', number: '200+', label: 'Successful Launches' },
    ],
  },
  services: {
    badge: 'What We Offer',
    headline: 'From Wireframe to Product',
    description:
      'Strategy, UX interface design, and modern production engineering handled by one obsessive, high-touch boutique digital studio.',
    ctaText: 'More About Us',
    items: [
      {
        id: 'srv-1',
        number: '01',
        name: 'Logo & Visual Identity',
        tags: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Typography System'],
        features: [
          'Dedicated Lead Art Director',
          'Complete Figma & Code Deliverables',
          '2 Rounds Revision & Post-launch QA',
        ],
        startingPrice: '$480',
        previewImage: '/src/assets/images/project_aurora_sunflower_1792030864092.jpg',
        description:
          'End-to-end visual identity systems, vector brandmarks, typography pairing, color psychology, and strict brand governance guidelines.',
      },
      {
        id: 'srv-2',
        number: '02',
        name: 'Web Design & Engineering',
        tags: ['UX Strategy', 'Responsive Design', 'CMS Integration', 'Interactive WebGL'],
        features: [
          'Dedicated Lead Art Director',
          'Complete Figma & Code Deliverables',
          '2 Rounds Revision & Post-launch QA',
        ],
        startingPrice: '$950',
        previewImage: '/src/assets/images/hero_cinematic_portrait_1792030862157.jpg',
        description:
          'High-performance bespoke web applications, lightning-fast Jamstack architectures, custom animations, and headless CMS integrations.',
      },
      {
        id: 'srv-3',
        number: '03',
        name: 'UI/UX Product Design',
        tags: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
        features: [
          'Dedicated Lead Art Director',
          'Complete Figma & Code Deliverables',
          '2 Rounds Revision & Post-launch QA',
        ],
        startingPrice: '$720',
        previewImage: '/src/assets/images/project_velvet_commerce_1792030863190.jpg',
        description:
          'Data-informed interface architecture, modular Figma component systems, interactive micro-prototypes, and frictionless user flows.',
      },
      {
        id: 'srv-4',
        number: '04',
        name: 'Motion & 3D Interactive',
        tags: ['Motion Graphics', 'Product Animation', 'Social Content', '3D Spatial'],
        features: [
          'Dedicated Lead Art Director',
          'Complete Figma & Code Deliverables',
          '2 Rounds Revision & Post-launch QA',
        ],
        startingPrice: '$620',
        previewImage: '/src/assets/images/mid_banner_digital_art_1792030861650.jpg',
        description:
          'Cinematic product launches, smooth UI transitions, 3D asset renders, and dynamic brand storytelling across digital mediums.',
      },
    ],
  },
  midBanner: {
    topLabelLeft: 'Timeless design for modern digital experiences.',
    topLabelRight: 'Creating meaningful experiences for ambitious brands.',
    headline: 'The Art Behind Every Digital Experience',
    bottomLabel: 'Inspiring Digital Brand Experiences',
    ctaText: 'Explore Projects',
    bgImageUrl: '/src/assets/images/mid_banner_digital_art_1792030861650.jpg',
  },
  portfolio: {
    badge: 'Selected Work',
    headline: 'Selected Projects ©24/25',
    description:
      'A curated collection of websites, brands, and digital experiences created for ambitious companies around the world.',
    ctaText: 'View Our Work',
    items: [
      {
        id: 'proj-1',
        title: 'Aurora Studio',
        year: '2025',
        category: 'Brand Identity',
        tags: ['Brand Identity', 'Website Design', 'Creative Direction'],
        imageUrl: '/src/assets/images/project_aurora_sunflower_1792030864092.jpg',
        gallery: [
          '/src/assets/images/project_aurora_sunflower_1792030864092.jpg',
          '/src/assets/images/showcase_noxen_house_1792030863092.jpg',
          '/src/assets/images/mid_banner_digital_art_1792030861650.jpg',
          '/src/assets/images/hero_cinematic_portrait_1792030862157.jpg',
          '/src/assets/images/project_velvet_commerce_1792030863190.jpg',
        ],
        aspectRatio: 'landscape',
        summary: 'Reinventing botanical robotics through organic brutalist visual language.',
        client: 'Aurora Bio-Robotics',
        challenge: 'Bridging the gap between organic bio-engineering and high-precision mechanical interfaces.',
        solution: 'Developed a rich dark-mode design system with warm amber highlights, 3D interactive model viewers, and bespoke typography.',
        metrics: '+185% investor engagement & Red Dot Design Award',
        liveUrl: 'https://digitara.id/case-studies/aurora',
      },
      {
        id: 'proj-2',
        title: 'Neon Archive',
        year: '2025',
        category: 'UI/UX Design',
        tags: ['UI/UX Design', 'Motion Graphics', 'Web Development'],
        imageUrl: '/src/assets/images/hero_cinematic_portrait_1792030862157.jpg',
        gallery: [
          '/src/assets/images/hero_cinematic_portrait_1792030862157.jpg',
          '/src/assets/images/mid_banner_digital_art_1792030861650.jpg',
          '/src/assets/images/project_velvet_commerce_1792030863190.jpg',
          '/src/assets/images/project_aurora_sunflower_1792030864092.jpg',
        ],
        aspectRatio: 'landscape',
        summary: 'A futuristic digital archive platform for generative art and cyber-artifacts.',
        client: 'Neon Cultural Foundation',
        challenge: 'Rendering thousands of interactive generative audio-visual artifacts without frame drops.',
        solution: 'Implemented WebGL shaders and headless API indexing with infinite virtualized masonry feeds.',
        metrics: 'Sub-40ms rendering latency & 450K monthly active curators',
        liveUrl: 'https://digitara.id/case-studies/neon-archive',
      },
      {
        id: 'proj-3',
        title: 'Atlas Collective',
        year: '2024',
        category: 'Design Systems',
        tags: ['Brand Strategy', 'Design System', 'Visual Identity'],
        imageUrl: '/src/assets/images/showcase_noxen_house_1792030863092.jpg',
        gallery: [
          '/src/assets/images/showcase_noxen_house_1792030863092.jpg',
          '/src/assets/images/project_aurora_sunflower_1792030864092.jpg',
          '/src/assets/images/hero_cinematic_portrait_1792030862157.jpg',
          '/src/assets/images/mid_banner_digital_art_1792030861650.jpg',
        ],
        aspectRatio: 'landscape',
        summary: 'Unified design language and multi-tenant brand governance for an international architecture firm.',
        client: 'Atlas Architecture Partners',
        challenge: 'Standardizing 14 regional studio portfolios under one coherent aesthetic identity.',
        solution: 'Created an editorial monochrome grid system inspired by Swiss typography and brutalist concrete lines.',
        metrics: '99.8% design consistency across 12 countries',
        liveUrl: 'https://digitara.id/case-studies/atlas',
      },
      {
        id: 'proj-4',
        title: 'Velvet Commerce',
        year: '2025',
        category: 'E-Commerce',
        tags: ['E-Commerce', 'Product Design', 'Conversion Optimization'],
        imageUrl: '/src/assets/images/project_velvet_commerce_1792030863190.jpg',
        gallery: [
          '/src/assets/images/project_velvet_commerce_1792030863190.jpg',
          '/src/assets/images/showcase_noxen_house_1792030863092.jpg',
          '/src/assets/images/mid_banner_digital_art_1792030861650.jpg',
          '/src/assets/images/hero_cinematic_portrait_1792030862157.jpg',
          '/src/assets/images/project_aurora_sunflower_1792030864092.jpg',
        ],
        aspectRatio: 'landscape',
        summary: 'Hyper-personalized luxury spatial retail experience for limited edition luxury timepieces.',
        client: 'Velvet Horology Geneva',
        challenge: 'Traditional e-commerce templates failed to convey the tactile craftsmanship of haute horlogerie.',
        solution: 'Engineered dynamic 3D configuration tools, microscopic detail zoom, and custom concierge checkout.',
        metrics: '+310% checkout conversion rate & $14.2M gross volume in Q1',
        liveUrl: 'https://digitara.id/case-studies/velvet',
      },
      {
        id: 'proj-5',
        title: 'Pixel Nomad',
        year: '2024',
        category: 'Experience Design',
        tags: ['Website Design', 'Experience Design', 'Content Strategy'],
        imageUrl: '/src/assets/images/mid_banner_digital_art_1792030861650.jpg',
        gallery: [
          '/src/assets/images/mid_banner_digital_art_1792030861650.jpg',
          '/src/assets/images/hero_cinematic_portrait_1792030862157.jpg',
          '/src/assets/images/project_aurora_sunflower_1792030864092.jpg',
          '/src/assets/images/showcase_noxen_house_1792030863092.jpg',
        ],
        aspectRatio: 'landscape',
        summary: 'Editorial travel dispatch and creative publication for global digital nomads and creators.',
        client: 'Nomad Global Media',
        challenge: 'Engaging readers across varying mobile bandwidths with immersive full-bleed imagery.',
        solution: 'Built an ultra-lean progressive web app with edge caching and adaptive resolution pipelines.',
        metrics: '8.4 minute average session duration (3x industry benchmark)',
        liveUrl: 'https://digitara.id/case-studies/pixel-nomad',
      },
      {
        id: 'proj-6',
        title: 'Retroverse Labs',
        year: '2024',
        category: 'Art Direction',
        tags: ['Brand Identity', 'UI Design', 'Art Direction'],
        imageUrl: '/src/assets/images/project_aurora_sunflower_1792030864092.jpg',
        gallery: [
          '/src/assets/images/project_aurora_sunflower_1792030864092.jpg',
          '/src/assets/images/project_velvet_commerce_1792030863190.jpg',
          '/src/assets/images/mid_banner_digital_art_1792030861650.jpg',
          '/src/assets/images/hero_cinematic_portrait_1792030862157.jpg',
        ],
        aspectRatio: 'landscape',
        summary: 'Synthwave aesthetics meets modern artificial intelligence research laboratory branding.',
        client: 'Retroverse AI Research',
        challenge: 'Standing out in a crowded market saturated with identical minimalist blue AI landing pages.',
        solution: 'Formulated a distinctive retro-futurist brand identity utilizing vintage CRT textures and bespoke glyphs.',
        metrics: 'Ranked #1 on Awwwards Site of the Day',
        liveUrl: 'https://digitara.id/case-studies/retroverse',
      },
    ],
  },
  workflow: {
    badge: 'Our Process',
    headline: 'Our Creative Workflow',
    steps: [
      {
        id: 'step-1',
        stepNumber: '01',
        title: 'Discover & Research',
        description:
          'Deep immersion into your brand DNA, competitor landscape auditing, user behavior profiling, and technical feasibility mapping.',
        icon: 'search',
      },
      {
        id: 'step-2',
        stepNumber: '02',
        title: 'Concept & Strategy',
        description:
          'Formulating creative North Star concepts, structural information architecture, rapid wireframing, and interactive art direction tests.',
        icon: 'pen',
      },
      {
        id: 'step-3',
        stepNumber: '03',
        title: 'Design & Prototype',
        description:
          'High-fidelity pixel crafting in Figma, bespoke motion choreography, scalable design systems, and clickable micro-interaction prototypes.',
        icon: 'layers',
      },
      {
        id: 'step-4',
        stepNumber: '04',
        title: 'Develop & Launch',
        description:
          'Production-grade modern frontend engineering, headless CMS connection, SEO audit, multi-device QA testing, and global edge deployment.',
        icon: 'rocket',
      },
    ],
  },
  testimonials: {
    badge: 'Kind Words',
    headline: 'What Clients Say',
    customerSatisfactionScore: '4.8',
    items: [
      {
        id: 'test-1',
        quote:
          'Working with the DIGITARA team felt like collaborating with true visionaries. Every detail was thoughtfully crafted, performance-tested, and executed beyond our highest expectations.',
        author: 'Alex Morgan',
        role: 'Founder & CEO',
        company: 'Daylight Radio',
        rating: 5,
        avatarUrl: '/src/assets/images/showcase_noxen_house_1792030863092.jpg',
      },
      {
        id: 'test-2',
        quote:
          'The transformation in our brand perception after DIGITARA launched our new platform was instantaneous. Our inbound enterprise leads grew by 140% in the first quarter alone.',
        author: 'Elena Rostova',
        role: 'Chief Creative Officer',
        company: 'Orbital Dynamics',
        rating: 5,
        avatarUrl: '/src/assets/images/hero_cinematic_portrait_1792030862157.jpg',
      },
      {
        id: 'test-3',
        quote:
          'Their attention to typography, spatial rhythm, and micro-interactions is world-class. DIGITARA does not merely build websites; they craft digital monuments.',
        author: 'Marcus Vance',
        role: 'Managing Partner',
        company: 'Vance Capital Partners',
        rating: 5,
        avatarUrl: '/src/assets/images/mid_banner_digital_art_1792030861650.jpg',
      },
    ],
  },
  contact: {
    leftBadge: 'New Project / Ready',
    headline: "Got a project? Let's make it happen together.",
    officeCity: 'Jakarta & Worldwide',
    workingHours: 'Working Hours · Monday - Friday · 09 AM - 06 PM WIB',
    rightBadge: 'Have A Quick Question?',
    formTitle: 'Tell us about your project',
    formSubtitle: "We'll review your brief and get back to you within 24 hours.",
    submitButtonText: 'Start A Project',
    consentText: 'I agree to the processing of my personal data for project communications.',
  },
  clients: {
    badge: 'Trusted By',
    headline: 'Brands that trust us with their digital presence.',
    items: [
      { id: 'client-1', name: 'Aura', tagline: 'Wellness Platform', url: '' },
      { id: 'client-2', name: 'Modern Health', tagline: 'Digital Health', url: '' },
      { id: 'client-3', name: 'Orbital', tagline: 'Aerospace Systems', url: '' },
      { id: 'client-4', name: 'Northstar', tagline: 'Fintech', url: '' },
      { id: 'client-5', name: 'Acme Labs', tagline: 'R&D Studio', url: '' },
      { id: 'client-6', name: 'Velvet Geneva', tagline: 'Luxury Retail', url: '' },
      { id: 'client-7', name: 'Quantum Dynamics', tagline: 'AI Research', url: '' },
      { id: 'client-8', name: 'Synapse Digital', tagline: 'Media Group', url: '' },
    ],
  },
  inquiries: [
    {
      id: 'inq-1',
      name: 'Sofia Chen',
      email: 's.chen@aurora-labs.io',
      services: ['Web Design & Engineering', 'UI/UX Product Design'],
      budget: '$5,000 - $10,000',
      message: 'Looking to redesign our main product website with interactive 3D elements and headless CMS.',
      submittedAt: '2026-10-14 14:22',
      status: 'new',
    },
    {
      id: 'inq-2',
      name: 'David K.',
      email: 'david@kinesis.global',
      services: ['Logo & Visual Identity', 'Motion & 3D Interactive'],
      budget: '$10,000+',
      message: 'Need a complete brand identity revamp for an AI fintech startup launching in Q1.',
      submittedAt: '2026-10-13 09:15',
      status: 'contacted',
    },
  ],
  editorial: {
    offsets: {},
    texts: {},
  },
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Deep-merges a saved snapshot over the base defaults. Arrays are replaced
 * wholesale (a saved list is intentional), while objects are filled in so new
 * fields added to the schema still get their default values.
 */
const mergeOverrides = <T,>(base: T, override: unknown): T => {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override === undefined ? base : (override as T));
  }
  const merged: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    merged[key] = mergeOverrides((base as Record<string, unknown>)[key], value);
  }
  return merged as T;
};

const appliedSnapshot = appliedCMS as { __appliedAt?: string } & Record<string, unknown>;
const { __appliedAt, ...appliedData } = appliedSnapshot;

/**
 * Timestamp of the last "Apply to Code". Local drafts saved against a
 * different version are discarded so the code snapshot wins everywhere.
 */
export const APPLIED_CMS_VERSION: string =
  typeof __appliedAt === 'string' ? __appliedAt : '';

/**
 * The content every visitor gets. `appliedCMS.json` is written by the CMS
 * "Apply to Code" action, so the latest content ships with the build instead
 * of living only in one browser's localStorage.
 */
export const DEFAULT_CMS_DATA: CMSData = mergeOverrides(BASE_CMS_DATA, appliedData);
