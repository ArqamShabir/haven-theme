import { useState } from 'react';
import { Loader2, Truck, RotateCcw, Shield, CreditCard, Star } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { motion } from 'framer-motion';

interface ProductInfoProps {
  product: any;
  selectedOptions: Record<string, string>;
  setSelectedOptions: (fn: (prev: Record<string, string>) => Record<string, string>) => void;
  selectedVariant: any;
}

const ProductInfo = ({ product, selectedOptions, setSelectedOptions, selectedVariant }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(s => s.addItem);
  const cartLoading = useCartStore(s => s.isLoading);

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

  const price = parseFloat(selectedVariant?.price.amount || '0');
  const comparePrice = price * 1.0; // No compare-at for now

  return (
    <div className="md:sticky md:top-24 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <a href="/" className="hover:text-foreground transition-colors">Home</a>
        <span>/</span>
        <a href="/collections" className="hover:text-foreground transition-colors">Shop</a>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      {/* Title & Price */}
      <div>
        <p className="caps-label text-accent mb-2">Haven · Artisan Collection</p>
        <h1 className="heading-l2 text-foreground mb-3">{product.title}</h1>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-md">
          {product.description?.slice(0, 120) || 'Handcrafted with care, each piece tells a unique story.'}
        </p>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-medium text-foreground price-display">
            ${price.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Tax included. Shipping calculated at checkout.</p>
      </div>

      <div className="w-full h-px bg-border" />

      {/* Variant Options */}
      {product.options
        .filter((opt: any) => !(opt.name === 'Title' && opt.values.length === 1 && opt.values[0] === 'Default Title'))
        .map((option: any) => (
          <div key={option.name}>
            <p className="caps-label text-foreground mb-3">
              {option.name}: <span className="font-normal normal-case tracking-normal text-muted-foreground">{selectedOptions[option.name]}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value: string) => (
                <button
                  key={value}
                  onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                  className={`h-11 px-5 text-xs font-medium border transition-all duration-200 ${
                    selectedOptions[option.name] === value
                      ? 'bg-foreground text-background border-foreground shadow-sm'
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
      <div>
        <p className="caps-label text-foreground mb-3">Quantity</p>
        <div className="flex items-center border border-border w-fit" style={{ borderRadius: 'var(--radius)' }}>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
          >
            −
          </button>
          <span className="w-12 h-12 flex items-center justify-center text-sm font-medium text-foreground border-x border-border">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="space-y-3">
        <motion.button
          onClick={handleAddToCart}
          disabled={cartLoading || !selectedVariant?.availableForSale}
          className="btn-primary w-full h-14 text-[12px] disabled:opacity-50"
          whileTap={{ scale: 0.98 }}
        >
          {cartLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : !selectedVariant?.availableForSale ? (
            'Sold out'
          ) : (
            `Add to cart — $${(price * quantity).toFixed(2)}`
          )}
        </motion.button>

        {/* Express checkout */}
        <button
          onClick={handleAddToCart}
          disabled={cartLoading}
          className="w-full h-12 bg-accent text-accent-foreground uppercase text-[11px] font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
          style={{ borderRadius: 'var(--radius)', letterSpacing: '0.15em' }}
        >
          <CreditCard className="w-4 h-4" />
          Buy it now
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border">
        <div className="flex flex-col items-center gap-2 text-center">
          <Truck className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          <span className="text-[10px] caps-label text-muted-foreground">Free Shipping</span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <RotateCcw className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          <span className="text-[10px] caps-label text-muted-foreground">30-Day Returns</span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <Shield className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          <span className="text-[10px] caps-label text-muted-foreground">Secure Checkout</span>
        </div>
      </div>

      {/* Delivery info */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-secondary/50" style={{ borderRadius: 'var(--radius)' }}>
          <Truck className="w-4 h-4 text-foreground flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-xs font-medium text-foreground">Estimated delivery</p>
            <p className="text-xs text-muted-foreground mt-0.5">3–7 business days · Free on orders $150+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
