'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import useAppStore from '@/lib/store/useAppStore';
import { CREDIT_COSTS } from '@/lib/constants/credits';
import { StylePreset } from '@/types/api';

interface GenerateButtonProps {
  type: 'image' | 'video';
  onGenerate?: () => Promise<void>;
  useMockData?: boolean; // Toggle between real API and mock data
}

export default function GenerateButton({ type, onGenerate, useMockData = false }: GenerateButtonProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const credits = useAppStore((state) => state.credits);
  const uploadedImage = useAppStore((state) => state.uploadedImage);
  const selectedStyle = useAppStore((state) => state.selectedStyle);
  const selectedExample = useAppStore((state) => state.selectedExample);
  const prompt = useAppStore((state) => state.prompt);
  const videoDuration = useAppStore((state) => state.videoDuration);
  const deductCredits = useAppStore((state) => state.deductCredits);
  const addGeneratedImage = useAppStore((state) => state.addGeneratedImage);
  const addGeneratedVideo = useAppStore((state) => state.addGeneratedVideo);
  const setIsGenerating = useAppStore((state) => state.setIsGenerating);

  const cost = CREDIT_COSTS[type];
  const hasEnoughCredits = credits >= cost;

  const getExampleSourceUrl = (example: 'A' | 'B' | 'C'): string => {
    const map: Record<'A' | 'B' | 'C', string> = {
      A: '/aipetlive/A.JPG',
      B: '/aipetlive/B.png',
      C: '/aipetlive/C.png',
    };
    return map[example];
  };

  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to load example image: ${res.status}`);
    }
    const blob = await res.blob();
    const type = blob.type || 'image/jpeg';
    return new File([blob], filename, { type });
  };

  const handleGenerate = async () => {
    // Validation
    if (!uploadedImage && !selectedExample) {
      toast({
        title: t('errors.uploadFailed'),
        description: 'Please upload a pet photo first',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedStyle) {
      toast({
        title: t('common.error'),
        description: 'Please select a style',
        variant: 'destructive',
      });
      return;
    }

    if (selectedStyle === 'custom' && !prompt.trim()) {
      toast({
        title: t('common.error'),
        description: 'Please describe the scene for Custom style',
        variant: 'destructive',
      });
      return;
    }

    // Example mode behavior:
    // - For preset styles (non-custom): keep fast local preview asset (no credits, no API)
    // - For custom style: run real generation using the selected example image as input
    if (!uploadedImage && selectedExample && selectedStyle !== 'custom') {
      const result = getExampleResultAsset(selectedExample, selectedStyle, type);
      if (!result) {
        toast({
          title: t('common.error'),
          description: `No local asset for example ${selectedExample} / style ${selectedStyle} / ${type}`,
          variant: 'destructive',
        });
        return;
      }

      setIsLoading(true);
      setIsGenerating(true);
      setProgress(100);

      if (type === 'image') {
        addGeneratedImage({
          id: `${Date.now()}-${Math.random()}`,
          url: result,
          style: selectedStyle,
          createdAt: new Date(),
        });
      } else {
        addGeneratedVideo({
          id: `${Date.now()}-${Math.random()}`,
          url: result,
          style: selectedStyle,
          duration: videoDuration,
          createdAt: new Date(),
        });
      }

      toast({
        title: t('create.generate.complete'),
        description: `Loaded example ${type} result`,
      });

      setIsLoading(false);
      setIsGenerating(false);
      setProgress(0);
      return;
    }

    if (!hasEnoughCredits) {
      toast({
        title: t('create.generate.insufficientCredits'),
        variant: 'destructive',
      });
      return;
    }

    // Deduct credits
    const success = deductCredits(cost);
    if (!success) {
      toast({
        title: t('create.generate.insufficientCredits'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
  setIsGenerating(true);
    setProgress(0);

    try {
      if (onGenerate) {
        await onGenerate();
      } else if (useMockData) {
        // Mock generation for testing
        await generateMockResults();
      } else {
        // Real API call
        await generateWithRunComfy();
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: t('errors.generationFailed'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      // Refund credits on error
      const currentCredits = useAppStore.getState().credits;
      useAppStore.setState({ credits: currentCredits + cost });
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  // Real API generation using RunComfy
  const generateWithRunComfy = async () => {
    if (!selectedStyle) return;

    // Resolve input image:
    // - prefer uploadedImage
    // - else if selectedExample: fetch it and convert to File
    let inputImage: File | null = uploadedImage;
    if (!inputImage && selectedExample) {
      const url = getExampleSourceUrl(selectedExample);
      inputImage = await urlToFile(url, `example-${selectedExample}.jpg`);
    }

    if (!inputImage) {
      throw new Error('No input image found');
    }

    toast({
      title: 'Starting generation...',
      description: 'Uploading your image to AI service',
    });

    // Prepare form data
    const formData = new FormData();
    formData.append('image', inputImage);
    formData.append('style', selectedStyle);
    if (prompt) formData.append('prompt', prompt);
    if (type === 'video') {
      formData.append('duration', videoDuration.toString());
    }

    setProgress(10);

    // Start generation
    const endpoint = type === 'image' ? '/api/generate/image' : '/api/generate/video';
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Generation failed');
    }

    const { runId } = await response.json();
    setProgress(30);

    toast({
      title: 'Generation in progress...',
      description: type === 'image'
        ? 'This may take 10-30 seconds'
        : 'This may take 30-60 seconds',
    });

    // Poll for results
    const results = await pollForResults(runId);

    // Add results to store
    results.forEach((result) => {
      if (type === 'image') {
        addGeneratedImage({
          id: `${Date.now()}-${Math.random()}`,
          url: result,
          style: selectedStyle,
          prompt: prompt,
          createdAt: new Date(),
        });
      } else {
        addGeneratedVideo({
          id: `${Date.now()}-${Math.random()}`,
          url: result,
          style: selectedStyle,
          prompt: prompt,
          duration: videoDuration,
          createdAt: new Date(),
        });
      }
    });

    toast({
      title: t('create.generate.complete'),
      description: `Successfully generated ${results.length} ${type}s!`,
    });
  };

  // Poll RunComfy API for results
  const pollForResults = async (runId: string): Promise<string[]> => {
    const maxAttempts = 60; // 2 minutes max
    const interval = 2000; // 2 seconds

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, interval));

      const response = await fetch(`/api/status/${runId}`);
      if (!response.ok) {
        throw new Error('Failed to check status');
      }

      const data = await response.json();
      console.log(`Poll attempt ${i + 1}:`, data);

      // Update progress
      if (data.progress) {
        setProgress(30 + (data.progress * 0.7)); // 30-100%
      }

      if (data.status === 'completed') {
        console.log('Generation completed, outputs:', data.outputs);
        
        const results = type === 'image'
          ? data.outputs?.images || []
          : data.outputs?.videos || [];

        console.log(`Extracted ${results.length} ${type} results:`, results);

        if (results.length === 0) {
          console.error('No results found. Full data:', JSON.stringify(data, null, 2));
          throw new Error('No results returned from API. Please check the logs for more details.');
        }

        return results;
      }

      if (data.status === 'failed') {
        throw new Error(data.error || 'Generation failed');
      }
    }

    throw new Error('Generation timeout');
  };

  // Mock generation for testing without API
  const generateMockResults = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockResults = Array.from({ length: 4 }, (_, i) => ({
      id: `${type}-${Date.now()}-${i}`,
      url: `https://picsum.photos/seed/${Date.now() + i}/800/800`,
      style: selectedStyle!,
      prompt: prompt,
      createdAt: new Date(),
      thumbnailUrl: `https://picsum.photos/seed/${Date.now() + i}/400/400`,
      ...(type === 'video' && { duration: videoDuration }),
    }));

    mockResults.forEach((result) => {
      if (type === 'image') {
        addGeneratedImage(result as any);
      } else {
        addGeneratedVideo(result as any);
      }
    });

    toast({
      title: t('create.generate.complete'),
      description: `Generated ${mockResults.length} ${type}s successfully!`,
    });
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={
        isLoading ||
        !hasEnoughCredits ||
        (!uploadedImage && !selectedExample) ||
        !selectedStyle ||
        (selectedStyle === 'custom' && !prompt.trim())
      }
      size="lg"
      className="w-full"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          {progress > 0
            ? `Generating... ${Math.round(progress)}%`
            : t('create.generate.generating', { type })}
        </span>
      ) : (
        t(`create.generate.${type}Button`, { credits: cost })
      )}
    </Button>
  );
}

function getExampleResultAsset(
  example: 'A' | 'B' | 'C',
  style: StylePreset,
  type: 'image' | 'video'
): string | null {
  // Local aipetlive naming notes:
  // - superhero -> "super"
  // - anime -> "jipuli"
  // - cyberpunk -> "sbpk"
  // - disney -> "disney"
  const styleKeyMap: Record<string, string> = {
    superhero: 'super',
    anime: 'jipuli',
    cyberpunk: 'sbpk',
    disney: 'disney',
  };

  // Custom has no built-in local result
  if (style === 'custom') return null;

  const key = styleKeyMap[style];
  if (!key) return null;

  if (type === 'video') {
    return `/aipetlive/${example}_video_${key}.mp4`;
  }

  return `/aipetlive/${example}_image_${key}.png`;
}
