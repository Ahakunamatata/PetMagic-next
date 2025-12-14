'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FeaturesSection() {
  const t = useTranslations('home');

  const features = [
    {
      icon: '🐾',
      title: t('features.styles.title'),
      description: t('features.styles.description'),
      gradient: 'from-orange-500 to-orange-600',
    },
    {
      icon: '🦴',
      title: t('features.age.title'),
      description: t('features.age.description'),
      gradient: 'from-teal-500 to-teal-600',
    },
    {
      icon: '🐶',
      title: t('features.characters.title'),
      description: t('features.characters.description'),
      gradient: 'from-orange-400 to-teal-500',
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {t('featuresTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('featuresSubtitle')}
          </p>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="relative border-0 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
            >
              {/* 渐变装饰 */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${feature.gradient}`}></div>
              
              <CardHeader className="pt-8">
                {/* 图标容器 */}
                <div className="mb-6 flex items-center justify-center">
                  <div className={`text-7xl transform group-hover:scale-110 transition-transform duration-300 animate-bounce-gentle`}
                       style={{ animationDelay: `${index * 0.2}s` }}>
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="font-heading text-2xl font-bold text-center text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
              
              {/* 悬停效果 - 底部渐变 */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </Card>
          ))}
        </div>

        {/* 额外的特性标签 */}
        <div className="mt-16 flex flex-wrap gap-4 justify-center">
          {[
            t('featureTags.aiPowered'),
            t('featureTags.highQuality'),
            t('featureTags.fastProcessing'),
            t('featureTags.multipleStyles'),
            t('featureTags.easyToUse'),
            t('featureTags.privacySecure')
          ].map((tag, index) => (
            <span 
              key={index}
              className="px-6 py-3 bg-white rounded-full shadow-md text-gray-700 font-medium hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
