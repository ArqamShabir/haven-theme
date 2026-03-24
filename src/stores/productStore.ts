import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import siteData from '@/data/site-data.json';

export interface ProductImage {
  url: string;
  altText: string | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: { edges: Array<{ node: ProductImage }> };
  variants: { edges: Array<{ node: ProductVariant }> };
  options: ProductOption[];
}

export interface ShopifyProduct {
  node: Product;
}

function generateHandle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function generateId(): string {
  return `product-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const defaultProducts: Product[] = siteData.products as Product[];

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'handle'> & { handle?: string }) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  replaceProducts: (products: Product[]) => void;
  getProduct: (handle: string) => Product | undefined;
  getProducts: (count?: number, query?: string) => ShopifyProduct[];
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: defaultProducts,

      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: generateId(),
          handle: product.handle || generateHandle(product.title),
        };
        set({ products: [...get().products, newProduct] });
      },

      updateProduct: (id, updates) => {
        set({
          products: get().products.map(p =>
            p.id === id ? { ...p, ...updates } : p
          ),
        });
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter(p => p.id !== id) });
      },

      replaceProducts: (products) => {
        set({ products });
      },

      getProduct: (handle) => {
        return get().products.find(p => p.handle === handle);
      },

      getProducts: (count = 20, query?: string) => {
        let filtered = get().products;
        if (query) {
          const q = query.toLowerCase();
          filtered = filtered.filter(p => p.title.toLowerCase().includes(q));
        }
        return filtered.slice(0, count).map(p => ({ node: p }));
      },
    }),
    {
      name: 'showcase-products',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ products: state.products }),
    }
  )
);
