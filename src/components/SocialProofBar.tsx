import { Star, Users, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { icon: Star, value: '4.9/5', label: 'Average rating' },
  { icon: Users, value: '2,400+', label: 'Happy customers' },
  { icon: Award, value: '5 Years', label: 'Of craftsmanship' },
  { icon: ShieldCheck, value: '100%', label: 'Satisfaction guarantee' },
];

const SocialProofBar = () => (
  <section className="py-8 border-y border-border bg-secondary/30">
    <div className="container-main">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex items-center gap-3 justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <stat.icon className="w-5 h-5 text-accent flex-shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-semibold text-foreground">{stat.value}</p>
              <p className="text-[10px] caps-label text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProofBar;
