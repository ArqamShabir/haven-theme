import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const sections = [
  { title: 'Return Window', content: 'We offer a generous 30-day return policy on all items. Items must be in their original condition, unused, and in original packaging to qualify for a full refund.' },
  { title: 'How to Initiate a Return', content: 'To start a return, email us at returns@haven-home.com with your order number. We\'ll send you a prepaid return shipping label within 24 hours. Simply pack the item securely and drop it off at any carrier location.' },
  { title: 'Refund Processing', content: 'Once we receive your return, we\'ll inspect the item and process your refund within 3–5 business days. Refunds are issued to the original payment method. Please allow an additional 5–10 business days for the refund to appear on your statement.' },
  { title: 'Exchanges', content: 'We\'re happy to offer exchanges for a different size or color. Contact us and we\'ll arrange the exchange at no additional shipping cost.' },
  { title: 'Damaged or Defective Items', content: 'If your item arrives damaged or defective, contact us within 48 hours with photos and we\'ll send a replacement at no cost — no need to return the original.' },
  { title: 'Non-Returnable Items', content: 'Custom or personalized orders, gift cards, and items marked as final sale cannot be returned or refunded.' },
];

const RefundPage = () => (
  <div className="min-h-screen bg-background">
    <AnnouncementBar />
    <Header />
    <main className="section-padding">
      <div className="container-main max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="heading-l1 text-foreground mb-4">Refund Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">We want you to love every purchase. If not, we make returns easy.</p>
          <div className="space-y-8">
            {sections.map(s => (
              <div key={s.title}>
                <h2 className="text-lg font-serif text-foreground mb-3">{s.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default RefundPage;
