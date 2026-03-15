import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductByHandle } from '@/lib/shopify';

export function useProducts(count: number = 20, query?: string) {
  return useQuery({
    queryKey: ['products', count, query],
    queryFn: () => fetchProducts(count, query),
  });
}

export function useProduct(handle: string) {
  return useQuery({
    queryKey: ['product', handle],
    queryFn: () => fetchProductByHandle(handle),
    enabled: !!handle,
  });
}
