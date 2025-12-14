import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import GallerySection from '@/components/home/GallerySection';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('meta.home');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="overflow-hidden">
        <HeroSection />
        <GallerySection />
        <FeaturesSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
