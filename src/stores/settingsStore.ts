import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SiteSettings {
  storeName: string;
  announcementText: string;
  contactEmail: string;
  contactPhone: string;
  studioAddress: string;
  heroSlides: Array<{
    image: string;
    subtitle: string;
    title: string;
    description: string;
    cta: string;
    link: string;
  }>;
  adminPassword: string;
}

interface SettingsStore extends SiteSettings {
  updateSettings: (settings: Partial<SiteSettings>) => void;
  checkPassword: (password: string) => boolean;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      storeName: 'Haven',
      announcementText: 'Complimentary shipping on all orders over $150',
      contactEmail: 'hello@haven-home.com',
      contactPhone: '',
      studioAddress: '123 Artisan Lane, Portland, OR 97201',
      heroSlides: [
        {
          image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80',
          subtitle: 'New Collection',
          title: 'Essential forms for the modern home',
          description: 'Thoughtfully designed objects that bring clarity and calm to everyday living.',
          cta: 'Shop the collection',
          link: '/collections',
        },
        {
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
          subtitle: 'Artisan Series',
          title: 'Handcrafted ceramic pieces',
          description: 'Each piece is individually wheel-thrown by skilled artisans — no two are alike.',
          cta: 'Explore now',
          link: '/collections',
        },
      ],
      adminPassword: 'admin123',

      updateSettings: (settings) => set({ ...settings }),
      checkPassword: (password) => get().adminPassword === password,
    }),
    {
      name: 'showcase-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
