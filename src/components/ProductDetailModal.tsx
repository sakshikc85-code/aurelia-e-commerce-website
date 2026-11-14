import { useEffect, useState } from 'react';
import { Heart, X } from 'lucide-react';
import type { CatalogPiece } from '../types/aurelia';
import { formatPrice } from '../utils/format';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  piece: CatalogPiece | null;
  isSaved: boolean;
  onClose: () => void;
  onToggleWishlist: (pieceId: string) => void;
  onAddToBag: (piece: CatalogPiece, variant: string) => void;
}

export function ProductDetailModal({
  piece,
  isSaved,
  onClose,
  onToggleWishlist,
  onAddToBag,
}: ProductDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState('');

  useEffect(() => {
    if (piece) {
      setSelectedVariant(piece.variants[0] ?? '');
    }
  }, [piece]);

  useEffect(() => {
    if (!piece) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [piece, onClose]);

  if (!piece) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1C1C1C] border border-[#262626]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close piece details"
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-lg border border-[#262626] bg-[#161616] text-[#F5F5F5] hover:border-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" strokeWidth={1.6} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left: Portrait Gallery */}
          <div className="lg:col-span-6 bg-[#0E0E0E] border-b lg:border-b-0 lg:border-r border-[#262626] flex flex-col">
            <div className="aspect-[3/4] w-full overflow-hidden">
              <ResilientImage
                src={piece.image}
                alt={piece.imageAlt}
                title={piece.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#A3A3A3] mb-3 pr-10">
                <span>{piece.category}</span>
                <span aria-hidden="true">·</span>
                <span>{piece.reference}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#D4AF37]">{piece.availability}</span>
              </div>

              <h2
                id="pdp-title"
                className="font-editorial text-2xl sm:text-3xl leading-tight text-[#F5F5F5] mb-3"
              >
                {piece.name}
              </h2>

              <p className="text-xl tracking-[0.04em] text-[#F5F5F5] tabular-nums mb-6">
                {formatPrice(piece.price)}
              </p>

              <p className="text-sm leading-relaxed text-[#D0C5AF] mb-4">{piece.summary}</p>
              <p className="text-sm leading-relaxed text-[#A3A3A3] pb-6 border-b border-[#262626]">
                {piece.craftStory}
              </p>

              {/* Segmented Variant Picker */}
              <div className="py-6 border-b border-[#262626]">
                <p className="label-caps text-[#A3A3A3] mb-3">{piece.variantLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {piece.variants.map((variant) => {
                    const active = selectedVariant === variant;
                    return (
                      <button
                        key={variant}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`h-10 px-4 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-[#F5F5F5] text-[#0A0A0A] border-[#F5F5F5]'
                            : 'bg-[#161616] text-[#F5F5F5] border-[#262626] hover:border-[#D4AF37]'
                        }`}
                      >
                        {variant}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="pt-6">
                <p className="label-caps text-[#A3A3A3] mb-4">Technical Specifications</p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {piece.specs.map((spec) => (
                    <div key={spec.label} className="border-b border-[#262626] pb-3">
                      <dt className="text-[11px] uppercase tracking-[0.12em] text-[#A3A3A3] mb-1">
                        {spec.label}
                      </dt>
                      <dd className="text-sm text-[#F5F5F5] tabular-nums">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Primary Purchase CTA */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  onAddToBag(piece, selectedVariant || piece.variants[0]);
                  onClose();
                }}
                className="flex-1 h-12 px-6 rounded-lg bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#F3E5AB] active:bg-[#C5A028] transition-colors label-caps whitespace-nowrap cursor-pointer"
              >
                Add to Salon Bag
              </button>

              <button
                type="button"
                onClick={() => onToggleWishlist(piece.id)}
                aria-label={isSaved ? 'Remove from saved pieces' : 'Save piece'}
                aria-pressed={isSaved}
                className={`h-12 w-12 rounded-lg border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                  isSaved
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0A0A0A]'
                    : 'bg-[#161616] border-[#262626] text-[#F5F5F5] hover:border-[#D4AF37]'
                }`}
              >
                <Heart
                  className="w-4 h-4"
                  strokeWidth={1.6}
                  fill={isSaved ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
