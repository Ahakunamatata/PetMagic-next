import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppStore } from '@/types/store';
import { StylePreset } from '@/types/api';
import { GeneratedImage, GeneratedVideo } from '@/types/generation';
import { validateCredentials } from '../utils/auth';
import { INITIAL_CREDITS, CREDIT_COSTS } from '../constants/credits';

const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
  // Auth State
  isAuthenticated: false,
  username: null,

  // Credit System
  credits: INITIAL_CREDITS,

  // UI State
  currentTab: 'image',
  isGenerating: false,
  language: 'en',

  // Generation State
  uploadedImage: null,
  uploadedImagePreview: null,
  selectedExample: null,
  selectedStyle: null,
  prompt: '',
  videoDuration: 3,

  // Results
  generatedImages: [],
  generatedVideos: [],

  // Auth Actions
  login: (username: string, password: string) => {
    const isValid = validateCredentials(username, password);
    if (isValid) {
      const currentCredits = get().credits;
      set({
        isAuthenticated: true,
        username,
        // 只有当积分为0或未初始化时才设置为初始值
        credits: currentCredits > 0 ? currentCredits : INITIAL_CREDITS,
      });
    }
    return isValid;
  },

  logout: () => {
    set({
      isAuthenticated: false,
      username: null,
      credits: INITIAL_CREDITS,
      uploadedImage: null,
      uploadedImagePreview: null,
      selectedExample: null,
      selectedStyle: null,
      prompt: '',
      generatedImages: [],
      generatedVideos: [],
    });
  },

  // Credit Actions
  deductCredits: (amount: number) => {
    const { credits } = get();
    if (credits >= amount) {
      const newCredits = credits - amount;
      set({ credits: newCredits });
      return true;
    }
    return false;
  },

  resetCredits: () => {
    set({ credits: INITIAL_CREDITS });
  },

  // Generation Actions
  setUploadedImage: (file: File | null) => {
    if (file) {
      // Selecting a real upload clears any example selection
      set({ selectedExample: null });
      const reader = new FileReader();
      reader.onloadend = () => {
        set({
          uploadedImage: file,
          uploadedImagePreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      set({
        uploadedImage: null,
        uploadedImagePreview: null,
      });
    }
  },

  setSelectedExample: (example: 'A' | 'B' | 'C' | null) => {
    const previewMap: Record<'A' | 'B' | 'C', string> = {
      A: '/aipetlive/A.JPG',
      B: '/aipetlive/B.png',
      C: '/aipetlive/C.png',
    };

    if (!example) {
      set({ selectedExample: null });
      return;
    }

    set({
      selectedExample: example,
      uploadedImage: null,
      uploadedImagePreview: previewMap[example],
    });
  },

  setSelectedStyle: (style: StylePreset | null) => {
    // Custom has no local example-result mapping; clear example to avoid confusion
    if (style === 'custom') {
      set({ selectedStyle: style, selectedExample: null });
      return;
    }
    set({ selectedStyle: style });
  },

  setPrompt: (prompt: string) => {
    set({ prompt });
  },

  setVideoDuration: (duration: number) => {
    // Clamp duration between 3 and 10 seconds
    const clampedDuration = Math.max(3, Math.min(10, duration));
    set({ videoDuration: clampedDuration });
  },

  setIsGenerating: (isGenerating: boolean) => {
    set({ isGenerating });
  },

  // Results Actions
  addGeneratedImage: (image: GeneratedImage) => {
    set((state) => ({
      generatedImages: [image, ...state.generatedImages],
    }));
  },

  addGeneratedVideo: (video: GeneratedVideo) => {
    set((state) => ({
      generatedVideos: [video, ...state.generatedVideos],
    }));
  },

  clearResults: () => {
    set({
      generatedImages: [],
      generatedVideos: [],
    });
  },

  // UI Actions
  setCurrentTab: (tab: 'image' | 'video') => {
    set({ currentTab: tab });
  },

  setLanguage: (language: 'en' | 'zh') => {
    set({ language });
  },

  // Hydration - now handled by persist middleware
  hydrate: () => {
    // Persist middleware handles hydration automatically
  },
    }),
    {
      name: 'petmagic-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        username: state.username,
        credits: state.credits,
        language: state.language,
      }),
    }
  )
);

export default useAppStore;
