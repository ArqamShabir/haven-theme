import { motion } from 'framer-motion';
import { Droplets, Hand, Leaf, Sparkles } from 'lucide-react';

const highlights = [
  {
    icon: Hand,
    title: 'Handcrafted',
    description: 'Each vase is wheel-thrown by skilled artisans — no two are the same.',
  },
  {
    icon: Leaf,
    title: 'Sustainably Sourced',
    description: 'Natural stoneware clay, responsibly sourced from local quarries.',
  },
  {
    icon: Droplets,
    title: 'Matte Glaze Finish',
    description: 'Contemporary matte glaze applied by hand for a soft, tactile surface.',
  },
  {
    icon: Sparkles,
    title: 'Timeless Design',
    description: 'Sculptural silhouettes that complement any interior style.',
  },
];

const ProductHighlights = () => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-main">
        <h2 className="heading-l2 text-foreground text-center mb-4">Why you'll love it</h2>
        <p className="text-sm text-muted-foreground text-center max-w-md mx-auto mb-12">
          Every detail has been considered to create a piece that's as functional as it is beautiful.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-background border border-border" style={{ borderRadius: 'var(--radius)' }}>
                <item.icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductHighlights;
