// RunComfy API Types
// Based on https://docs.runcomfy.com/model-apis/async-queue-endpoints

export interface RunComfySubmitResponse {
  request_id: string;
  status_url: string;
  result_url: string;
  cancel_url: string;
}

export interface RunComfyGenerationRequest {
  imageUrl: string;
  style: StylePreset;
  prompt?: string;
  duration?: number; // for video generation
}

export interface RunComfyGenerationResponse {
  success: boolean;
  requestId: string;
  message?: string;
}

export interface RunComfyStatusResponse {
  request_id: string;
  status: 'in_queue' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  queue_position?: number;
  status_url: string;
  result_url: string;
}

export interface RunComfyResultResponse {
  request_id: string;
  status: 'succeeded' | 'failed' | 'in_queue' | 'in_progress' | 'cancelled';
  output?: {
    image?: string;
    images?: string[];
    video?: string;
    videos?: string[];
    [key: string]: any;
  };
  created_at?: string;
  finished_at?: string;
  error?: string;
}

export interface GenerationResult {
  url: string;
  type: 'image' | 'video';
  thumbnailUrl?: string;
}

export type StylePreset =
  | 'superhero'
  | 'anime'
  | 'cyberpunk'
  | 'disney'
  | 'custom';

export interface PromptTag {
  label: string;
  value: string;
}
