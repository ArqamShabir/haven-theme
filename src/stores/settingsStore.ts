import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

interface SiteSettings {
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
  checkPassword: (password: string) => boolean;
  exportData: () => string;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      storeName: 'Haven',
      storeTagline: 'Essential forms for the modern home.',
      announcementText: 'Complimentary shipping on all orders over $150',
      contactEmail: 'hello@haven-home.com',
      contactPhone: '',
      studioAddress: '123 Artisan Lane, Portland, OR 97201',
      whatsappNumber: '',
      footerTagline: 'Essential forms for the modern home.',
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
      socialLinks: [
        { platform: 'Instagram', url: '#' },
        { platform: 'Pinterest', url: '#' },
        { platform: 'Twitter', url: '#' },
      ],
      testimonials: [
        { name: 'Sarah M.', rating: 5, text: 'Absolutely stunning. The matte finish catches the light beautifully. Worth every penny.', date: '2 weeks ago' },
        { name: 'James K.', rating: 5, text: "Bought the large in Charcoal — it's the perfect centerpiece for our dining table.", date: '1 month ago' },
        { name: 'Elena R.', rating: 5, text: 'The craftsmanship is incredible. You can feel the quality the moment you hold it.', date: '3 weeks ago' },
      ],
      adminPassword: 'admin123',

      updateSettings: (settings) => set({ ...settings }),
      checkPassword: (password) => get().adminPassword === password,
      exportData: () => {
        const { updateSettings, checkPassword, exportData, ...data } = get();
        return JSON.stringify(data, null, 2);
      },
    }),
    {
      name: 'showcase-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
