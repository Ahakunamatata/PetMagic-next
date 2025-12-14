// Zustand Store Types

import { StylePreset } from './api';
import { GeneratedImage, GeneratedVideo } from './generation';

export interface AppStore {
  // Auth State
  isAuthenticated: boolean;
  username: string | null;

  // Credit System
  credits: number;

  // UI State
  currentTab: 'image' | 'video';
  isGenerating: boolean;
  language: 'en' | 'zh';

  // Generation State
  uploadedImage: File | null;
  uploadedImagePreview: string | null;
  selectedExample: 'A' | 'B' | 'C' | null;
  selectedStyle: StylePreset | null;
  prompt: string;
  videoDuration: number; // 3-10 seconds

  // Results
  generatedImages: GeneratedImage[];
  generatedVideos: GeneratedVideo[];

  // Auth Actions
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Credit Actions
  deductCredits: (amount: number) => boolean;
  resetCredits: () => void;

  // Generation Actions
  setUploadedImage: (file: File | null) => void;
  setSelectedExample: (example: 'A' | 'B' | 'C' | null) => void;
  setSelectedStyle: (style: StylePreset | null) => void;
  setPrompt: (prompt: string) => void;
  setVideoDuration: (duration: number) => void;
  setIsGenerating: (isGenerating: boolean) => void;

  // Results Actions
  addGeneratedImage: (image: GeneratedImage) => void;
  addGeneratedVideo: (video: GeneratedVideo) => void;
  clearResults: () => void;

  // UI Actions
  setCurrentTab: (tab: 'image' | 'video') => void;
  setLanguage: (language: 'en' | 'zh') => void;

  // Hydration
  hydrate: () => void;
}
