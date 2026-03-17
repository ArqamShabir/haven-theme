import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Truck, Clock, Globe, Package } from 'lucide-react';

const methods = [
  { icon: Package, title: 'Standard Shipping', time: '5–7 business days', price: '$5.95 (Free over $150)' },
  { icon: Truck, title: 'Express Shipping', time: '2–3 business days', price: '$14.95' },
  { icon: Clock, title: 'Next-Day Delivery', time: '1 business day', price: '$24.95' },
  { icon: Globe, title: 'International', time: '7–14 business days', price: 'Calculated at checkout' },
];

const ShippingPage = () => (
  <div className="min-h-screen bg-background">
    <AnnouncementBar />
    <Header />
    <main className="section-padding">
      <div className="container-main max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="heading-l1 text-foreground mb-4">Shipping Information</h1>
          <p className="text-sm text-muted-foreground mb-12">Every order is carefully packed and shipped with care.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
            {methods.map(m => (
              <div key={m.title} className="p-5 border border-border" style={{ borderRadius: 'var(--radius)' }}>
                <m.icon className="w-5 h-5 text-foreground mb-3" strokeWidth={1.5} />
                <h3 className="text-sm font-medium text-foreground mb-1">{m.title}</h3>
                <p className="text-xs text-muted-foreground">{m.time}</p>
                <p className="text-xs font-medium text-foreground mt-2">{m.price}</p>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-serif text-foreground mb-3">Order Processing</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">Orders placed before 2pm PST on business days ship the same day. Orders placed after 2pm or on weekends/holidays ship the next business day. You'll receive a tracking number via email once your order ships.</p>
            </div>
            <div>
              <h2 className="text-lg font-serif text-foreground mb-3">Packaging</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">Each item is wrapped in protective tissue, cushioned with recycled packing materials, and placed in our signature Haven box. Fragile items receive extra protection to ensure they arrive in perfect condition.</p>
            </div>
            <div>
              <h2 className="text-lg font-serif text-foreground mb-3">International Shipping</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">We ship worldwide. International customers may be subject to import duties and taxes, which are the responsibility of the buyer. Shipping rates are calculated at checkout based on destination and package weight.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default ShippingPage;
