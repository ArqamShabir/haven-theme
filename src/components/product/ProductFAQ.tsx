import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'Is this vase suitable for fresh flowers?',
    a: 'Yes! The interior is water-safe. Simply add water and your favorite blooms. We recommend changing the water every 2–3 days.',
  },
  {
    q: 'What are the exact dimensions?',
    a: 'Small: 5" H × 3.5" W · Medium: 8" H × 5" W · Large: 12" H × 7" W. Each piece is handmade, so slight variations (±0.5") are normal.',
  },
  {
    q: 'How should I clean my vase?',
    a: 'Gently wipe the exterior with a damp cloth. For the interior, rinse with warm water. Avoid harsh chemicals and dishwashers.',
  },
  {
    q: 'Do you offer gift wrapping?',
    a: 'Yes, we offer complimentary gift wrapping on all orders. Simply add a note at checkout and we\'ll package your vase beautifully.',
  },
  {
    q: 'What if my vase arrives damaged?',
    a: 'Each vase is carefully packed with protective materials. In the rare event of damage, contact us within 48 hours and we\'ll send a replacement at no cost.',
  },
];

const ProductFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-padding">
      <div className="container-main max-w-3xl">
        <h2 className="heading-l2 text-foreground text-center mb-3">Frequently asked questions</h2>
        <p className="text-sm text-muted-foreground text-center mb-10">
          Everything you need to know about your new vase.
        </p>
        <div>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{faq.q}</span>
                <span
                  className="text-foreground ml-4 text-lg transition-transform duration-300 flex-shrink-0"
                  style={{ transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  +
                </span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-muted-foreground pb-5 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductFAQ;
