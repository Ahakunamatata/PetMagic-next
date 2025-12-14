'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const t = useTranslations('home');

  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-teal-50 -z-10"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto text-center max-w-5xl">
        {/* 主标题 - 使用渐变和大字体 */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight animate-fade-up">
          <span className="block mb-2">{t('title')}</span>
          <span className="text-gradient">{t('tagline')} ✨</span>
        </h1>
        
        {/* 副标题 */}
        <p className="font-heading text-xl md:text-2xl lg:text-3xl text-gray-600 mb-12 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {t('subtitle')}
        </p>

        {/* CTA 按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <Link href="/create/image-generator">
            <Button 
              size="lg" 
              className="text-lg px-10 py-7 rounded-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              🎨 {t('ctaPrimary')}
            </Button>
          </Link>
          <Link href="/create/video-animator">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-10 py-7 rounded-2xl font-bold border-2 border-teal-500 text-teal-600 hover:bg-teal-50 hover:border-teal-600 hover:text-teal-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🎬 {t('ctaSecondary')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
