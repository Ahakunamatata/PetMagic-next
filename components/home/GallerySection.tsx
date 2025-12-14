'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function GallerySection() {
  const t = useTranslations('home');

  const examples: Array<
    | { id: number; type: 'image'; src: string }
    | { id: number; type: 'video'; src: string }
  > = [
    { id: 1, type: 'video', src: '/aipetlive/B_video_sbpk.mp4' },
    { id: 2, type: 'video', src: '/aipetlive/B_video_super.mp4' },
    { id: 3, type: 'video', src: '/aipetlive/C_video_sbpk.mp4' },
    { id: 4, type: 'video', src: '/aipetlive/C_video_disney.mp4' },
    { id: 5, type: 'video', src: '/aipetlive/A_video_sbpk.mp4' },
    { id: 6, type: 'video', src: '/aipetlive/A_video_jipuli.mp4' },
  ];

  const tags = [
    t('gallery.tags.artStyles'),
    t('gallery.tags.dreamSeries'),
    t('gallery.tags.rolePlay'),
    t('gallery.tags.awardWinning'),
  ];

  return (
    <section id="gallery" className="relative py-16 px-4 bg-gradient-to-b from-orange-50/30 to-white">
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
              {example.type === 'image' ? (
                <Image
                  src={example.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  priority={index < 2}
                />
              ) : (
                <video
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={example.src}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                />
              )}
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
