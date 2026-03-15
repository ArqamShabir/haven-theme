import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import { Loader2, Truck, RotateCcw, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedCollection from '@/components/FeaturedCollection';

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading } = useProduct(handle || '');
  const addItem = useCartStore(s => s.addItem);
  const cartLoading = useCartStore(s => s.isLoading);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [stickyVisible, setStickyVisible] = useState(false);

  // Initialize selected options
  useEffect(() => {
    if (product?.options) {
      const defaults: Record<string, string> = {};
      product.options.forEach((opt: { name: string; values: string[] }) => {
        defaults[opt.name] = opt.values[0];
      });
      setSelectedOptions(defaults);
    }
  }, [product]);

  // Sticky ATC
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
    (v: { node: { selectedOptions: Array<{ name: string; value: string }> } }) =>
      v.node.selectedOptions.every(
        (opt: { name: string; value: string }) => selectedOptions[opt.name] === opt.value
      )
  )?.node || product.variants.edges[0]?.node;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
  };

  const images = product.images.edges;

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />

      <main>
        <section className="container-main section-padding">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
            {/* Left: Gallery */}
            <div className="md:col-span-7 space-y-4">
              {images.map((img: { node: { url: string; altText: string | null } }, i: number) => (
                <motion.div
                  key={i}
                  className="bg-muted overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <img
                    src={img.node.url}
                    alt={img.node.altText || product.title}
                    className="w-full object-cover"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </motion.div>
              ))}
              {images.length === 0 && (
                <div className="aspect-[4/5] bg-muted flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>

            {/* Right: Product info */}
            <div className="md:col-span-5">
              <div className="md:sticky md:top-24">
                <p className="caps-label text-muted-foreground mb-2">Haven</p>
                <h1 className="heading-l2 text-foreground mb-4">{product.title}</h1>
                <p className="text-foreground text-lg price-display mb-8">
                  {selectedVariant?.price.currencyCode} {parseFloat(selectedVariant?.price.amount || '0').toFixed(2)}
                </p>

                {/* Options */}
                {product.options
                  .filter((opt: { name: string; values: string[] }) => !(opt.name === 'Title' && opt.values.length === 1 && opt.values[0] === 'Default Title'))
                  .map((option: { name: string; values: string[] }) => (
                    <div key={option.name} className="mb-6">
                      <p className="caps-label text-foreground mb-3">
                        {option.name}: <span className="font-normal normal-case tracking-normal">{selectedOptions[option.name]}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map(value => (
                          <button
                            key={value}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                            className={`h-10 px-4 text-xs border transition-colors duration-150 ${
                              selectedOptions[option.name] === value
                                ? 'bg-foreground text-background border-foreground'
                                : 'bg-transparent text-foreground border-border hover:border-foreground'
                            }`}
                            style={{ borderRadius: 'var(--radius)' }}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                {/* Quantity */}
                <div className="mb-6">
                  <p className="caps-label text-foreground mb-3">Quantity</p>
                  <div className="flex items-center border border-border w-fit" style={{ borderRadius: 'var(--radius)' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:opacity-70 text-foreground"
                    >
                      −
                    </button>
                    <span className="w-10 h-10 flex items-center justify-center text-sm text-foreground">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:opacity-70 text-foreground"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || !selectedVariant?.availableForSale}
                  className="btn-primary w-full mb-4 disabled:opacity-50"
                >
                  {cartLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : !selectedVariant?.availableForSale ? (
                    'Sold out'
                  ) : (
                    'Add to cart'
                  )}
                </button>

                {/* Trust badges */}
                <div className="flex items-center gap-6 mt-6 opacity-60">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" strokeWidth={1} />
                    <span className="text-xs text-foreground">Free shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" strokeWidth={1} />
                    <span className="text-xs text-foreground">30-day returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" strokeWidth={1} />
                    <span className="text-xs text-foreground">Secure checkout</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-10 border-t border-border">
                  <div className="flex gap-6 border-b border-border">
                    {['description', 'details', 'shipping'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 text-xs uppercase tracking-widest transition-colors ${
                          activeTab === tab ? 'text-foreground border-b border-foreground -mb-[1px]' : 'text-muted-foreground'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="py-6 text-sm text-muted-foreground leading-relaxed">
                    {activeTab === 'description' && (
                      <p>{product.description || 'No description available.'}</p>
                    )}
                    {activeTab === 'details' && (
                      <ul className="space-y-2">
                        <li>Thoughtfully crafted with premium materials</li>
                        <li>Designed for everyday use</li>
                        <li>Easy care and maintenance</li>
                      </ul>
                    )}
                    {activeTab === 'shipping' && (
                      <div className="space-y-2">
                        <p>In stock — Ships within 24 hours.</p>
                        <p>Standard shipping: 5–7 business days</p>
                        <p>Express shipping: 2–3 business days</p>
                        <p>Free shipping on orders over $150</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related products */}
        <FeaturedCollection />
      </main>

      {/* Sticky ATC bar */}
      {stickyVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border animate-slide-up">
          <div className="container-main h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {images[0]?.node && (
                <div className="w-10 h-10 bg-muted flex-shrink-0 overflow-hidden">
                  <img src={images[0].node.url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm text-foreground truncate">{product.title}</p>
                <p className="text-xs text-muted-foreground price-display">
                  {selectedVariant?.price.currencyCode} {parseFloat(selectedVariant?.price.amount || '0').toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className="btn-primary flex-shrink-0"
            >
              {cartLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add to cart'}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductPage;
