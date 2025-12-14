'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useAppStore from '@/lib/store/useAppStore';
import UiverseLoadingRobin from '@/components/ui/uiverse-loading-robin';
import ImageResult from './ImageResult';
import VideoResult from './VideoResult';

interface ResultsGridProps {
  type: 'image' | 'video';
}

export default function ResultsGrid({ type }: ResultsGridProps) {
  const t = useTranslations('create.results');
  const generatedImages = useAppStore((state) => state.generatedImages);
  const generatedVideos = useAppStore((state) => state.generatedVideos);
  const isGenerating = useAppStore((state) => state.isGenerating);

  const results = type === 'image' ? generatedImages : generatedVideos;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <UiverseLoadingRobin className="scale-110" label="Loading" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">
                    {type === 'image' ? '正在生成图片…' : '正在生成视频…'}
                  </p>
                  <p className="text-xs text-gray-500">
                    模型处理中，请稍等片刻
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="text-6xl mb-4">
                  {type === 'image' ? '🖼️' : '🎬'}
                </div>
                <p>{t('empty', { type: type === 'image' ? 'image' : 'video' })}</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {type === 'image'
              ? generatedImages.slice(0, 4).map((image) => (
                  <ImageResult key={image.id} image={image} />
                ))
              : generatedVideos.slice(0, 4).map((video) => (
                  <VideoResult key={video.id} video={video} />
                ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
