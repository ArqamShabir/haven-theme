import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';

const Hero = () => {
  const slides = useSettingsStore(s => s.heroSlides);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrent(i => (i + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;
  const slide = slides[current % slides.length];

  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden bg-muted">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.2, 0, 0, 1] }}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" loading={current === 0 ? 'eager' : 'lazy'} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/50 via-foreground/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full container-main flex items-center">
        <AnimatePresence mode="wait">
          <motion.div key={current} className="max-w-xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <p className="caps-label text-background/80 mb-4">{slide.subtitle}</p>
            <h2 className="heading-l1 text-background mb-6">{slide.title}</h2>
            <p className="text-background/80 mb-8 max-w-md text-sm leading-relaxed">{slide.description}</p>
            <Link to={slide.link} className="h-12 px-8 bg-background text-foreground uppercase text-[11px] font-medium inline-flex items-center justify-center transition-all duration-300 hover:bg-background/90" style={{ letterSpacing: '0.2em', borderRadius: 'var(--radius)' }}>
              {slide.cta}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-8 right-6 z-20 flex items-center gap-3">
            <button onClick={() => setCurrent(i => (i - 1 + slides.length) % slides.length)} className="w-10 h-10 bg-background/20 backdrop-blur-sm flex items-center justify-center hover:bg-background/40 transition-colors" style={{ borderRadius: 'var(--radius)' }} aria-label="Previous slide">
              <ChevronLeft className="w-4 h-4 text-background" />
            </button>
            <button onClick={() => setCurrent(i => (i + 1) % slides.length)} className="w-10 h-10 bg-background/20 backdrop-blur-sm flex items-center justify-center hover:bg-background/40 transition-colors" style={{ borderRadius: 'var(--radius)' }} aria-label="Next slide">
              <ChevronRight className="w-4 h-4 text-background" />
            </button>
          </div>
          <div className="absolute bottom-8 left-6 z-20 flex items-center gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`h-0.5 transition-all duration-500 ${i === current ? 'w-8 bg-background' : 'w-4 bg-background/40'}`} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Hero;
