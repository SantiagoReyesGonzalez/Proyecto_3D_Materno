export type ProductTierId = 1 | 2 | 3;

export type FinishId = 'smoked' | 'frosted' | 'obsidian' | 'bronze';

export type PaymentModality = 'split_50_50' | 'addi_3_cuotas' | 'vaca_baby_shower';

export type Tier3Modality = 'photo_guide' | 'presencial_scan';

export interface ProductTier {
  id: ProductTierId;
  slug: string;
  name: string;
  subtitle: string;
  badge?: string;
  isBestSeller?: boolean;
  isAuthorEdition?: boolean;
  officialPrice: number;
  promoPrice: number;
  scanPrice?: number;
  installmentsCount: number;
  installmentAmount: number;
  vacaSuggestedPeople: number;
  vacaPerPersonAmount: number;
  includesLedBase: boolean;
  customMotherTorso: boolean;
  deliveryDays: string;
  shortDescription: string;
  audienceTag: string;
  features: string[];
  specs: {
    torso: string;
    baby: string;
    lighting: string;
    packaging: string;
  };
}

export interface FinishOption {
  id: FinishId;
  name: string;
  subtitle: string;
  swatchColor: string;
  previewImage: string;
  materialConfig: {
    color: string;
    transmission: number;
    roughness: number;
    metalness: number;
    ior: number;
    thickness: number;
    attenuationColor: string;
    attenuationDistance: number;
  };
}
