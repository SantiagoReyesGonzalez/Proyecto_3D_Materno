import { FinishOption, ProductTier } from '../types/product';

export const PRODUCT_TIERS: ProductTier[] = [
  {
    id: 1,
    slug: 'esencia-gestacional',
    name: 'I. Esencia Gestacional',
    subtitle: 'Edición Esencial · Sin luz LED',
    badge: 'Edición Esencial',
    officialPrice: 249000,
    promoPrice: 249000,
    installmentsCount: 3,
    installmentAmount: 83000,
    vacaSuggestedPeople: 5,
    vacaPerPersonAmount: 49800,
    includesLedBase: false,
    customMotherTorso: false,
    deliveryDays: '3 a 5 días',
    shortDescription:
      'Silueta materna en alabastro translúcido con la anatomía real de tu bebé desde su ecografía 3D, sobre base natural.',
    audienceTag: 'Hecho a mano en Bogotá',
    features: [],
    specs: {
      torso: 'Resina traslúcida',
      baby: 'Bebé 100% personalizado',
      lighting: 'Base plana sin luz',
      packaging: 'Estuche de lino',
    },
  },
  {
    id: 2,
    slug: 'luz-de-vida',
    name: 'II. Luz de Vida',
    subtitle: 'Edición Insignia · Luz LED 2700K',
    badge: 'Edición Insignia',
    isBestSeller: true,
    officialPrice: 369000,
    promoPrice: 369000,
    installmentsCount: 3,
    installmentAmount: 123000,
    vacaSuggestedPeople: 6,
    vacaPerPersonAmount: 61500,
    includesLedBase: true,
    customMotherTorso: false,
    deliveryDays: '3 a 5 días',
    shortDescription:
      'Incluye pedestal en travertino con luz cálida de 2700K que ilumina suavemente el vientre materno durante la noche.',
    audienceTag: 'Favorito para Baby Shower',
    features: [],
    specs: {
      torso: 'Resina óptica pulida',
      baby: 'Bebé 100% personalizado',
      lighting: 'Pedestal LED cálido 2700K',
      packaging: 'Estuche conmemorativo',
    },
  },
  {
    id: 3,
    slug: 'maternidad-total',
    name: 'III. Maternidad Total',
    subtitle: 'Edición de Autor · Silueta Real',
    badge: 'Alta Medida',
    isAuthorEdition: true,
    officialPrice: 690000,
    promoPrice: 690000,
    scanPrice: 780000,
    installmentsCount: 3,
    installmentAmount: 230000,
    vacaSuggestedPeople: 6,
    vacaPerPersonAmount: 115000,
    includesLedBase: true,
    customMotherTorso: true,
    deliveryDays: '7 a 10 días',
    shortDescription:
      'Escultura a medida de la madre y su bebé (fotos guía $690.000 o escaneo Bogotá $780.000), con placa grabada.',
    audienceTag: 'Obra de autor personalizada',
    features: [],
    specs: {
      torso: 'Silueta real de la madre',
      baby: 'Bebé 100% personalizado',
      lighting: 'Pedestal LED + Placa grabada',
      packaging: 'Cofre rígido de colección',
    },
  },
];

export const FINISH_OPTIONS: FinishOption[] = [
  {
    id: 'porcelain_silk',
    name: 'Porcelana Marfil',
    subtitle: 'Satinado alabastro clásico',
    swatchColor: '#F3ECE1',
    previewImage: `${import.meta.env.BASE_URL}images/editorial/edition_1_esencia.jpg`,
    materialConfig: {
      color: '#FBF8F3',
      transmission: 0.78,
      roughness: 0.22,
      metalness: 0.0,
      ior: 1.45,
      thickness: 1.2,
      attenuationColor: '#FFB35C',
      attenuationDistance: 2.2,
    },
  },
  {
    id: 'champagne_quartz',
    name: 'Cuarzo Champán',
    subtitle: 'Difusión cálida perlada',
    swatchColor: '#E6D3B8',
    previewImage: `${import.meta.env.BASE_URL}images/editorial/edition_2_luz_de_vida.jpg`,
    materialConfig: {
      color: '#F6EFE4',
      transmission: 0.84,
      roughness: 0.18,
      metalness: 0.0,
      ior: 1.46,
      thickness: 1.3,
      attenuationColor: '#FFA647',
      attenuationDistance: 2.4,
    },
  },
  {
    id: 'honey_amber',
    name: 'Ámbar Dorado',
    subtitle: 'Resplandor miel envolvente',
    swatchColor: '#D9A76A',
    previewImage: `${import.meta.env.BASE_URL}images/editorial/edition_3_maternidad_total.jpg`,
    materialConfig: {
      color: '#F4E8D6',
      transmission: 0.86,
      roughness: 0.16,
      metalness: 0.05,
      ior: 1.48,
      thickness: 1.1,
      attenuationColor: '#FF9A36',
      attenuationDistance: 1.8,
    },
  },
];

export const EDITION_PORTRAIT_IMAGES: Record<1 | 2 | 3, string> = {
  1: `${import.meta.env.BASE_URL}images/editorial/edition_1_esencia.jpg`,
  2: `${import.meta.env.BASE_URL}images/editorial/edition_2_luz_de_vida.jpg`,
  3: `${import.meta.env.BASE_URL}images/editorial/edition_3_maternidad_total.jpg`,
};

export const formatCOP = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
};
