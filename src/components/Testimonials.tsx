import { motion } from 'framer-motion';

const Testimonials = () => {
  return (
    <section className="section-padding">
      <div className="container-main">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="caps-label text-muted-foreground mb-8">What our customers say</p>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No reviews yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Customer testimonials will appear here.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
