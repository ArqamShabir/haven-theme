import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Fallback images when product has no Shopify images
import vaseHero from '@/assets/vase-hero-1.jpg';
import vaseDetail from '@/assets/vase-detail-1.jpg';
import vaseLifestyle from '@/assets/vase-lifestyle-1.jpg';
import vaseGroup from '@/assets/vase-group.jpg';

const fallbackImages = [
  { url: vaseHero, alt: 'Artisan Ceramic Vase - Main' },
  { url: vaseDetail, alt: 'Artisan Ceramic Vase - Detail' },
  { url: vaseGroup, alt: 'Artisan Ceramic Vase - Collection' },
  { url: vaseLifestyle, alt: 'Artisan Ceramic Vase - Lifestyle' },
];

interface ProductGalleryProps {
  images: Array<{ node: { url: string; altText: string | null } }>;
  title: string;
}

const ProductGallery = ({ images, title }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  const gallery = images.length > 0
    ? images.map(img => ({ url: img.node.url, alt: img.node.altText || title }))
    : fallbackImages;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-3">
      {/* Main Image with Zoom */}
      <div
        ref={imageRef}
        className="relative aspect-[4/5] bg-muted overflow-hidden cursor-crosshair group"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={gallery[activeIndex].url}
            alt={gallery[activeIndex].alt}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={zoomed ? {
              transform: 'scale(2)',
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            } : undefined}
          />
        </AnimatePresence>

        {/* Nav arrows */}
        {gallery.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex(i => (i - 1 + gallery.length) % gallery.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={() => setActiveIndex(i => (i + 1) % gallery.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-2.5 py-1 text-[10px] caps-label text-foreground">
          {activeIndex + 1} / {gallery.length}
        </div>
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-20 bg-muted overflow-hidden transition-all duration-200 ${
                activeIndex === i
                  ? 'ring-1 ring-foreground ring-offset-1 ring-offset-background'
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default ProductGallery;
