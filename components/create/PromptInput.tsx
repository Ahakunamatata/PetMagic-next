'use client';

import { useTranslations } from 'next-intl';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import useAppStore from '@/lib/store/useAppStore';
import { IMAGE_PROMPT_TAGS } from '@/lib/constants/prompts';

export default function PromptInput() {
  const t = useTranslations('create.prompt');
  const prompt = useAppStore((state) => state.prompt);
  const setPrompt = useAppStore((state) => state.setPrompt);
  const selectedStyle = useAppStore((state) => state.selectedStyle);

  const isRequired = selectedStyle === 'custom';

  const handleTagClick = (tagValue: string) => {
    const currentPrompt = prompt.trim();
    const newPrompt = currentPrompt
      ? `${currentPrompt}, ${tagValue}`
      : tagValue;
    setPrompt(newPrompt);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">
          {t('title')}
          {isRequired ? <span className="text-red-500"> *</span> : null}
        </h3>
        {isRequired ? (
          <span className="text-sm text-red-600">Required for Custom</span>
        ) : null}
      </div>
      <Textarea
        placeholder={t('placeholder')}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-[400px] resize-none"
        required={isRequired}
        aria-required={isRequired}
      />
      <div className="flex flex-wrap gap-2">
        {IMAGE_PROMPT_TAGS.map((tag) => (
          <Badge
            key={tag.value}
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
            onClick={() => handleTagClick(tag.value)}
          >
            {t(`tags.${tag.value.replace(/ /g, '')}`)}
          </Badge>
        ))}
      </div>
    </div>
  );
}
