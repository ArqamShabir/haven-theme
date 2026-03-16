import { motion } from 'framer-motion';
import lifestyleImg from '@/assets/vase-lifestyle-1.jpg';
import craftImg from '@/assets/vase-craft.jpg';

const LifestyleSection = () => {
  return (
    <section className="section-padding">
      <div className="container-main">
        {/* Full-width lifestyle */}
        <motion.div
          className="relative overflow-hidden mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="aspect-[21/9] md:aspect-[3/1]">
            <img
              src={lifestyleImg}
              alt="Ceramic vase in a styled living space"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/30 to-transparent flex items-center">
            <div className="p-8 md:p-16 max-w-lg">
              <p className="caps-label text-background/80 mb-3">Curated for your space</p>
              <h2 className="heading-l2 text-background mb-4">Where craft meets home</h2>
              <p className="text-sm text-background/80 leading-relaxed">
                Each vase is designed to be a focal point — on a shelf, a dining table, or a windowsill catching the afternoon light.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Two-column craft story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-[4/3]">
              <img
                src={craftImg}
                alt="Artisan crafting a ceramic vase"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="py-8 md:px-8">
              <p className="caps-label text-accent mb-3">The craft</p>
              <h3 className="heading-l2 text-foreground mb-4">Made by hand,<br />made to last</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Our artisans spend years perfecting their craft. Each vase undergoes a multi-step process — from wedging and centering the clay, to shaping, trimming, bisque firing, glazing, and a final high-temperature kiln firing.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The result is a piece that carries the warmth of human touch — subtle variations in form and glaze that make every vase uniquely yours.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection;
