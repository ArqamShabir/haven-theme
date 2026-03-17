import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import { Loader2 } from 'lucide-react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import ProductHighlights from '@/components/product/ProductHighlights';
import LifestyleSection from '@/components/product/LifestyleSection';
import ProductFAQ from '@/components/product/ProductFAQ';
import FeaturedCollection from '@/components/FeaturedCollection';
import StickyATC from '@/components/product/StickyATC';
import ReviewsSummary from '@/components/ReviewsSummary';
import SocialProofBar from '@/components/SocialProofBar';

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading } = useProduct(handle || '');
  const addItem = useCartStore(s => s.addItem);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    if (product?.options) {
      const defaults: Record<string, string> = {};
      product.options.forEach((opt: { name: string; values: string[] }) => {
        defaults[opt.name] = opt.values[0];
      });
      setSelectedOptions(defaults);
    }
  }, [product]);

  useEffect(() => {
    const handleScroll = () => setStickyVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar /><Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar /><Header />
        <div className="container-main section-padding text-center">
          <p className="text-muted-foreground">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedVariant = product.variants.edges.find(
    (v: any) => v.node.selectedOptions.every(
      (opt: any) => selectedOptions[opt.name] === opt.value
    )
  )?.node || product.variants.edges[0]?.node;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
  };

  const firstImage = product.images.edges[0]?.node?.url;

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />

      <main>
        <section className="container-main py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-7">
              <ProductGallery images={product.images.edges} title={product.title} />
            </div>
            <div className="md:col-span-5">
              <ProductInfo
                product={product}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                selectedVariant={selectedVariant}
              />
            </div>
          </div>
        </section>

        <SocialProofBar />
        <ProductHighlights />
        <ProductTabs description={product.description} />
        <LifestyleSection />
        <ReviewsSummary />
        <ProductFAQ />

        <FeaturedCollection />
      </main>

      <StickyATC
        visible={stickyVisible}
        product={product}
        selectedVariant={selectedVariant}
        onAddToCart={handleAddToCart}
        imageUrl={firstImage}
      />

      <Footer />
    </div>
  );
};

export default ProductPage;
