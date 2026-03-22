import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/stores/settingsStore';

const ReviewsSummary = () => {
  const testimonials = useSettingsStore(s => s.testimonials);

  if (!testimonials.length) return null;

  const avgRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1);

  return (
    <section className="section-padding">
      <div className="container-main">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="caps-label text-muted-foreground mb-4">Customer reviews</p>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.round(Number(avgRating)) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{avgRating} out of 5 · Based on {testimonials.length} reviews</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((review, i) => (
            <motion.div
              key={review.name + i}
              className="p-6 border border-border bg-card"
              style={{ borderRadius: 'var(--radius)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">"{review.text}"</p>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-foreground">{review.name}</p>
                <p className="text-[10px] text-muted-foreground">{review.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSummary;
