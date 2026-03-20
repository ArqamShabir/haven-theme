import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductStore } from '@/stores/productStore';
import { AnimatePresence, motion } from 'framer-motion';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ open, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const getProducts = useProductStore(s => s.getProducts);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [open]);

  if (!open) return null;

  const results = query.trim() ? getProducts(10, query) : [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm"
      >
        <div className="container-main pt-8">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent text-foreground text-lg outline-none placeholder:text-muted-foreground"
            />
            <button onClick={onClose} className="p-2 hover:opacity-70">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-8">
            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {results.map(product => (
                  <Link
                    key={product.node.id}
                    to={`/product/${product.node.handle}`}
                    onClick={onClose}
                    className="group"
                  >
                    <div className="aspect-[4/5] bg-muted overflow-hidden mb-2">
                      {product.node.images.edges[0]?.node && (
                        <img
                          src={product.node.images.edges[0].node.url}
                          alt={product.node.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <p className="text-sm text-foreground">{product.node.title}</p>
                    <p className="text-sm font-light text-foreground price-display">
                      {product.node.priceRange.minVariantPrice.currencyCode}{' '}
                      {parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2)}
                    </p>
                  </Link>
                ))}
              </div>
            ) : query.trim() ? (
              <p className="text-center text-muted-foreground py-12 text-sm">No results found for "{query}"</p>
            ) : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchOverlay;
