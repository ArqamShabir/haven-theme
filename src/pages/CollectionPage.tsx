import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CollectionHero from '@/components/CollectionHero';
import SocialProofBar from '@/components/SocialProofBar';
import Newsletter from '@/components/Newsletter';
import { Loader2 } from 'lucide-react';

const CollectionPage = () => {
  const [visibleCount, setVisibleCount] = useState(12);
  const { data: products, isLoading } = useProducts(visibleCount);

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />

      <main>
        <CollectionHero />

        <section className="container-main section-padding">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : products && products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product.node.id} product={product} index={i} />
                ))}
              </div>
              {products.length >= visibleCount && (
                <div className="text-center mt-16">
                  <button onClick={() => setVisibleCount(prev => prev + 12)} className="btn-secondary">
                    Load more
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground mb-2">No products found</p>
              <p className="text-sm text-muted-foreground">Add products to your store to see them here.</p>
            </div>
          )}
        </section>

        <SocialProofBar />
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

export default CollectionPage;
