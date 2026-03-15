import { motion } from 'framer-motion';

const ImageWithText = () => {
  return (
    <section className="section-padding">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <motion.div
            className="md:col-span-5 md:order-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-[4/5] bg-muted overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
                alt="Crafted with intention"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
          <motion.div
            className="md:col-span-7 md:order-1 md:pr-20"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="caps-label text-muted-foreground mb-4">Our philosophy</p>
            <h2 className="heading-l2 text-foreground mb-6">Crafted with intention</h2>
            <p className="text-muted-foreground max-w-lg mb-6">
              Every object in our collection has been selected for its form, material integrity, and ability to
              improve the rhythm of daily life. We work directly with makers who share our commitment to
              lasting quality.
            </p>
            <div className="w-12 h-[1px] bg-foreground" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImageWithText;
