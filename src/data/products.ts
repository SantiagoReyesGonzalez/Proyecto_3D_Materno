import { FinishOption, ProductTier } from '../types/product';

export const PRODUCT_TIERS: ProductTier[] = [
  {
    id: 1,
    slug: 'esencia-gestacional',
    name: 'I. Esencia Gestacional',
    subtitle: 'Lanzamiento $220.000 COP',
    badge: 'Edición Esencial',
    officialPrice: 249000,
    promoPrice: 220000,
    installmentsCount: 3,
    installmentAmount: 83000,
    vacaSuggestedPeople: 5,
    vacaPerPersonAmount: 49800,
    includesLedBase: false,
    customMotherTorso: false,
    deliveryDays: '3 a 5 días',
    shortDescription:
      'Silueta materna translúcida con la anatomía real de tu bebé esculpida desde su ecografía 3D sobre base artesanal.',
    audienceTag: 'Hecho a mano en Bogotá',
    features: [],
    specs: {
      torso: 'Resina traslúcida',
      baby: 'Bebé 100% personalizado',
      lighting: 'Base plana artesanal',
      packaging: 'Estuche de lino',
    },
  },
  {
    id: 2,
    slug: 'luz-de-vida',
    name: 'II. Luz de Vida',
    subtitle: 'Edición Insignia · Lanzamiento $350.000 COP',
    badge: 'Edición Insignia',
    isBestSeller: true,
    officialPrice: 369000,
    promoPrice: 350000,
    installmentsCount: 3,
    installmentAmount: 123000,
    vacaSuggestedPeople: 6,
    vacaPerPersonAmount: 61500,
    includesLedBase: true,
    customMotherTorso: false,
    deliveryDays: '3 a 5 días',
    shortDescription:
      'Incluye pedestal artesanal con luz LED cálida de 2700K que ilumina suavemente el vientre materno durante la noche.',
    audienceTag: 'Favorito para Baby Shower',
    features: [],
    specs: {
      torso: 'Resina óptica pulida',
      baby: 'Bebé 100% personalizado',
      lighting: 'Pedestal con luz cálida 2700K',
      packaging: 'Estuche conmemorativo',
    },
  },
  {
    id: 3,
    slug: 'maternidad-total',
    name: 'III. Maternidad Total',
    subtitle: 'Escaneo Presencial $780.000 COP',
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
      'Escultura única a medida tanto de la silueta real de la madre como del bebé, con placa grabada.',
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
    id: 'smoked',
    name: 'Cristal Ahumado',
    subtitle: 'Resina óptica traslúcida',
    swatchColor: '#3A3633',
    previewImage: '/images/00_Imagen_Referencia_Principal.png',
    materialConfig: {
      color: '#2a2d34',
      transmission: 0.88,
      roughness: 0.14,
      metalness: 0.02,
      ior: 1.46,
      thickness: 1.2,
      attenuationColor: '#d97706',
      attenuationDistance: 2.2,
    },
  },
  {
    id: 'frosted',
    name: 'Esmerilado Seda',
    subtitle: 'Difusión suave de luz',
    swatchColor: '#CFC8BC',
    previewImage: '/images/01_Prototipo_Resina_Traslucida_Frontal.png',
    materialConfig: {
      color: '#8c857b',
      transmission: 0.84,
      roughness: 0.24,
      metalness: 0.0,
      ior: 1.45,
      thickness: 1.3,
      attenuationColor: '#fef3c7',
      attenuationDistance: 2.5,
    },
  },
  {
    id: 'bronze',
    name: 'Bronce',
    subtitle: 'Pátina clásica de galería',
    swatchColor: '#8C6D46',
    previewImage: '/images/05_Variacion_Bronce_Escultorico_Patinado.png',
    materialConfig: {
      color: '#785124',
      transmission: 0.38,
      roughness: 0.28,
      metalness: 0.45,
      ior: 1.6,
      thickness: 1.0,
      attenuationColor: '#ff9d2e',
      attenuationDistance: 1.5,
    },
  },
];

export const EDITION_PORTRAIT_IMAGES: Record<1 | 2 | 3, string> = {
  1: '/images/editorial/edition_1_esencia.jpg',
  2: '/images/editorial/edition_2_luz_de_vida.jpg',
  3: '/images/editorial/edition_3_maternidad_total.jpg',
};

export const formatCOP = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
};
