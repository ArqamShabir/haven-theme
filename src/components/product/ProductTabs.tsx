import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductTabsProps {
  description: string;
}

const tabs = ['Description', 'Materials & Care', 'Shipping & Returns'];

const ProductTabs = ({ description }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="section-padding border-t border-border">
      <div className="container-main max-w-4xl">
        <div className="flex gap-8 border-b border-border overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`pb-4 text-xs uppercase tracking-[0.15em] font-medium whitespace-nowrap transition-colors relative ${
                activeTab === i ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
              {activeTab === i && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px bg-foreground"
                />
              )}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="py-8"
          >
            {activeTab === 0 && (
              <div className="prose prose-sm max-w-none">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {description || 'Handcrafted from natural stoneware clay, our Artisan Ceramic Vase brings organic warmth and sculptural elegance to any space.'}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Each piece is individually wheel-thrown by skilled artisans, ensuring no two vases are exactly alike. The matte glaze finish adds a contemporary touch while honoring traditional ceramic techniques passed down through generations.
                </p>
              </div>
            )}
            {activeTab === 1 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Materials</h4>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li>• Natural stoneware clay</li>
                    <li>• Matte glaze finish</li>
                    <li>• Food-safe interior (decorative use recommended)</li>
                    <li>• Lead-free and non-toxic</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Care Instructions</h4>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li>• Wipe clean with a damp cloth</li>
                    <li>• Not dishwasher safe</li>
                    <li>• Avoid extreme temperature changes</li>
                    <li>• Handle with care — each piece is unique</li>
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 2 && (
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Shipping</h4>
                  <p>Standard shipping: 5–7 business days</p>
                  <p>Express shipping: 2–3 business days</p>
                  <p className="mt-1 font-medium text-foreground">Free shipping on orders over $150</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Returns</h4>
                  <p>We offer a 30-day return policy on all items in original condition. Returns are free of charge. Contact our team to initiate a return.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProductTabs;
