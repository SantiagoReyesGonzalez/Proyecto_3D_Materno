export type ResinFinishId = 'porcelain_silk' | 'champagne_quartz' | 'honey_amber';

export interface FinishPreset {
  id: ResinFinishId;
  hint: string;
  swatchGradient: string;
  swatchBorder: string;
  // Day Atelier palette (luminous, creamy alabaster tones)
  lightShell: string;
  lightDeep: string;
  lightRim: string;
  // Evening Sanctuary palette (warm translucent backlit crystal-alabaster, never dull/grey)
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
    darkShell: '#F0E4D4',
    darkDeep: '#5C4433',
    darkRim: '#FFF8EC',
    wombGlowColor: '#FFB861',
    wombCenterAlpha: 0.06,
  },
  champagne_quartz: {
    id: 'champagne_quartz',
    hint: 'Cuarzo Champán',
    swatchGradient: 'radial-gradient(circle at 32% 30%, #FFFDF9 0%, #E6D3B8 55%, #BFA382 100%)',
    swatchBorder: '#B59B7C',
    lightShell: '#F6EFE4',
    lightDeep: '#D6C4AC',
    lightRim: '#FFFDF9',
    darkShell: '#EAD6BC',
    darkDeep: '#563D2B',
    darkRim: '#FFF3DF',
    wombGlowColor: '#FFA845',
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
    darkShell: '#E2C399',
    darkDeep: '#4F3522',
    darkRim: '#FFECC8',
    wombGlowColor: '#FF982E',
    wombCenterAlpha: 0.04,
  },
};
