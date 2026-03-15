import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="section-padding">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Image */}
          <motion.div
            className="md:col-span-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-[4/5] bg-muted overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"
                alt="Curated home essentials"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            className="md:col-span-6 md:px-20 flex flex-col items-start md:items-start justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="heading-l1 text-foreground mb-6">
              Essential forms for the modern home
            </h2>
            <div className="w-12 h-[1px] bg-foreground mb-6" />
            <p className="text-muted-foreground mb-8 max-w-md">
              Thoughtfully designed objects that bring clarity and calm to everyday living. Each piece is crafted with intention.
            </p>
            <Link to="/collections" className="btn-secondary">
              View collection
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
