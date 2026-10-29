import React, { useEffect, useId, useRef, useState } from 'react';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { FINISH_OPTIONS, PRODUCT_TIERS, formatCOP } from '../data/products';
import { ProductTierId } from '../types/product';

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
    customerData,
    updateCustomerData,
    getEffectivePrice,
  } = useProductStore();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [copiedVaca, setCopiedVaca] = useState(false);
  const fetusInputRef = useRef<HTMLInputElement>(null);

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

    const message =
      `Hola Atelier Maternidad 3D, deseo reservar mi obra:\n\n` +
      `• Edición: ${currentTier.name}\n` +
      `• Material: ${currentFinish.name}\n` +
      `• Modalidad: ${modalityLabel}\n` +
      `• Nombre: ${customerData.motherName}\n` +
      `• Bebé: ${customerData.babyName} (Semana ${customerData.weeks})\n` +
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
    <div className="bg-[#FAF7F2] border border-[#E5DEC9] p-8 sm:p-14 relative">
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

      {/* Editorial Heading */}
      <div className="max-w-xl mx-auto text-center space-y-3 pb-12 border-b border-[#E5DEC9]">
        <span className="eyebrow block">
          Reserva de Obra · Atelier Bogotá
        </span>
        <h3 className="font-serif text-3xl sm:text-5xl font-light text-[#2C2825]">
          Inicia el esculpido de <em className="italic text-[#8C6D46]">tu bebé.</em>
        </h3>
        <p className="text-sm text-[#6E665E] font-light">
          Abona la mitad al reservar y el saldo restante cuando apruebes la escultura digital.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Edition, Ultrasound & Personal Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Edition Selector */}
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

          {/* Tier 3 Modality */}
          {selectedTier === 3 && (
            <div className="p-5 bg-[#F2ECE1] border border-[#E5DEC9] flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-[#2C2825]">
                Modalidad para esculpir la silueta materna:
              </span>
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
                  Guía Fotográfica ($690.000)
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

          {/* Drag & Drop Ultrasound */}
          <div>
            <span className="eyebrow block mb-3">02 · Fotografía o Video de Ecografía 3D</span>
            <div
              onClick={() => fetusInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  setUploadedFetusFile(e.dataTransfer.files[0]);
                }
              }}
              className="border border-dashed border-[#8C6D46]/60 bg-[#F2ECE1]/50 hover:bg-[#F2ECE1] p-8 text-center cursor-pointer transition-colors"
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
                  Haz clic o arrastra aquí la ecografía de tu bebé (.jpg, .png, .mp4)
                </p>
              )}
            </div>
          </div>

          {/* Minimal Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
              <label className="eyebrow block mb-2">Material</label>
              <select
                value={activeFinish}
                onChange={(e) => setFinish(e.target.value as any)}
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E5DEC9] text-sm text-[#2C2825] focus:outline-none focus:border-[#8C6D46]"
              >
                {FINISH_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Options */}
        <div className="lg:col-span-5 bg-[#F2ECE1] border border-[#E5DEC9] p-8 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <span className="eyebrow block">03 · Modalidad de Pago</span>

            <div
              onClick={() => setPaymentModality('split_50_50')}
              className={`p-4 border cursor-pointer transition-colors ${
                paymentModality === 'split_50_50'
                  ? 'bg-[#FAF7F2] border-[#8C6D46]'
                  : 'bg-[#FAF7F2]/50 border-[#E5DEC9]'
              }`}
            >
              <div className="flex justify-between items-baseline">
                <span className="font-serif text-xl text-[#2C2825]">Reserva 50% / 50%</span>
                <span className="font-serif italic text-lg text-[#8C6D46]">
                  {formatCOP(halfPrice)} hoy
                </span>
              </div>
              <p className="text-xs text-[#6E665E] mt-1 font-light">
                Mitad hoy para modelar y mitad al aprobar el render por WhatsApp.
              </p>
            </div>

            <div
              onClick={() => setPaymentModality('addi_3_cuotas')}
              className={`p-4 border cursor-pointer transition-colors ${
                paymentModality === 'addi_3_cuotas'
                  ? 'bg-[#FAF7F2] border-[#8C6D46]'
                  : 'bg-[#FAF7F2]/50 border-[#E5DEC9]'
              }`}
            >
              <div className="flex justify-between items-baseline">
                <span className="font-serif text-xl text-[#2C2825]">
                  3 Cuotas sin Interés
                </span>
                <span className="font-serif italic text-lg text-[#8C6D46]">
                  3 × {formatCOP(installment3)}
                </span>
              </div>
              <p className="text-xs text-[#6E665E] mt-1 font-light">
                Financiación inmediata con Addi o Sistecredito.
              </p>
            </div>

            <div
              onClick={() => setPaymentModality('vaca_baby_shower')}
              className={`p-4 border cursor-pointer transition-colors ${
                paymentModality === 'vaca_baby_shower'
                  ? 'bg-[#FAF7F2] border-[#8C6D46]'
                  : 'bg-[#FAF7F2]/50 border-[#E5DEC9]'
              }`}
            >
              <div className="flex justify-between items-baseline">
                <span className="font-serif text-xl text-[#2C2825]">
                  Vaca de Baby Shower
                </span>
                <span className="font-serif italic text-lg text-[#8C6D46]">
                  {formatCOP(vacaPerPerson)} c/u
                </span>
              </div>

              <div
                className="mt-3 flex gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
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

              <div className="mt-3 flex gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={handleCopyVacaText}
                  className="text-[11px] uppercase tracking-[0.18em] text-[#8C6D46] underline"
                >
                  {copiedVaca ? '✓ Invitación copiada' : 'Copiar invitación WhatsApp →'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E5DEC9] space-y-5">
            <div className="flex justify-between items-baseline">
              <span className="eyebrow">Valor de la Obra</span>
              <span className="font-serif text-3xl text-[#2C2825]">
                {formatCOP(totalPrice)} COP
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 text-[11px] uppercase tracking-[0.22em] text-[#FAF7F2] bg-[#2C2825] hover:bg-[#8C6D46] transition-colors"
            >
              Confirmar Reserva en el Atelier →
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
        className="deferred-section bg-[#FAF7F2] py-28 lg:py-36 border-t border-[#E5DEC9]"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14">
          <OrderFormContent isModal={false} />
        </div>
      </section>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        {...({ closedby: 'any' } as any)}
        className="w-full max-w-5xl bg-transparent text-[#2C2825] p-0 m-auto open:block"
      >
        <h2 id={titleId} className="sr-only">
          Reserva de Obra Maternidad 3D
        </h2>
        {isOrderModalOpen && (
          <div className="p-3 sm:p-6">
            <OrderFormContent isModal={true} onClose={() => dialogRef.current?.close()} />
          </div>
        )}
      </dialog>
    </>
  );
};
