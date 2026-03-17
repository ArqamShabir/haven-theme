import { Clock, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const UrgencyBanner = () => (
  <section className="py-12 bg-foreground text-background">
    <div className="container-main">
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-accent/20 flex items-center justify-center" style={{ borderRadius: 'var(--radius)' }}>
            <Flame className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="caps-label text-background/70 text-[10px] mb-1">Limited stock available</p>
            <p className="font-serif text-xl text-background">Don't miss out — only a few left in each color</p>
          </div>
        </div>
        <Link
          to="/product/artisan-ceramic-vase"
          className="h-12 px-8 bg-background text-foreground uppercase text-[11px] font-medium inline-flex items-center justify-center gap-2 transition-all hover:bg-background/90 flex-shrink-0"
          style={{ letterSpacing: '0.2em', borderRadius: 'var(--radius)' }}
        >
          <Clock className="w-4 h-4" />
          Shop now
        </Link>
      </motion.div>
    </div>
  </section>
);

export default UrgencyBanner;
