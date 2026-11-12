export type ResinFinishId = 'porcelain_silk' | 'champagne_quartz' | 'honey_amber';

export interface FinishPreset {
  id: ResinFinishId;
  hint: string;
  swatchGradient: string;
  swatchBorder: string;
  // Day Atelier palette (luminous, creamy, zero dark/black tones)
  lightShell: string;
  lightDeep: string;
  lightRim: string;
  // Evening Sanctuary palette (warm bronze-champagne, never pitch black)
  darkShell: string;
  darkDeep: string;
  darkRim: string;
  wombGlowColor: string;
  wombCenterAlpha: number;
}

export const FINISH_PRESETS: Record<ResinFinishId, FinishPreset> = {
  porcelain_silk: {
    id: 'porcelain_silk',
    hint: 'Porcelana Marfil',
    swatchGradient: 'radial-gradient(circle at 32% 30%, #FFFFFF 0%, #F3ECE1 55%, #D8CBB8 100%)',
    swatchBorder: '#C8B9A6',
    lightShell: '#FBF8F3',
    lightDeep: '#E2D6C5',
    lightRim: '#FFFFFF',
    darkShell: '#C8B8A4',
    darkDeep: '#6E5D4D',
    darkRim: '#FFF6E8',
    wombGlowColor: '#FFB35C',
    wombCenterAlpha: 0.07,
  },
  champagne_quartz: {
    id: 'champagne_quartz',
    hint: 'Cuarzo Champán',
    swatchGradient: 'radial-gradient(circle at 32% 30%, #FFFDF9 0%, #E6D3B8 55%, #BFA382 100%)',
    swatchBorder: '#B59B7C',
    lightShell: '#F6EFE4',
    lightDeep: '#D6C4AC',
    lightRim: '#FFFDF9',
    darkShell: '#BCA68E',
    darkDeep: '#5E4E3E',
    darkRim: '#FFF0D8',
    wombGlowColor: '#FFA647',
    wombCenterAlpha: 0.05,
  },
  honey_amber: {
    id: 'honey_amber',
    hint: 'Ámbar Dorado',
    swatchGradient: 'radial-gradient(circle at 32% 30%, #FFE8C2 0%, #D9A76A 55%, #A67338 100%)',
    swatchBorder: '#9E6E36',
    lightShell: '#F4E8D6',
    lightDeep: '#CBB396',
    lightRim: '#FFF9EE',
    darkShell: '#B09474',
    darkDeep: '#524132',
    darkRim: '#FFECC8',
    wombGlowColor: '#FF9A36',
    wombCenterAlpha: 0.04,
  },
};
