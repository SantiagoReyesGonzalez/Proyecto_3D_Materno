import React, { useEffect, useId, useRef, useState } from 'react';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { FINISH_OPTIONS, PRODUCT_TIERS, formatCOP } from '../data/products';
import { FinishId, ProductTierId } from '../types/product';

const orderFormSchema = z.object({
  motherName: z.string().min(2, 'Ingresa tu nombre'),
  babyName: z.string().min(1, 'Ingresa el nombre del bebé'),
  weeks: z.number().min(12).max(41),
  phone: z.string().min(7, 'Ingresa tu WhatsApp'),
  city: z.string().min(2, 'Ingresa la ciudad'),
});

interface OrderFormContentProps {
  isModal?: boolean;
  onClose?: () => void;
}

const OrderFormContent: React.FC<OrderFormContentProps> = ({ isModal, onClose }) => {
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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [copiedVaca, setCopiedVaca] = useState(false);
  const fetusInputRef = useRef<HTMLInputElement>(null);
  const motherInputRef = useRef<HTMLInputElement>(null);

  const currentTier = PRODUCT_TIERS.find((t) => t.id === selectedTier) || PRODUCT_TIERS[1];
  const currentFinish = FINISH_OPTIONS.find((f) => f.id === activeFinish) || FINISH_OPTIONS[0];
  const totalPrice = getEffectivePrice();
  const halfPrice = Math.round(totalPrice / 2);
  const installment3 = Math.round(totalPrice / 3);
  const vacaPerPerson = Math.round(totalPrice / vacaParticipants);

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
      uploadedFetusFile ? `Ecografía 3D (${uploadedFetusFile.name})` : 'Ecografía 3D (por enviar en este chat)',
      selectedTier === 3 && tier3Modality === 'photo_guide'
        ? uploadedMotherPhotos.length > 0
          ? `${uploadedMotherPhotos.length} foto(s) de la madre adjunta(s)`
          : 'Fotos de la madre (por enviar)'
        : null,
    ]
      .filter(Boolean)
      .join(' + ');

    const plaqueLine =
      selectedTier === 3 && customerData.plaqueText.trim()
        ? `• Placa grabada: ${customerData.plaqueText.trim()}\n`
        : '';

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

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
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
    window.open(buildOrderWhatsAppUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#FAF7F2] border border-[#E5DEC9] p-6 sm:p-12 relative">
      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ventana"
          className="absolute top-6 right-6 w-9 h-9 border border-[#E5DEC9] hover:border-[#2C2825] flex items-center justify-center text-[#2C2825] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Minimal Editorial Heading */}
      <div className="max-w-xl mx-auto text-center space-y-2 pb-9 border-b border-[#E5DEC9]">
        <h3 className="font-serif text-3xl sm:text-5xl font-light text-[#2C2825]">
          Reserva tu <em className="italic text-[#8C6D46]">obra.</em>
        </h3>
        <p className="text-sm text-[#6E665E] font-light">
          50% hoy · 50% al aprobar tu render 3D.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Edition, Ultrasound & Customer Inputs */}
        <div className="lg:col-span-7 space-y-7">
          <div>
            <span className="eyebrow block mb-3">01 · Edición</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRODUCT_TIERS.map((tier) => {
                const active = selectedTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setTier(tier.id as ProductTierId)}
                    className={`p-4 text-left border transition-colors ${
                      active
                        ? 'bg-[#F2ECE1] border-[#8C6D46]'
                        : 'bg-[#FAF7F2] border-[#E5DEC9] hover:border-[#8C6D46]/50'
                    }`}
                  >
                    <span className="font-serif text-xl text-[#2C2825] block">
                      {tier.name}
                    </span>
                    <span className="font-serif italic text-base text-[#8C6D46] block mt-0.5">
                      {formatCOP(tier.officialPrice)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedTier === 3 && (
            <div className="p-4 bg-[#F2ECE1] border border-[#E5DEC9] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#2C2825]">Silueta materna:</span>
              <div className="inline-flex border border-[#E5DEC9] bg-[#FAF7F2] text-xs">
                <button
                  type="button"
                  onClick={() => setTier3Modality('photo_guide')}
                  className={`px-3.5 py-1.5 ${
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
                  className={`px-3.5 py-1.5 ${
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

          {/* Drag & Drop Ultrasound (Clean dashed box without footnote) */}
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
              <span className="eyebrow block">02 · Ecografía 3D</span>
              <span className="text-[11px] text-[#755936] font-medium">
                Solo 3D/4D · No 2D
              </span>
            </div>
            <div
              onClick={() => fetusInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  setUploadedFetusFile(e.dataTransfer.files[0]);
                }
              }}
              className="border border-dashed border-[#8C6D46]/60 bg-[#F2ECE1]/50 hover:bg-[#F2ECE1] p-7 text-center cursor-pointer transition-colors"
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
                <p className="font-serif italic text-xl text-[#2C2825]">
                  ✓ {uploadedFetusFile.name}
                </p>
              ) : (
                <p className="font-serif italic text-xl text-[#6E665E]">
                  Arrastra o selecciona tu ecografía 3D/4D
                </p>
              )}
            </div>
          </div>

          {selectedTier === 3 && tier3Modality === 'photo_guide' && (
            <div>
              <span className="eyebrow block mb-3">02B · Fotos de la Mamá (Edición III)</span>
              <div
                onClick={() => motherInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.length) {
                    setUploadedMotherPhotos(Array.from(e.dataTransfer.files));
                  }
                }}
                className="border border-dashed border-[#8C6D46]/60 bg-[#F2ECE1]/40 hover:bg-[#F2ECE1] p-5 text-center cursor-pointer transition-colors"
              >
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
                {uploadedMotherPhotos.length > 0 ? (
                  <p className="font-serif italic text-lg text-[#2C2825]">
                    ✓ {uploadedMotherPhotos.length} foto(s) adjunta(s)
                  </p>
                ) : (
                  <p className="font-serif italic text-lg text-[#6E665E]">
                    Adjunta 2 a 4 fotos de perfil
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Customer Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="eyebrow block mb-2">Tu Nombre</label>
              <input
                type="text"
                placeholder="Valentina Gómez"
                value={customerData.motherName}
                onChange={(e) => updateCustomerData({ motherName: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DEC9] text-sm text-[#2C2825] focus:outline-none focus:border-[#8C6D46]"
              />
              {formErrors.motherName && (
                <span className="text-[11px] text-[#8C6D46] mt-1 block">
                  {formErrors.motherName}
                </span>
              )}
            </div>

            <div>
              <label className="eyebrow block mb-2">Nombre del Bebé</label>
              <input
                type="text"
                placeholder="Emiliano"
                value={customerData.babyName}
                onChange={(e) => updateCustomerData({ babyName: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DEC9] text-sm text-[#2C2825] focus:outline-none focus:border-[#8C6D46]"
              />
              {formErrors.babyName && (
                <span className="text-[11px] text-[#8C6D46] mt-1 block">
                  {formErrors.babyName}
                </span>
              )}
            </div>

            <div>
              <label className="eyebrow block mb-2">Semana de Gestación</label>
              <input
                type="number"
                min={12}
                max={41}
                value={customerData.weeks}
                onChange={(e) => updateCustomerData({ weeks: Number(e.target.value) || 28 })}
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DEC9] text-sm text-[#2C2825] focus:outline-none focus:border-[#8C6D46]"
              />
              {formErrors.weeks && (
                <span className="text-[11px] text-[#8C6D46] mt-1 block">{formErrors.weeks}</span>
              )}
            </div>

            <div>
              <label className="eyebrow block mb-2">Ciudad de Entrega</label>
              <input
                type="text"
                placeholder="Bogotá D.C."
                value={customerData.city}
                onChange={(e) => updateCustomerData({ city: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DEC9] text-sm text-[#2C2825] focus:outline-none focus:border-[#8C6D46]"
              />
              {formErrors.city && (
                <span className="text-[11px] text-[#8C6D46] mt-1 block">{formErrors.city}</span>
              )}
            </div>

            <div>
              <label className="eyebrow block mb-2">WhatsApp</label>
              <input
                type="tel"
                placeholder="310 456 7890"
                value={customerData.phone}
                onChange={(e) => updateCustomerData({ phone: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DEC9] text-sm text-[#2C2825] focus:outline-none focus:border-[#8C6D46]"
              />
              {formErrors.phone && (
                <span className="text-[11px] text-[#8C6D46] mt-1 block">{formErrors.phone}</span>
              )}
            </div>

            <div>
              <label className="eyebrow block mb-2">Acabado en Resina</label>
              <select
                value={activeFinish}
                onChange={(e) => setFinish(e.target.value as FinishId)}
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DEC9] text-sm text-[#2C2825] focus:outline-none focus:border-[#8C6D46]"
              >
                {FINISH_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedTier === 3 && (
              <div className="sm:col-span-2">
                <label className="eyebrow block mb-2">Placa Grabada (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej. Emiliano · Dulce espera 2026"
                  value={customerData.plaqueText}
                  onChange={(e) => updateCustomerData({ plaqueText: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DEC9] text-sm text-[#2C2825] focus:outline-none focus:border-[#8C6D46]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Clean One-Line Payment Cards */}
        <div className="lg:col-span-5 bg-[#F2ECE1] border border-[#E5DEC9] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="eyebrow block">03 · Modalidad de Pago</span>

            <div
              onClick={() => setPaymentModality('split_50_50')}
              className={`p-4 border cursor-pointer transition-colors flex justify-between items-baseline gap-2 ${
                paymentModality === 'split_50_50'
                  ? 'bg-[#FAF7F2] border-[#8C6D46]'
                  : 'bg-[#FAF7F2]/50 border-[#E5DEC9]'
              }`}
            >
              <span className="font-serif text-xl text-[#2C2825]">Reserva 50% / 50%</span>
              <span className="font-serif italic text-lg text-[#8C6D46] whitespace-nowrap">
                {formatCOP(halfPrice)} hoy
              </span>
            </div>

            <div
              onClick={() => setPaymentModality('addi_3_cuotas')}
              className={`p-4 border cursor-pointer transition-colors flex justify-between items-baseline gap-2 ${
                paymentModality === 'addi_3_cuotas'
                  ? 'bg-[#FAF7F2] border-[#8C6D46]'
                  : 'bg-[#FAF7F2]/50 border-[#E5DEC9]'
              }`}
            >
              <span className="font-serif text-xl text-[#2C2825]">3 Cuotas sin Interés</span>
              <span className="font-serif italic text-lg text-[#8C6D46] whitespace-nowrap">
                3 × {formatCOP(installment3)}
              </span>
            </div>

            <div
              onClick={() => setPaymentModality('vaca_baby_shower')}
              className={`p-4 border cursor-pointer transition-colors ${
                paymentModality === 'vaca_baby_shower'
                  ? 'bg-[#FAF7F2] border-[#8C6D46]'
                  : 'bg-[#FAF7F2]/50 border-[#E5DEC9]'
              }`}
            >
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-serif text-xl text-[#2C2825]">Vaca Baby Shower</span>
                <span className="font-serif italic text-lg text-[#8C6D46] whitespace-nowrap">
                  {formatCOP(vacaPerPerson)} c/u
                </span>
              </div>

              <div className="mt-3 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                {[4, 6, 8].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      setPaymentModality('vaca_baby_shower');
                      setVacaParticipants(count);
                    }}
                    className={`flex-1 py-1 text-[11px] border ${
                      vacaParticipants === count
                        ? 'bg-[#2C2825] text-[#FAF7F2] border-[#2C2825]'
                        : 'bg-[#FAF7F2] text-[#6E665E] border-[#E5DEC9]'
                    }`}
                  >
                    {count} amigos
                  </button>
                ))}
              </div>

              <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={handleCopyVacaText}
                  className="text-[11px] uppercase tracking-[0.16em] text-[#755936] underline"
                >
                  {copiedVaca ? '✓ Copiada' : 'Copiar invitación →'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-[#E5DEC9] space-y-4">
            <div className="flex justify-between items-baseline gap-2">
              <span className="eyebrow">Total</span>
              <span className="font-serif text-3xl text-[#2C2825] whitespace-nowrap">
                {formatCOP(totalPrice)} COP
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 text-[11px] uppercase tracking-[0.22em] text-[#FAF7F2] bg-[#2C2825] hover:bg-[#8C6D46] transition-colors"
            >
              Confirmar Reserva →
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const OrderUploaderModal: React.FC = () => {
  const { isOrderModalOpen, closeOrderModal } = useProductStore();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOrderModalOpen && !dialog.open) {
      dialog.showModal();
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
    <>
      <section
        id="pedido-directo"
        className="scroll-mt-20 deferred-section bg-[#FAF7F2] py-20 sm:py-28 border-t border-[#E5DEC9]"
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-10">
          <OrderFormContent />
        </div>
      </section>

      <dialog
        ref={dialogRef}
        closedby="any"
        aria-labelledby={titleId}
        className="w-full max-w-4xl bg-transparent p-0 m-auto backdrop:bg-[#2C2825]/60 open:block"
      >
        <h2 id={titleId} className="sr-only">
          Reserva de Obra Maternidad 3D
        </h2>
        <div className="max-h-[90dvh] overflow-y-auto">
          <OrderFormContent isModal onClose={closeOrderModal} />
        </div>
      </dialog>
    </>
  );
};
