import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import siteData from '@/data/site-data.json';

export interface Testimonial {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface HeroSlide {
  image: string;
  subtitle: string;
  title: string;
  description: string;
  cta: string;
  link: string;
}

export interface SiteSettings {
  storeName: string;
  storeTagline: string;
  announcementText: string;
  contactEmail: string;
  contactPhone: string;
  studioAddress: string;
  heroSlides: HeroSlide[];
  socialLinks: SocialLink[];
  testimonials: Testimonial[];
  footerTagline: string;
  whatsappNumber: string;
  adminPassword: string;
}

interface SettingsStore extends SiteSettings {
  updateSettings: (settings: Partial<SiteSettings>) => void;
  replaceSettings: (settings: SiteSettings) => void;
  checkPassword: (password: string) => boolean;
  exportData: () => string;
}

const defaultSettings: SiteSettings = siteData.settings as SiteSettings;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      updateSettings: (settings) => set({ ...settings }),
      replaceSettings: (settings) => set({ ...settings }),
      checkPassword: (password) => get().adminPassword === password,
      exportData: () => {
        const { updateSettings, replaceSettings, checkPassword, exportData, ...data } = get();
        return JSON.stringify(data, null, 2);
      },
    }),
    {
      name: 'showcase-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
