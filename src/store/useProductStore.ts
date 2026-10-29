import { create } from 'zustand';
import { FinishId, PaymentModality, ProductTierId, Tier3Modality } from '../types/product';
import { PRODUCT_TIERS } from '../data/products';

export interface CustomerData {
  motherName: string;
  babyName: string;
  weeks: number;
  phone: string;
  city: string;
  address: string;
  plaqueText: string;
  notes: string;
}

interface ProductState {
  selectedTier: ProductTierId;
  tier3Modality: Tier3Modality;
  usePromoPrice: boolean;
  isLedOn: boolean;
  activeFinish: FinishId;
  paymentModality: PaymentModality;
  vacaParticipants: number;
  isOrderModalOpen: boolean;
  uploadedFetusFile: File | null;
  uploadedMotherPhotos: File[];
  customerData: CustomerData;

  setTier: (tier: ProductTierId) => void;
  setTier3Modality: (modality: Tier3Modality) => void;
  setUsePromoPrice: (usePromo: boolean) => void;
  toggleLed: () => void;
  setLed: (on: boolean) => void;
  setFinish: (finish: FinishId) => void;
  setPaymentModality: (modality: PaymentModality) => void;
  setVacaParticipants: (count: number) => void;
  openOrderModal: (tier?: ProductTierId, paymentModality?: PaymentModality) => void;
  closeOrderModal: () => void;
  setUploadedFetusFile: (file: File | null) => void;
  setUploadedMotherPhotos: (files: File[]) => void;
  updateCustomerData: (patch: Partial<CustomerData>) => void;
  getEffectivePrice: () => number;
}

export const useProductStore = create<ProductState>((set, get) => ({
  selectedTier: 2, // Default Best Seller ("Luz de Vida")
  tier3Modality: 'photo_guide',
  usePromoPrice: false,
  isLedOn: true,
  activeFinish: 'smoked',
  paymentModality: 'split_50_50',
  vacaParticipants: 6,
  isOrderModalOpen: false,
  uploadedFetusFile: null,
  uploadedMotherPhotos: [],
  customerData: {
    motherName: '',
    babyName: '',
    weeks: 28,
    phone: '',
    city: 'Bogotá D.C.',
    address: '',
    plaqueText: '',
    notes: '',
  },

  setTier: (tier) =>
    set((state) => ({
      selectedTier: tier,
      // Auto-turn on LED when selecting Tier 2 or Tier 3 so user sees the magic immediately
      isLedOn: tier >= 2 ? true : state.isLedOn,
    })),

  setTier3Modality: (tier3Modality) => set({ tier3Modality }),

  setUsePromoPrice: (usePromoPrice) => set({ usePromoPrice }),

  toggleLed: () => set((state) => ({ isLedOn: !state.isLedOn })),

  setLed: (isLedOn) => set({ isLedOn }),

  setFinish: (activeFinish) => set({ activeFinish }),

  setPaymentModality: (paymentModality) => set({ paymentModality }),

  setVacaParticipants: (vacaParticipants) => set({ vacaParticipants }),

  openOrderModal: (tier, paymentModality) =>
    set((state) => ({
      selectedTier: tier ?? state.selectedTier,
      paymentModality: paymentModality ?? state.paymentModality,
      isOrderModalOpen: true,
    })),

  closeOrderModal: () => set({ isOrderModalOpen: false }),

  setUploadedFetusFile: (uploadedFetusFile) => set({ uploadedFetusFile }),

  setUploadedMotherPhotos: (uploadedMotherPhotos) => set({ uploadedMotherPhotos }),

  updateCustomerData: (patch) =>
    set((state) => ({
      customerData: { ...state.customerData, ...patch },
    })),

  getEffectivePrice: () => {
    const state = get();
    const tierObj = PRODUCT_TIERS.find((t) => t.id === state.selectedTier) || PRODUCT_TIERS[1];
    if (state.selectedTier === 3) {
      return state.tier3Modality === 'presencial_scan'
        ? tierObj.scanPrice || 780000
        : tierObj.officialPrice;
    }
    return state.usePromoPrice ? tierObj.promoPrice : tierObj.officialPrice;
  },
}));
