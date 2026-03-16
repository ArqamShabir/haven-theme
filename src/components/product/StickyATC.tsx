import { Loader2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

interface StickyATCProps {
  visible: boolean;
  product: any;
  selectedVariant: any;
  onAddToCart: () => void;
  imageUrl?: string;
}

const StickyATC = ({ visible, product, selectedVariant, onAddToCart, imageUrl }: StickyATCProps) => {
  const cartLoading = useCartStore(s => s.isLoading);
  const price = parseFloat(selectedVariant?.price.amount || '0');

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border"
        >
          <div className="container-main h-16 md:h-18 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {imageUrl && (
                <div className="w-10 h-10 bg-muted flex-shrink-0 overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{product.title}</p>
                <p className="text-xs text-muted-foreground price-display">${price.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={onAddToCart}
              disabled={cartLoading}
              className="btn-primary flex-shrink-0 h-10 px-6 text-[10px]"
            >
              {cartLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add to cart'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyATC;
