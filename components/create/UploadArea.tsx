'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import useAppStore from '@/lib/store/useAppStore';
import Image from 'next/image';

// Example images for quick selection
const EXAMPLE_IMAGES: Array<{ id: 'A' | 'B' | 'C'; src: string }> = [
  { id: 'A', src: '/aipetlive/A.JPG' },
  { id: 'B', src: '/aipetlive/B.png' },
  { id: 'C', src: '/aipetlive/C.png' },
];

export default function UploadArea() {
  const t = useTranslations();
  const { toast } = useToast();
  const uploadedImagePreview = useAppStore((state) => state.uploadedImagePreview);
  const selectedExample = useAppStore((state) => state.selectedExample);
  const setUploadedImage = useAppStore((state) => state.setUploadedImage);
  const setSelectedExample = useAppStore((state) => state.setSelectedExample);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: t('errors.fileType'),
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t('errors.fileSize'),
          variant: 'destructive',
        });
        return;
      }

      setUploadedImage(file);
    },
    [setUploadedImage, toast, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
  });

  const handleExampleClick = (exampleId: 'A' | 'B' | 'C') => {
    // Use local example: don't upload / don't call AI
    setSelectedExample(exampleId);
    // uploadedImagePreview will be set inside store setter
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">{t('create.upload.title')}</h3>
      <Card>
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={`rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'bg-primary/5'
                : 'hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />

            <div className="h-[400px] flex items-center justify-center">
              {uploadedImagePreview ? (
                <div className="space-y-4 w-full">
                  <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                    <Image
                      src={uploadedImagePreview}
                      alt="Uploaded pet"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {t('create.upload.replaceHint') || 'Click or drag to replace image'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 w-full">
                  <div className="text-6xl">�</div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      {t('create.upload.friendlyPrompt') || 'Upload your adorable pet photo'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {t('create.upload.hint')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t('create.upload.limit')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Example Images (outside dropzone root to avoid click being captured) */}
          <div className="px-6 pb-6">
            <p className="text-xs text-gray-500 mb-2">{t('create.upload.examples') || 'Try these examples:'}</p>
            <div className="flex gap-2">
              {EXAMPLE_IMAGES.map((item, index) => {
                const isSelected = selectedExample === item.id;
                return (
                  <button
                    type="button"
                    key={index}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all hover:ring-2 hover:ring-primary ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleExampleClick(item.id);
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={`Example ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
