import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const AboutPage = () => (
  <div className="min-h-screen bg-background">
    <AnnouncementBar />
    <Header />
    <main>
      <section className="section-padding">
        <div className="container-main max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="caps-label text-muted-foreground mb-4">Our Story</p>
            <h1 className="heading-l1 text-foreground mb-8">About Haven</h1>
            <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
              <p>Haven was founded with a simple belief: the objects we surround ourselves with shape how we feel. We curate and design home essentials that bring clarity, calm, and beauty to everyday living.</p>
              <p>Every piece in our collection is chosen for its form, material integrity, and ability to improve the rhythm of daily life. We work directly with artisans and makers who share our commitment to lasting quality and responsible sourcing.</p>
              <p>Our team travels the world seeking out the finest materials and most talented craftspeople. From the stoneware clay of our ceramic vases to the natural fibers of our textiles, every material is selected with purpose.</p>
              <p>We believe that thoughtful design shouldn't be exclusive. That's why we strive to offer premium quality at accessible prices, with transparent sourcing and a commitment to sustainability at every step.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-main max-w-3xl">
          <h2 className="heading-l2 text-foreground mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Craft Over Mass', desc: 'We prioritize handmade quality over mass production, ensuring every piece has character.' },
              { title: 'Sustainable Materials', desc: 'From clay to cotton, we source responsibly and minimize our environmental footprint.' },
              { title: 'Timeless Design', desc: 'We design objects that transcend trends — pieces you\'ll love for years, not seasons.' },
              { title: 'Fair Partnerships', desc: 'We pay fair wages and build lasting relationships with our makers around the world.' },
            ].map(v => (
              <div key={v.title}>
                <h3 className="text-sm font-medium text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default AboutPage;
