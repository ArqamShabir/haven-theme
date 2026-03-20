import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

const defaultProducts: Product[] = [
  {
    id: 'product-artisan-ceramic-vase',
    title: 'Artisan Ceramic Vase',
    description: 'Handcrafted with care, each piece tells a unique story. This artisan ceramic vase is wheel-thrown by skilled craftspeople using traditional techniques passed down through generations.',
    handle: 'artisan-ceramic-vase',
    priceRange: { minVariantPrice: { amount: '89.00', currencyCode: 'USD' } },
    images: { edges: [
      { node: { url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80', altText: 'Artisan Ceramic Vase' } },
      { node: { url: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80', altText: 'Ceramic Vase Detail' } },
      { node: { url: 'https://images.unsplash.com/photo-1581783898382-80f27f45988a?w=800&q=80', altText: 'Ceramic Vase Lifestyle' } },
    ] },
    variants: { edges: [
      { node: { id: 'v-1', title: 'Natural / Small', price: { amount: '89.00', currencyCode: 'USD' }, availableForSale: true, selectedOptions: [{ name: 'Color', value: 'Natural' }, { name: 'Size', value: 'Small' }] } },
      { node: { id: 'v-2', title: 'Natural / Large', price: { amount: '129.00', currencyCode: 'USD' }, availableForSale: true, selectedOptions: [{ name: 'Color', value: 'Natural' }, { name: 'Size', value: 'Large' }] } },
      { node: { id: 'v-3', title: 'Charcoal / Small', price: { amount: '89.00', currencyCode: 'USD' }, availableForSale: true, selectedOptions: [{ name: 'Color', value: 'Charcoal' }, { name: 'Size', value: 'Small' }] } },
      { node: { id: 'v-4', title: 'Charcoal / Large', price: { amount: '129.00', currencyCode: 'USD' }, availableForSale: true, selectedOptions: [{ name: 'Color', value: 'Charcoal' }, { name: 'Size', value: 'Large' }] } },
    ] },
    options: [
      { name: 'Color', values: ['Natural', 'Charcoal'] },
      { name: 'Size', values: ['Small', 'Large'] },
    ],
  },
  {
    id: 'product-linen-throw',
    title: 'Linen Throw Blanket',
    description: 'Luxuriously soft linen throw blanket, perfect for adding warmth and texture to any space. Stonewashed for an effortlessly lived-in feel.',
    handle: 'linen-throw-blanket',
    priceRange: { minVariantPrice: { amount: '145.00', currencyCode: 'USD' } },
    images: { edges: [
      { node: { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', altText: 'Linen Throw Blanket' } },
    ] },
    variants: { edges: [
      { node: { id: 'v-5', title: 'Oatmeal', price: { amount: '145.00', currencyCode: 'USD' }, availableForSale: true, selectedOptions: [{ name: 'Color', value: 'Oatmeal' }] } },
      { node: { id: 'v-6', title: 'Sage', price: { amount: '145.00', currencyCode: 'USD' }, availableForSale: true, selectedOptions: [{ name: 'Color', value: 'Sage' }] } },
    ] },
    options: [{ name: 'Color', values: ['Oatmeal', 'Sage'] }],
  },
  {
    id: 'product-wooden-tray',
    title: 'Wooden Serving Tray',
    description: 'Hand-carved from sustainably sourced walnut wood. Each tray showcases the natural grain patterns unique to its piece of timber.',
    handle: 'wooden-serving-tray',
    priceRange: { minVariantPrice: { amount: '65.00', currencyCode: 'USD' } },
    images: { edges: [
      { node: { url: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=800&q=80', altText: 'Wooden Serving Tray' } },
    ] },
    variants: { edges: [
      { node: { id: 'v-7', title: 'Default Title', price: { amount: '65.00', currencyCode: 'USD' }, availableForSale: true, selectedOptions: [{ name: 'Title', value: 'Default Title' }] } },
    ] },
    options: [{ name: 'Title', values: ['Default Title'] }],
  },
  {
    id: 'product-scented-candle',
    title: 'Scented Candle Set',
    description: 'Hand-poured soy wax candles with essential oil blends. Set of three in ceramic vessels — cedar, lavender, and bergamot.',
    handle: 'scented-candle-set',
    priceRange: { minVariantPrice: { amount: '48.00', currencyCode: 'USD' } },
    images: { edges: [
      { node: { url: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800&q=80', altText: 'Scented Candle Set' } },
    ] },
    variants: { edges: [
      { node: { id: 'v-8', title: 'Default Title', price: { amount: '48.00', currencyCode: 'USD' }, availableForSale: true, selectedOptions: [{ name: 'Title', value: 'Default Title' }] } },
    ] },
    options: [{ name: 'Title', values: ['Default Title'] }],
  },
];

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'handle'> & { handle?: string }) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
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
