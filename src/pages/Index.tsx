import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SocialProofBar from '@/components/SocialProofBar';
import FeaturedCollection from '@/components/FeaturedCollection';
import ImageWithText from '@/components/ImageWithText';
import Benefits from '@/components/Benefits';
import UrgencyBanner from '@/components/UrgencyBanner';
import ReviewsSummary from '@/components/ReviewsSummary';
import FAQ from '@/components/FAQ';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <SocialProofBar />
        <FeaturedCollection />
        <ImageWithText />
        <Benefits />
        <UrgencyBanner />
        <ReviewsSummary />
        <FAQ />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
