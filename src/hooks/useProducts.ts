import { useProductStore, Product, ShopifyProduct } from '@/stores/productStore';

export function useProducts(count: number = 20, query?: string) {
  const getProducts = useProductStore(s => s.getProducts);
  const products = getProducts(count, query);
  return { data: products, isLoading: false };
}

export function useProduct(handle: string) {
  const getProduct = useProductStore(s => s.getProduct);
  const product = handle ? getProduct(handle) : undefined;
  return { data: product || null, isLoading: false };
}

export type { Product, ShopifyProduct };
