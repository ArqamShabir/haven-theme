import { motion } from 'framer-motion';
import { Package, Truck, RotateCcw } from 'lucide-react';

const benefits = [
  {
    icon: Package,
    title: 'Considered materials',
    description: 'Every product is crafted from responsibly sourced materials built to last.',
  },
  {
    icon: Truck,
    title: 'Complimentary shipping',
    description: 'Free delivery on all orders over $150. Carefully packaged for safe arrival.',
  },
  {
    icon: RotateCcw,
    title: '30-day returns',
    description: 'Not quite right? Return within 30 days for a full refund, no questions asked.',
  },
];

const Benefits = () => {
  return (
    <section className="section-padding border-t border-border">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              className="text-center"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <b.icon className="w-6 h-6 mx-auto mb-4 text-foreground" strokeWidth={1} />
              <h3 className="caps-label text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
