import { motion } from 'framer-motion';

const CollectionHero = () => (
  <section className="relative h-[40vh] min-h-[280px] max-h-[400px] overflow-hidden bg-muted">
    <img
      src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80"
      alt="Haven collection"
      className="w-full h-full object-cover"
      loading="eager"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
    <div className="absolute inset-0 flex items-end">
      <motion.div
        className="container-main pb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="heading-l1 text-background mb-2">All Products</h1>
        <p className="text-sm text-background/80 max-w-md">
          Browse our complete collection of thoughtfully designed essentials.
        </p>
      </motion.div>
    </div>
  </section>
);

export default CollectionHero;
