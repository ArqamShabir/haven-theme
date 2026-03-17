import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const sections = [
  { title: 'Information We Collect', content: 'We collect information you provide directly, such as your name, email, shipping address, and payment details when you place an order. We also automatically collect certain information about your device and browsing behavior through cookies and similar technologies.' },
  { title: 'How We Use Your Information', content: 'We use your information to process orders, communicate with you about your purchases, send promotional materials (with your consent), improve our products and services, and comply with legal obligations.' },
  { title: 'Information Sharing', content: 'We do not sell your personal information. We share your data only with service providers who help us operate our business (shipping carriers, payment processors) and as required by law.' },
  { title: 'Data Security', content: 'We implement industry-standard security measures to protect your personal information, including SSL encryption for all transactions and secure data storage practices.' },
  { title: 'Cookies', content: 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.' },
  { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly.' },
  { title: 'Contact Us', content: 'If you have questions about this Privacy Policy, please contact us at privacy@haven-home.com or write to us at 123 Artisan Lane, Portland, OR 97201.' },
];

const PrivacyPage = () => (
  <div className="min-h-screen bg-background">
    <AnnouncementBar />
    <Header />
    <main className="section-padding">
      <div className="container-main max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="heading-l1 text-foreground mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">Last updated: March 2026</p>
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

export default PrivacyPage;
