import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'What materials do you use?',
    answer: 'We work with natural, responsibly sourced materials including solid hardwoods, hand-blown glass, organic cotton, and recycled metals. Each material is selected for durability and beauty.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5–7 business days. Express shipping is available at checkout for 2–3 business day delivery. All orders over $150 ship free.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy on all items in their original condition. Returns are free of charge. Simply contact our team to initiate a return.',
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship to over 40 countries worldwide. International shipping rates and delivery times vary by destination.',
  },
  {
    question: 'How do I care for my products?',
    answer: 'Each product comes with specific care instructions. Generally, we recommend gentle cleaning with a soft cloth and avoiding harsh chemicals.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-padding">
      <div className="container-main max-w-3xl">
        <h2 className="heading-l2 text-foreground text-center mb-12">Common questions</h2>
        <div>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left"
              >
                <span className="text-sm font-medium text-foreground">{faq.question}</span>
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
                    <p className="text-sm text-muted-foreground pb-5">{faq.answer}</p>
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

export default FAQ;
