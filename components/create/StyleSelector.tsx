'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import useAppStore from '@/lib/store/useAppStore';
import { STYLE_PRESETS } from '@/lib/constants/styles';

export default function StyleSelector() {
  const t = useTranslations('create.style');
  const selectedStyle = useAppStore((state) => state.selectedStyle);
  const setSelectedStyle = useAppStore((state) => state.setSelectedStyle);

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">{t('title')}</h3>
      <div className="flex flex-col gap-2">
        {STYLE_PRESETS.map((style) => (
          <Card
            key={style.value}
            className={`cursor-pointer transition-all ${
              selectedStyle === style.value
                ? 'ring-2 ring-primary border-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedStyle(style.value)}
          >
            <CardContent className="p-3 flex items-center gap-3">
              <p className="text-sm font-medium">{t(style.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
