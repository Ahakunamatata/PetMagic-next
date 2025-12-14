import { StylePreset } from '@/types/api';

export interface StyleOption {
  value: StylePreset;
  label: string;
}

export const STYLE_PRESETS: StyleOption[] = [
  {
    value: 'superhero',
    label: 'Superhero',
  },
  {
    value: 'anime',
    label: 'Healing Anime',
  },
  {
    value: 'cyberpunk',
    label: 'Cyberpunk',
  },
  {
    value: 'disney',
    label: 'Disney',
  },
  {
    value: 'custom',
    label: 'Custom',
  },
];
