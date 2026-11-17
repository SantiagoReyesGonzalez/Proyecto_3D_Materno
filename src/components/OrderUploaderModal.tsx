import React, { useEffect, useId, useRef, useState } from 'react';
import { z } from 'zod';
import { Check, Upload, X } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import {
  EDITION_PORTRAIT_IMAGES,
  FINISH_OPTIONS,
  PRODUCT_TIERS,
  formatCOP,
} from '../data/products';
import { FINISH_PRESETS } from '../data/finishes';
import { ProductTierId } from '../types/product';

const orderFormSchema = z.object({
  motherName: z.string().min(2, 'Ingresa tu nombre'),
  babyName: z.string().min(1, 'Ingresa el nombre del bebé'),
  weeks: z.number().min(12, 'Mínimo 12 semanas').max(41, 'Máximo 41 semanas'),
  phone: z.string().min(7, 'Ingresa tu WhatsApp'),
  city: z.string().min(2, 'Ingresa la ciudad'),
});

type WizardStep = 1 | 2 | 3 | 4;

const WIZARD_STEPS: { id: WizardStep; code: string; label: string; mobileLabel: string }[] = [
  { id: 1, code: '01', label: 'Edición', mobileLabel: 'Edición' },
  { id: 2, code: '02', label: 'Ecografía 3D', mobileLabel: 'Eco 3D' },
  { id: 3, code: '03', label: 'Tus Datos', mobileLabel: 'Datos' },
  { id: 4, code: '04', label: 'Pago y Resumen', mobileLabel: 'Pago' },
];

const TIER_CONCISE_TAGLINE: Record<ProductTierId, string> = {
  1: 'Alabastro sin luz LED',
  2: 'Travertino · LED 2700K',
  3: 'Silueta a medida + LED',
};

interface OrderWizardContentProps {
  step: WizardStep;
  setStep: React.Dispatch<React.SetStateAction<WizardStep>>;
  formErrors: Record<string, string>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onClose: () => void;
}

const OrderWizardContent: React.FC<OrderWizardContentProps> = ({
  step,
  setStep,
  formErrors,
  setFormErrors,
  onClose,
}) => {
  const {
    selectedTier,
    setTier,
    tier3Modality,
    setTier3Modality,
    activeFinish,
    setFinish,
    paymentModality,
    setPaymentModality,
    vacaParticipants,
    setVacaParticipants,
    uploadedFetusFile,
    setUploadedFetusFile,
    uploadedMotherPhotos,
    setUploadedMotherPhotos,
    customerData,
    updateCustomerData,
    getEffectivePrice,
  } = useProductStore();

  const [copiedVaca, setCopiedVaca] = useState(false);
  const [fetusPreviewUrl, setFetusPreviewUrl] = useState<string | null>(null);
  const fetusInputRef = useRef<HTMLInputElement>(null);
  const motherInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!uploadedFetusFile || !uploadedFetusFile.type.startsWith('image/')) {
      setFetusPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(uploadedFetusFile);
    setFetusPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [uploadedFetusFile]);

  const currentTier = PRODUCT_TIERS.find((t) => t.id === selectedTier) || PRODUCT_TIERS[1];
  const currentFinish = FINISH_OPTIONS.find((f) => f.id === activeFinish) || FINISH_OPTIONS[0];
  const totalPrice = getEffectivePrice();
  const halfPrice = Math.round(totalPrice / 2);
  const installment3 = Math.round(totalPrice / 3);
  const vacaPerPerson = Math.round(totalPrice / vacaParticipants);

  const suggestedPlaque = customerData.babyName.trim()
    ? `${customerData.babyName.trim()} · Semana ${customerData.weeks}`
    : 'Emiliano · Semana 28';
  const livePlaqueText = customerData.plaqueText.trim() || suggestedPlaque;

  const clearFieldError = (field: string) => {
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleContinueFromStep3 = () => {
    const result = orderFormSchema.safeParse({
      motherName: customerData.motherName,
      babyName: customerData.babyName,
      weeks: Number(customerData.weeks),
      phone: customerData.phone,
      city: customerData.city,
    });

    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
      setFormErrors(errs);
      return;
    }

    setFormErrors({});
    setStep(4);
  };

  const buildVacaWhatsAppText = (): string => {
    const babyLabel = customerData.babyName.trim() || 'el bebé';
    const momLabel = customerData.motherName.trim() || 'la futura mamá';
    return (
      `Hola, queremos regalarle a ${momLabel} y ${babyLabel} la escultura Maternidad 3D (${currentTier.name}). ` +
      `Valor: ${formatCOP(totalPrice)} COP · Entre ${vacaParticipants} personas: ${formatCOP(vacaPerPerson)} COP c/u.`
    );
  };

  const buildOrderWhatsAppUrl = (): string => {
    const modalityLabel =
      paymentModality === 'split_50_50'
        ? `Reserva 50/50 (${formatCOP(halfPrice)} COP hoy)`
        : paymentModality === 'addi_3_cuotas'
          ? `3 cuotas sin interés (${formatCOP(installment3)} COP)`
          : `Regalo grupal Baby Shower (${vacaParticipants} × ${formatCOP(vacaPerPerson)} COP)`;

    const tierDetail =
      selectedTier === 3
        ? tier3Modality === 'presencial_scan'
          ? `${currentTier.name} (Escaneo presencial Bogotá)`
          : `${currentTier.name} (Guía fotográfica)`
        : currentTier.name;

    const attachmentsLine = [
      uploadedFetusFile
        ? `Ecografía 3D (${uploadedFetusFile.name})`
        : 'Ecografía 3D (por enviar en este chat)',
      selectedTier === 3 && tier3Modality === 'photo_guide'
        ? uploadedMotherPhotos.length > 0
          ? `${uploadedMotherPhotos.length} foto(s) de la madre adjunta(s)`
          : 'Fotos de la madre (por enviar)'
        : null,
    ]
      .filter(Boolean)
      .join(' + ');

    const finalPlaque =
      customerData.plaqueText.trim() ||
      (selectedTier === 3 ? livePlaqueText : '');

    const plaqueLine = finalPlaque ? `• Placa grabada: ${finalPlaque}\n` : '';

    const message =
      `Hola Atelier Maternidad 3D, deseo reservar mi obra:\n\n` +
      `• Edición: ${tierDetail}\n` +
      `• Valor: ${formatCOP(totalPrice)} COP\n` +
      `• Acabado: ${currentFinish.name}\n` +
      `• Modalidad: ${modalityLabel}\n` +
      `• Entrega estimada: ${currentTier.deliveryDays} hábiles\n` +
      plaqueLine +
      `• Archivos: ${attachmentsLine}\n` +
      `• Nombre: ${customerData.motherName}\n` +
      `• Bebé: ${customerData.babyName} (Semana ${customerData.weeks})\n` +
      `• WhatsApp: ${customerData.phone}\n` +
      `• Ciudad: ${customerData.city}`;

    return `https://wa.me/573000000000?text=${encodeURIComponent(message)}`;
  };

  const handleCopyVacaText = async () => {
    try {
      await navigator.clipboard.writeText(buildVacaWhatsAppText());
      setCopiedVaca(true);
      setTimeout(() => setCopiedVaca(false), 2500);
    } catch {
      setCopiedVaca(false);
    }
  };

  const handleSubmitOrder = () => {
    const result = orderFormSchema.safeParse({
      motherName: customerData.motherName,
      babyName: customerData.babyName,
      weeks: Number(customerData.weeks),
      phone: customerData.phone,
      city: customerData.city,
    });

    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
      setFormErrors(errs);
      setStep(3);
      return;
    }

    setFormErrors({});
    window.open(buildOrderWhatsAppUrl(), '_blank', 'noopener,noreferrer');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      handleContinueFromStep3();
    } else {
      handleSubmitOrder();
    }
  };

  return (
    <div className="bg-[#FAF7F2] border border-[#E5DEC9] shadow-2xl relative flex flex-col">
      {/* Sticky Wizard Top Bar: Title + Close + 4-Step Interactive Progress */}
      <div className="px-5 pt-5 pb-4 sm:px-8 sm:pt-6 sm:pb-5 border-b border-[#E5DEC9] bg-[#FAF7F2]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow block">Atelier Bogotá · Encargo Guiado</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#2C2825] mt-0.5">
              Reserva tu <em className="italic text-[#8C6D46]">escultura.</em>
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="w-9 h-9 shrink-0 border border-[#E5DEC9] hover:border-[#2C2825] flex items-center justify-center text-[#2C2825] transition-colors bg-[#FAF7F2]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4-Step Connected Progress Indicator */}
        <nav aria-label="Pasos de reserva" className="mt-5 grid grid-cols-4 gap-1.5 sm:gap-3">
          {WIZARD_STEPS.map((item) => {
            const isActive = item.id === step;
            const isDone = item.id < step;
            const canJumpBack = item.id < step;

            return (
              <button
                key={item.id}
                type="button"
                disabled={!canJumpBack}
                onClick={() => {
                  if (canJumpBack) setStep(item.id);
                }}
                aria-current={isActive ? 'step' : undefined}
                className={`text-left space-y-1.5 group transition-opacity ${
                  canJumpBack ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`h-1 w-full transition-colors duration-300 ${
                    isActive
                      ? 'bg-[#2C2825]'
                      : isDone
                        ? 'bg-[#8C6D46]'
                        : 'bg-[#E5DEC9]'
                  }`}
                />
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.16em]">
                  <span
                    className={`font-medium ${
                      isActive
                        ? 'text-[#2C2825]'
                        : isDone
                          ? 'text-[#755936]'
                          : 'text-[#8C8378]'
                    }`}
                  >
                    {isDone ? '✓' : item.code}
                  </span>
                  <span
                    className={`truncate ${
                      isActive
                        ? 'text-[#2C2825] font-medium'
                        : isDone
                          ? 'text-[#755936]'
                          : 'text-[#8C8378]'
                    }`}
                  >
                    <span className="sm:hidden">{item.mobileLabel}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <form onSubmit={handleFormSubmit} className="p-5 sm:p-8 space-y-6">
        {/* ================================================================= */}
        {/* STEP 1: VISUAL EDITION SELECTOR (WITH PHOTOS) & RESIN FINISH      */}
        {/* ================================================================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="eyebrow block">Elige tu edición</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {PRODUCT_TIERS.map((tier) => {
                  const isActive = selectedTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setTier(tier.id as ProductTierId)}
                      className={`group text-left border transition-all overflow-hidden flex sm:flex-col relative ${
                        isActive
                          ? 'border-2 border-[#8C6D46] bg-[#FFFFFF] shadow-sm'
                          : 'border-[#E5DEC9] bg-[#F2ECE1]/45 hover:border-[#8C6D46]/60'
                      }`}
                    >
                      {tier.id === 2 && (
                        <span className="absolute top-2 left-2 z-10 bg-[#2C2825] text-[#FAF7F2] px-2 py-0.5 text-[9px] uppercase tracking-[0.16em]">
                          ★ Más Elegida
                        </span>
                      )}

                      {isActive && (
                        <span className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-[#8C6D46] text-[#FAF7F2] flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        </span>
                      )}

                      <div className="w-28 sm:w-full aspect-[4/4] sm:aspect-[4/3] shrink-0 bg-[#E5DEC9]/40 overflow-hidden">
                        <img
                          src={EDITION_PORTRAIT_IMAGES[tier.id]}
                          alt={tier.name}
                          decoding="async"
                          width={480}
                          height={360}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      </div>

                      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-center sm:justify-between space-y-1">
                        <div>
                          <span className="font-serif text-lg sm:text-xl text-[#2C2825] block leading-snug">
                            {tier.name}
                          </span>
                          <span className="text-[11px] text-[#6E665E] font-light block mt-0.5">
                            {TIER_CONCISE_TAGLINE[tier.id]}
                          </span>
                        </div>
                        <span className="font-serif italic text-lg text-[#8C6D46] block pt-1">
                          {tier.id === 3 ? 'Desde ' : ''}
                          {formatCOP(tier.officialPrice)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedTier === 3 && (
              <div className="p-3.5 bg-[#F2ECE1] border border-[#E5DEC9] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#2C2825]">Modalidad de silueta materna:</span>
                <div className="inline-flex border border-[#E5DEC9] bg-[#FAF7F2] text-xs">
                  <button
                    type="button"
                    onClick={() => setTier3Modality('photo_guide')}
                    className={`px-3 py-1.5 ${
                      tier3Modality === 'photo_guide'
                        ? 'bg-[#2C2825] text-[#FAF7F2]'
                        : 'text-[#6E665E]'
                    }`}
                  >
                    Fotos guía ($690.000)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTier3Modality('presencial_scan')}
                    className={`px-3 py-1.5 ${
                      tier3Modality === 'presencial_scan'
                        ? 'bg-[#2C2825] text-[#FAF7F2]'
                        : 'text-[#6E665E]'
                    }`}
                  >
                    Escaneo Bogotá ($780.000)
                  </button>
                </div>
              </div>
            )}

            {/* Resin Finish Selector with Real Gradient Spheres */}
            <div className="space-y-3">
              <span className="eyebrow block">Elige el acabado en resina</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {FINISH_OPTIONS.map((finish) => {
                  const preset = FINISH_PRESETS[finish.id];
                  const isActive = activeFinish === finish.id;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setFinish(finish.id)}
                      className={`p-3 border text-left flex items-center gap-3 transition-colors ${
                        isActive
                          ? 'bg-[#F2ECE1] border-[#8C6D46]'
                          : 'bg-[#FAF7F2] border-[#E5DEC9] hover:border-[#8C6D46]/60'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full shrink-0 shadow-inner"
                        style={{
                          background: preset.swatchGradient,
                          border: `1px solid ${preset.swatchBorder}`,
                        }}
                      />
                      <div className="min-w-0">
                        <span className="font-serif text-base text-[#2C2825] block leading-tight">
                          {finish.name}
                        </span>
                        <span className="text-[11px] text-[#6E665E] font-light block truncate">
                          {finish.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 1 Footer */}
            <div className="pt-4 border-t border-[#E5DEC9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-xs text-[#6E665E]">
                Reserva hoy con 50%:{' '}
                <strong className="font-serif italic text-lg text-[#8C6D46] font-normal ml-1">
                  {formatCOP(halfPrice)} COP
                </strong>
              </div>

              <button
                type="submit"
                className="px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#FAF7F2] bg-[#2C2825] hover:bg-[#8C6D46] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Continuar a Ecografía 3D</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 2: 3D ULTRASOUND UPLOAD WITH VISUAL GUIDE & PREVIEW          */}
        {/* ================================================================= */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Compact Visual Guide Card */}
            <div className="p-3.5 bg-[#F2ECE1] border border-[#E5DEC9] flex items-center gap-4">
              <div className="w-16 h-14 shrink-0 border border-[#E5DEC9] overflow-hidden bg-[#181310]">
                <img
                  src={`${import.meta.env.BASE_URL}images/editorial/proceso_2_ecografia_3d.jpg`}
                  alt="Ejemplo válido de ecografía 3D/4D"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs space-y-1">
                <span className="block font-medium text-[#2C2825]">
                  ✓ Ecografía 3D/4D con relieve (Sí sirve)
                </span>
                <span className="block text-[#6E665E] font-light">
                  ✕ Ecografía 2D plana en blanco y negro (No sirve)
                </span>
              </div>
            </div>

            {/* Interactive Dropzone with Live Preview */}
            <div
              onClick={() => fetusInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  setUploadedFetusFile(e.dataTransfer.files[0]);
                }
              }}
              className="border border-dashed border-[#8C6D46]/65 bg-[#F2ECE1]/45 hover:bg-[#F2ECE1]/80 p-6 sm:p-8 text-center cursor-pointer transition-colors"
            >
              <input
                ref={fetusInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.dcm,.zip"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setUploadedFetusFile(e.target.files[0]);
                }}
              />

              {uploadedFetusFile ? (
                <div className="flex flex-col items-center gap-3">
                  {fetusPreviewUrl && (
                    <div className="w-28 h-24 border border-[#8C6D46]/50 overflow-hidden bg-[#181310]">
                      <img
                        src={fetusPreviewUrl}
                        alt="Vista previa de ecografía 3D adjuntada"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="font-serif italic text-xl text-[#2C2825]">
                    ✓ {uploadedFetusFile.name}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fetusInputRef.current?.click();
                    }}
                    className="text-[11px] uppercase tracking-[0.16em] text-[#755936] underline"
                  >
                    Cambiar archivo
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2.5">
                  <Upload className="w-5 h-5 text-[#8C6D46]" aria-hidden="true" />
                  <p className="font-serif italic text-xl text-[#2C2825]">
                    Arrastra o selecciona tu ecografía 3D/4D
                  </p>
                  <span className="text-xs text-[#6E665E] font-light">
                    También puedes enviarla directo por WhatsApp al finalizar.
                  </span>
                </div>
              )}
            </div>

            {/* Conditional Mother Reference Photos (only Tier 3 + Photo Guide) */}
            {selectedTier === 3 && tier3Modality === 'photo_guide' && (
              <div className="p-4 border border-dashed border-[#8C6D46]/60 bg-[#FAF7F2] flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 shrink-0 border border-[#E5DEC9] overflow-hidden bg-[#F2ECE1]">
                  <img
                    src={`${import.meta.env.BASE_URL}images/editorial/proceso_3_fotos_mama.jpg`}
                    alt="Referencia de perfil materno"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="eyebrow block">Fotos de la mamá (Edición III)</span>
                  <p className="text-xs text-[#6E665E] mt-1">
                    {uploadedMotherPhotos.length > 0
                      ? `✓ ${uploadedMotherPhotos.length} foto(s) adjunta(s)`
                      : 'Adjunta 2 a 4 fotos de perfil en luz natural.'}
                  </p>
                </div>
                <input
                  ref={motherInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      setUploadedMotherPhotos(Array.from(e.target.files));
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => motherInputRef.current?.click()}
                  className="px-4 py-2 text-[10px] uppercase tracking-[0.16em] border border-[#8C6D46] text-[#2C2825] hover:bg-[#2C2825] hover:text-[#FAF7F2] transition-colors shrink-0"
                >
                  {uploadedMotherPhotos.length > 0 ? 'Cambiar' : 'Seleccionar'}
                </button>
              </div>
            )}

            {/* Step 2 Footer */}
            <div className="pt-4 border-t border-[#E5DEC9] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-[#6E665E] hover:text-[#2C2825] transition-colors"
              >
                ← Atrás
              </button>

              <button
                type="submit"
                className="px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#FAF7F2] bg-[#2C2825] hover:bg-[#8C6D46] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Continuar a Datos</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 3: CUSTOMER DETAILS & LIVE BRASS PLAQUE PREVIEW              */}
        {/* ================================================================= */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="wizard-mother-name" className="eyebrow block mb-1.5">
                  Tu Nombre
                </label>
                <input
                  id="wizard-mother-name"
                  type="text"
                  placeholder="Valentina Gómez"
                  value={customerData.motherName}
                  onChange={(e) => {
                    updateCustomerData({ motherName: e.target.value });
                    clearFieldError('motherName');
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DEC9] text-sm text-[#2C2825] focus:outline-none focus:border-[#8C6D46]"
                />
                {formErrors.motherName && (
                  <span className="text-[11px] text-[#8C6D46] mt-1 block">
                    {formErrors.motherName}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="wizard-baby-name" className="eyebrow block mb-1.5">
                  Nombre del Bebé
                </label>
                <input
                  id="wizard-baby-name"
                  type="text"
                  placeholder="Emiliano"
                  value={customerData.babyName}
                  onChange={(e) => {
                    updateCustomerData({ babyName: e.target.value });
                    clearFieldError('babyName');
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DEC9] text-sm text-[#2C2825] focus:outline-none focus:border-[#8C6D46]"
                />
                {formErrors.babyName && (
                  <span className="text-[11px] text-[#8C6D46] mt-1 block">
                    {formErrors.babyName}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="wizard-weeks" className="eyebrow block mb-1.5">
                  Semana de Gestación
                </label>
                <input
                  id="wizard-weeks"
                  type="number"
                  min={12}
                  max={41}
                  value={customerData.weeks}
                  onChange={(e) => {
                    updateCustomerData({ weeks: Number(e.target.value) || 28 });
                    clearFieldError('weeks');
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DEC9] text-sm text-[#2C2825] focus:outline-none focus:border-[#8C6D46]"
                />
                {formErrors.weeks && (
                  <span className="text-[11px] text-[#8C6D46] mt-1 block">
                    {formErrors.weeks}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="wizard-phone" className="eyebrow block mb-1.5">
                  WhatsApp
                </label>
                <input
                  id="wizard-phone"
                  type="tel"
                  placeholder="310 456 7890"
                  value={customerData.phone}
                  onChange={(e) => {
                    updateCustomerData({ phone: e.target.value });
                    clearFieldError('phone');
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DEC9] text-sm text-[#2C2825] focus:outline-none focus:border-[#8C6D46]"
                />
                {formErrors.phone && (
                  <span className="text-[11px] text-[#8C6D46] mt-1 block">
                    {formErrors.phone}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="wizard-city" className="eyebrow block mb-1.5">
                  Ciudad de Entrega
                </label>
                <input
                  id="wizard-city"
                  type="text"
                  placeholder="Bogotá D.C."
                  value={customerData.city}
                  onChange={(e) => {
                    updateCustomerData({ city: e.target.value });
                    clearFieldError('city');
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DEC9] text-sm text-[#2C2825] focus:outline-none focus:border-[#8C6D46]"
                />
                {formErrors.city && (
                  <span className="text-[11px] text-[#8C6D46] mt-1 block">
                    {formErrors.city}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="wizard-plaque-text" className="eyebrow block mb-1.5">
                  Texto en Placa de Latón (Opcional)
                </label>
                <input
                  id="wizard-plaque-text"
                  type="text"
                  maxLength={36}
                  placeholder={suggestedPlaque}
                  value={customerData.plaqueText}
                  onChange={(e) => updateCustomerData({ plaqueText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5DEC9] text-sm text-[#2C2825] focus:outline-none focus:border-[#8C6D46]"
                />
              </div>
            </div>

            {/* Live Brushed Brass Plaque Preview */}
            <div className="p-4 bg-[#181411] border border-[#3D352E] flex flex-col items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4B07B]">
                Vista previa en placa de latón
              </span>
              <div className="px-6 py-1.5 bg-gradient-to-r from-[#E5C996] via-[#C8A164] to-[#A67D42] border border-[#F5DFB6]/70 shadow-md">
                <span className="font-serif italic text-base sm:text-lg tracking-[0.14em] text-[#231C14]">
                  {livePlaqueText}
                </span>
              </div>
            </div>

            {/* Step 3 Footer */}
            <div className="pt-4 border-t border-[#E5DEC9] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-[#6E665E] hover:text-[#2C2825] transition-colors"
              >
                ← Atrás
              </button>

              <button
                type="submit"
                className="px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#FAF7F2] bg-[#2C2825] hover:bg-[#8C6D46] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Continuar al Pago</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 4: VISUAL WORK SUMMARY CARD + PAYMENT MODALITY               */}
        {/* ================================================================= */}
        {step === 4 && (
          <div className="space-y-5">
            {/* Chosen Piece Summary Card with Real Thumbnail */}
            <div className="p-4 bg-[#F2ECE1] border border-[#E5DEC9] flex items-center gap-4">
              <div className="w-16 h-20 sm:w-20 sm:h-24 shrink-0 border border-[#E5DEC9] overflow-hidden bg-[#FAF7F2]">
                <img
                  src={EDITION_PORTRAIT_IMAGES[selectedTier]}
                  alt={currentTier.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-serif text-xl sm:text-2xl text-[#2C2825] leading-tight">
                    {currentTier.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[10px] uppercase tracking-[0.16em] text-[#755936] underline shrink-0"
                  >
                    Editar
                  </button>
                </div>
                <span className="block text-xs text-[#6E665E]">
                  {currentFinish.name} · Entrega en {currentTier.deliveryDays} hábiles
                </span>
                <span className="block text-xs text-[#2C2825] font-medium truncate">
                  {customerData.babyName} · Sem. {customerData.weeks}
                  {uploadedFetusFile ? ` · ${uploadedFetusFile.name}` : ''}
                </span>
              </div>
            </div>

            {/* 3 Interactive Payment Modalities */}
            <div className="space-y-2.5">
              <span className="eyebrow block">Elige tu modalidad de pago</span>

              <div
                onClick={() => setPaymentModality('split_50_50')}
                className={`p-3.5 sm:p-4 border cursor-pointer transition-colors flex justify-between items-baseline gap-2 ${
                  paymentModality === 'split_50_50'
                    ? 'bg-[#FFFFFF] border-[#8C6D46]'
                    : 'bg-[#F2ECE1]/45 border-[#E5DEC9]'
                }`}
              >
                <span className="font-serif text-lg sm:text-xl text-[#2C2825]">
                  Reserva 50% / 50%
                </span>
                <span className="font-serif italic text-base sm:text-lg text-[#8C6D46] whitespace-nowrap">
                  {formatCOP(halfPrice)} hoy
                </span>
              </div>

              <div
                onClick={() => setPaymentModality('addi_3_cuotas')}
                className={`p-3.5 sm:p-4 border cursor-pointer transition-colors flex justify-between items-baseline gap-2 ${
                  paymentModality === 'addi_3_cuotas'
                    ? 'bg-[#FFFFFF] border-[#8C6D46]'
                    : 'bg-[#F2ECE1]/45 border-[#E5DEC9]'
                }`}
              >
                <span className="font-serif text-lg sm:text-xl text-[#2C2825]">
                  3 Cuotas sin Interés
                </span>
                <span className="font-serif italic text-base sm:text-lg text-[#8C6D46] whitespace-nowrap">
                  3 × {formatCOP(installment3)}
                </span>
              </div>

              <div
                onClick={() => setPaymentModality('vaca_baby_shower')}
                className={`p-3.5 sm:p-4 border cursor-pointer transition-colors ${
                  paymentModality === 'vaca_baby_shower'
                    ? 'bg-[#FFFFFF] border-[#8C6D46]'
                    : 'bg-[#F2ECE1]/45 border-[#E5DEC9]'
                }`}
              >
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-serif text-lg sm:text-xl text-[#2C2825]">
                    Vaca Baby Shower
                  </span>
                  <span className="font-serif italic text-base sm:text-lg text-[#8C6D46] whitespace-nowrap">
                    {formatCOP(vacaPerPerson)} c/u
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1.5">
                    {[4, 6, 8].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => {
                          setPaymentModality('vaca_baby_shower');
                          setVacaParticipants(count);
                        }}
                        className={`px-2.5 py-1 text-[11px] border ${
                          vacaParticipants === count
                            ? 'bg-[#2C2825] text-[#FAF7F2] border-[#2C2825]'
                            : 'bg-[#FAF7F2] text-[#6E665E] border-[#E5DEC9]'
                        }`}
                      >
                        {count} amigos
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyVacaText}
                    className="text-[10px] uppercase tracking-[0.15em] text-[#755936] underline whitespace-nowrap"
                  >
                    {copiedVaca ? '✓ Copiada' : 'Copiar invitación →'}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4 Total & WhatsApp Confirmation Footer */}
            <div className="pt-4 border-t border-[#E5DEC9] space-y-4">
              <div className="flex justify-between items-baseline gap-2">
                <span className="eyebrow">Total de la obra</span>
                <span className="font-serif text-2xl sm:text-3xl text-[#2C2825] whitespace-nowrap">
                  {formatCOP(totalPrice)} COP
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-3.5 text-[11px] uppercase tracking-[0.18em] text-[#6E665E] hover:text-[#2C2825] transition-colors shrink-0"
                >
                  ← Atrás
                </button>

                <button
                  type="submit"
                  className="flex-1 py-4 px-5 text-[11px] uppercase tracking-[0.2em] text-[#FAF7F2] bg-[#2C2825] hover:bg-[#8C6D46] transition-colors text-center"
                >
                  Confirmar Reserva en WhatsApp →
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export const OrderUploaderModal: React.FC = () => {
  const { isOrderModalOpen, closeOrderModal } = useProductStore();
  const [step, setStep] = useState<WizardStep>(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOrderModalOpen) {
      setStep(1);
      setFormErrors({});
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (!isOrderModalOpen && dialog.open) {
      dialog.close();
    }
  }, [isOrderModalOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = '';
      closeOrderModal();
    };
    dialog.addEventListener('close', handleClose);

    let cleanupPointer: (() => void) | undefined;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const outside = (e: PointerEvent, el: HTMLDialogElement) => {
        const r = el.getBoundingClientRect();
        return (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        );
      };
      let pressedOutside = false;
      const onDown = (e: PointerEvent) => {
        pressedOutside = outside(e, dialog);
      };
      const onUp = (e: PointerEvent) => {
        if (pressedOutside && outside(e, dialog)) dialog.close();
      };
      dialog.addEventListener('pointerdown', onDown);
      dialog.addEventListener('pointerup', onUp);
      cleanupPointer = () => {
        dialog.removeEventListener('pointerdown', onDown);
        dialog.removeEventListener('pointerup', onUp);
      };
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
      cleanupPointer?.();
    };
  }, [closeOrderModal]);

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby={titleId}
      className="w-[calc(100%-1.5rem)] sm:w-full max-w-3xl bg-transparent p-0 m-auto backdrop:bg-[#120E0C]/75 backdrop:backdrop-blur-sm open:block"
    >
      <h2 id={titleId} className="sr-only">
        Reserva de Obra Maternidad 3D
      </h2>
      <div className="max-h-[90dvh] overflow-y-auto">
        <OrderWizardContent
          step={step}
          setStep={setStep}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          onClose={closeOrderModal}
        />
      </div>
    </dialog>
  );
};
