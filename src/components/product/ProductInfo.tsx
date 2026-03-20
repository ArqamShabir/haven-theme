import { Truck, RotateCcw, Shield, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductInfoProps {
  product: any;
  selectedOptions: Record<string, string>;
  setSelectedOptions: (fn: (prev: Record<string, string>) => Record<string, string>) => void;
  selectedVariant: any;
}

const ProductInfo = ({ product, selectedOptions, setSelectedOptions, selectedVariant }: ProductInfoProps) => {
  const price = parseFloat(selectedVariant?.price.amount || '0');

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

      {/* Contact to Buy */}
      <div className="space-y-3">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Link
            to={`/contact?product=${encodeURIComponent(product.handle)}`}
            className="btn-primary w-full h-14 text-[12px] flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Contact to buy — ${price.toFixed(2)}
          </Link>
        </motion.div>
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
          <span className="text-[10px] caps-label text-muted-foreground">Quality Guaranteed</span>
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
