import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

const FeaturedCollection = () => {
  const { data: products, isLoading } = useProducts(8);

  return (
    <section className="section-padding">
      <div className="container-main">
        <div className="flex items-center justify-between mb-12">
          <h2 className="heading-l2 text-foreground">Featured</h2>
          <Link to="/collections" className="text-link caps-label text-[11px]">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[4/5] bg-muted animate-pulse" />
                <div className="mt-3 h-4 bg-muted animate-pulse w-2/3" />
                <div className="mt-1 h-4 bg-muted animate-pulse w-1/3" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.node.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-muted-foreground mb-2">No products found</p>
            <p className="text-sm text-muted-foreground">
              Add products to your store to see them here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCollection;
