'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function GallerySection() {
  const t = useTranslations('home');

  const examples = [
    { id: 1, title: t('gallery.examples.1.title'), seed: 1, badge: t('gallery.examples.1.badge') },
    { id: 2, title: t('gallery.examples.2.title'), seed: 2, badge: t('gallery.examples.2.badge') },
    { id: 3, title: t('gallery.examples.3.title'), seed: 3, badge: t('gallery.examples.3.badge') },
    { id: 4, title: t('gallery.examples.4.title'), seed: 4, badge: t('gallery.examples.4.badge') },
    { id: 5, title: t('gallery.examples.5.title'), seed: 5, badge: t('gallery.examples.5.badge') },
    { id: 6, title: t('gallery.examples.6.title'), seed: 6, badge: t('gallery.examples.6.badge') },
  ];

  const tags = [
    t('gallery.tags.artStyles'),
    t('gallery.tags.dreamSeries'),
    t('gallery.tags.rolePlay'),
    t('gallery.tags.awardWinning'),
  ];

  return (
    <section id="gallery" className="relative py-24 px-4 bg-gradient-to-b from-orange-50/30 to-white">
      <div className="container mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-5xl animate-bounce-gentle">🎭</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {t('galleryTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('gallerySubtitle')}
          </p>
        </div>

        {/* 作品网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {examples.map((example, index) => (
            <div
              key={example.id}
              className="group relative aspect-square rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              style={{ 
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* 图片 */}
              <Image
                src={`https://picsum.photos/seed/${example.seed}/600/600`}
                alt={example.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* 渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              
              {/* 徽章 */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 shadow-lg">
                  {example.badge}
                </span>
              </div>
              
              {/* 标题 */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-heading text-2xl font-bold drop-shadow-lg">
                  {example.title}
                </p>
                <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white/90 text-sm">{t('gallery.viewDetails')}</span>
                  <span className="text-white">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部 CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 text-lg mb-6">
            {t('galleryMore')}
          </p>
          <div className="inline-flex gap-3">
            {tags.map((tag, i) => (
              <span 
                key={i}
                className="px-5 py-2 bg-gradient-to-r from-orange-100 to-teal-100 rounded-full text-sm font-semibold text-gray-700 hover:shadow-lg transition-shadow duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
