// RunComfy API Client
// Documentation: https://docs.runcomfy.com/model-apis/quickstart

const API_TOKEN = process.env.RUNCOMFY_API_TOKEN || '';
const API_BASE_URL = process.env.RUNCOMFY_API_URL || 'https://model-api.runcomfy.net';

// 图片生成模型 ID
const IMAGE_MODEL_ID = 'blackforestlabs/flux-1-kontext/pro/edit';

// 视频生成模型 ID - Seedance 1.0 Pro Fast
// 文档: https://www.runcomfy.com/playground/bytedance/seedance-1-0/pro/fast/image-to-video/api
const VIDEO_MODEL_ID = 'bytedance/seedance-1-0/pro/fast/image-to-video';

interface RunComfySubmitResponse {
  request_id: string;
  status_url: string;
  result_url: string;
  cancel_url: string;
}

interface RunComfyStatusResponse {
  request_id: string;
  status: 'in_queue' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  queue_position?: number;
  status_url: string;
  result_url: string;
}

interface RunComfyResultResponse {
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

/**
 * 上传图片到阿里云 OSS 对象存储
 * 注意：RunComfy API 需要公共 HTTPS URL
 */
export async function uploadImage(file: File | Blob): Promise<string> {
  // 在服务器端环境中（API 路由）
  if (typeof window === 'undefined') {
    // 直接在服务器端上传到阿里云 OSS
    const ossModule = await import('@/lib/utils/oss-upload');
    const url = await ossModule.uploadToOSS(file);
    console.log('Server-side upload to OSS successful:', url);
    return url;
  }
  
  // 在浏览器环境中，调用上传 API
  console.log('Client-side upload via API...');
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(errorData.error || 'Upload failed');
  }

  const data = await response.json();
  
  if (!data.success || !data.url) {
    throw new Error(data.error || 'Upload failed');
  }

  console.log('Upload successful:', data.url);
  return data.url;
}

/**
 * 生成图片使用 RunComfy API
 * 
 * @param imageUrl - 公共可访问的图片 URL
 * @param style - 风格预设
 * @param prompt - 额外的提示词
 * @returns request_id 用于轮询结果
 */
export async function generateImage(
  imageUrl: string,
  style: string,
  prompt?: string
): Promise<string> {
  const fullPrompt = buildPromptForStyle(style, prompt);

  const requestBody = {
    prompt: fullPrompt,
    image_url: imageUrl,
    aspect_ratio: '1:1', // 或者 '16:9' 根据需要
    // seed: Math.floor(Math.random() * 1000000), // 可选：随机种子
  };

  console.log('RunComfy API request:', {
    url: `${API_BASE_URL}/v1/models/${IMAGE_MODEL_ID}`,
    body: requestBody,
  });

  const response = await fetch(`${API_BASE_URL}/v1/models/${IMAGE_MODEL_ID}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('RunComfy API error:', error);
    throw new Error(`Generation failed: ${error}`);
  }

  const data: RunComfySubmitResponse = await response.json();
  console.log('RunComfy API response:', data);

  if (!data.request_id) {
    throw new Error('Failed to submit generation request');
  }

  return data.request_id;
}

/**
 * 生成视频使用 RunComfy API (Seedance 1.0 Pro Fast)
 * 文档: https://www.runcomfy.com/playground/bytedance/seedance-1-0/pro/fast/image-to-video/api
 * 
 * @param imageUrl - 公共可访问的图片 URL
 * @param style - 风格预设
 * @param duration - 视频时长（秒，2-12）
 * @param prompt - 额外的提示词
 * @returns request_id 用于轮询结果
 */
export async function generateVideo(
  imageUrl: string,
  style: string,
  duration: number,
  prompt?: string
): Promise<string> {
  const fullPrompt = buildPromptForStyle(style, prompt);

  // Seedance 模型参数
  const requestBody = {
    text: fullPrompt, // Seedance 使用 'text' 而不是 'prompt'
    image_url: imageUrl,
    resolution: '480p', // 可选: 480p, 720p, 1080p
    ratio: 'adaptive', // 可选: 16:9, 4:3, 1:1, 3:4, 9:16, 21:9, adaptive
    duration: Math.min(Math.max(duration, 2), 12), // 限制在 2-12 秒
    seed: Math.floor(Math.random() * 100000000), // 随机种子
  };

  console.log('Seedance API request:', {
    url: `${API_BASE_URL}/v1/models/${VIDEO_MODEL_ID}`,
    body: requestBody,
  });

  const response = await fetch(`${API_BASE_URL}/v1/models/${VIDEO_MODEL_ID}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Seedance API error:', error);
    throw new Error(`Video generation failed: ${error}`);
  }

  const data: RunComfySubmitResponse = await response.json();
  console.log('Seedance API response:', data);

  if (!data.request_id) {
    throw new Error('Failed to submit video generation request');
  }

  return data.request_id;
}

/**
 * 检查生成状态
 * 
 * @param requestId - 请求 ID
 * @returns 状态响应
 */
export async function checkStatus(requestId: string): Promise<RunComfyStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/requests/${requestId}/status`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Status check failed: ${error}`);
  }

  const data: RunComfyStatusResponse = await response.json();
  return data;
}

/**
 * 获取生成结果
 * 
 * @param requestId - 请求 ID
 * @returns 结果响应
 */
export async function getResult(requestId: string): Promise<RunComfyResultResponse> {
  console.log('Fetching result for request ID:', requestId);
  
  const response = await fetch(`${API_BASE_URL}/v1/requests/${requestId}/result`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to get result:', error);
    throw new Error(`Failed to get result: ${error}`);
  }

  const data: RunComfyResultResponse = await response.json();
  console.log('Result data received:', {
    request_id: data.request_id,
    status: data.status,
    has_output: !!data.output,
    output_keys: data.output ? Object.keys(data.output) : [],
    output: data.output,
  });
  
  return data;
}

/**
 * 轮询直到完成
 * 
 * @param requestId - 请求 ID
 * @param maxAttempts - 最大尝试次数
 * @param interval - 轮询间隔（毫秒）
 * @returns 结果响应
 */
export async function pollUntilComplete(
  requestId: string,
  maxAttempts = 60,
  interval = 2000
): Promise<RunComfyResultResponse> {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkStatus(requestId);

    if (status.status === 'completed') {
      // 获取最终结果
      return await getResult(requestId);
    }

    if (status.status === 'failed' || status.status === 'cancelled') {
      throw new Error(`Generation ${status.status}`);
    }

    // 等待后继续轮询
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error('Generation timeout');
}

/**
 * 根据风格构建提示词
 */
function buildPromptForStyle(style: string, additionalPrompt?: string): string {
  if (style === 'custom') {
    return additionalPrompt?.trim() || '';
  }

  const stylePrompts: Record<string, string> = {
    'superhero': 'Dressed as a superhero with costume and cape, powerful heroic pose, dynamic action stance',
    'anime': 'Transform into healing anime style, Studio Ghibli inspired, warm and peaceful atmosphere, soft colors and gentle expressions',
    'cyberpunk': 'Transform into cyberpunk style, neon lights, futuristic cityscape, high-tech aesthetic with glowing elements',
    'disney': 'Transform into classic Disney animation style, bright and vibrant colors, expressive eyes, clean line art, heartwarming magical atmosphere',
  };

  const stylePrompt = stylePrompts[style] || style;
  
  if (additionalPrompt) {
    return `${stylePrompt}, ${additionalPrompt}`;
  }
  
  return stylePrompt;
}

/**
 * 取消请求
 * 
 * @param requestId - 请求 ID
 */
export async function cancelRequest(requestId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/v1/requests/${requestId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to cancel request: ${error}`);
  }
}

/**
 * 辅助函数：将文件转为 base64
 */
export async function fileToBase64(file: File | Blob): Promise<string> {
  // 在 Node.js 环境中（服务器端）
  if (typeof window === 'undefined') {
    const buffer = Buffer.from(await file.arrayBuffer());
    return buffer.toString('base64');
  }
  
  // 在浏览器环境中
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]); // 移除 data:image/... 前缀
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
