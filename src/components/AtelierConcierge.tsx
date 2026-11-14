import { useState } from 'react';
import { AlertCircle, ArrowRight, RotateCcw, Trash2 } from 'lucide-react';
import type { CatalogPiece, ConciergeConsultation } from '../types/aurelia';
import { formatPrice, formatShortDate } from '../utils/format';
import { ResilientImage } from './ResilientImage';

interface AtelierConciergeProps {
  pieces: CatalogPiece[];
  wishlistIds: string[];
  consultations: ConciergeConsultation[];
  onSaveConsultation: (consultation: ConciergeConsultation) => void;
  onClearHistory: () => void;
  onInspectPiece: (piece: CatalogPiece) => void;
  onAddToBag: (piece: CatalogPiece) => void;
}

const OCCASIONS = [
  'Black-Tie Gala',
  'Private Gallery Opening',
  'Executive Travel',
  'Milestone Acquisition',
];

const CURATED_PROMPTS = [
  'Pair an 18k gold dress timepiece with sculptural black evening tailoring for an opera premiere in Milan.',
  'Minimalist architectural daytime look anchored by a perpetual calendar watch and brushed gold parure.',
  'Understated heirloom timepiece for a formal Geneva reception with warm champagne silk tones.',
];

interface ApiConciergeResult {
  editorialNote: string;
  stylingNotes: string[];
  recommendations: Array<{
    pieceId: string;
    pairingReason: string;
  }>;
  error?: string;
}

export function AtelierConcierge({
  pieces,
  wishlistIds,
  consultations,
  onSaveConsultation,
  onClearHistory,
  onInspectPiece,
  onAddToBag,
}: AtelierConciergeProps) {
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeConsultationId, setActiveConsultationId] = useState<string | null>(
    consultations[0]?.id ?? null,
  );

  const pieceMap = new Map(pieces.map((p) => [p.id, p]));
  const activeConsultation =
    consultations.find((c) => c.id === activeConsultationId) ?? consultations[0] ?? null;

  async function submitInquiry(customQuery?: string) {
    const promptText = (customQuery ?? query).trim();
    if (!promptText) {
      setError('Please describe your occasion, silhouette, or horological preference.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: promptText,
          occasion,
          savedIds: wishlistIds,
        }),
      });

      const data = (await res.json()) as ApiConciergeResult;

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Unable to reach the Atelier Concierge.');
      }

      const consultation: ConciergeConsultation = {
        id: `con-${Date.now()}`,
        query: promptText,
        occasion,
        createdAt: new Date().toISOString(),
        editorialNote: data.editorialNote,
        stylingNotes: data.stylingNotes ?? [],
        recommendations: data.recommendations ?? [],
      };

      onSaveConsultation(consultation);
      setActiveConsultationId(consultation.id);
      if (!customQuery) {
        setQuery('');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while consulting the Atelier.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="concierge" className="py-16 md:py-24 border-b border-[#262626] bg-[#0D0D0D]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Client Brief Input */}
          <div className="lg:col-span-5 rounded-2xl bg-[#161616] border border-[#262626] p-6 sm:p-8">
            <p className="label-caps text-[#D4AF37] mb-2">Private Client Advisory</p>
            <h2 className="font-editorial text-3xl text-[#F5F5F5] mb-3 text-balance">
              Atelier Styling &amp; Horology Concierge
            </h2>
            <p className="text-sm text-[#A3A3A3] leading-relaxed mb-6">
              Describe your evening, climate, or tailoring silhouette. Our curatorial advisor pairs Aurelia calibres and garments into a cohesive ensemble.
            </p>

            {/* Occasion Selector */}
            <div className="mb-5">
              <p className="label-caps text-[#A3A3A3] mb-2.5">Occasion Context</p>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((item) => {
                  const active = occasion === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setOccasion(item)}
                      className={`h-9 px-3.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#F5F5F5] text-[#0A0A0A] border-[#F5F5F5]'
                          : 'bg-[#131313] text-[#A3A3A3] border-[#262626] hover:text-[#F5F5F5] hover:border-[#3D3D3D]'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brief Textarea */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submitInquiry();
              }}
            >
              <label htmlFor="concierge-query" className="label-caps text-[#A3A3A3] block mb-2.5">
                Styling Brief
              </label>
              <textarea
                id="concierge-query"
                rows={4}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Formal autumn evening in Geneva — seeking an ultra-thin gold watch paired with black cashmere..."
                className="w-full p-4 rounded-lg bg-[#0E0E0E] border border-[#262626] text-sm text-[#F5F5F5] placeholder:text-[#A3A3A3]/70 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none mb-4"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 px-6 rounded-lg bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#F3E5AB] active:bg-[#C5A028] disabled:opacity-60 disabled:cursor-not-allowed transition-colors label-caps inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Preparing Curation…' : 'Request Salon Curation'}</span>
                {!loading && <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />}
              </button>
            </form>

            {/* Quick Starters */}
            <div className="mt-6 pt-6 border-t border-[#262626]">
              <p className="label-caps text-[#A3A3A3] mb-3">Example Briefs</p>
              <div className="space-y-2">
                {CURATED_PROMPTS.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setQuery(sample);
                      void submitInquiry(sample);
                    }}
                    className="w-full text-left p-3 rounded-lg bg-[#131313] border border-[#262626] hover:border-[#D4AF37] text-xs text-[#D0C5AF] leading-relaxed transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Curatorial Output */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {error && (
              <div
                role="alert"
                className="rounded-2xl border border-[#93000a] bg-[#1C1C1C] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#ffb4ab] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#ffb4ab] mb-1">
                      Advisory Unavailable
                    </p>
                    <p className="text-xs text-[#D0C5AF] leading-relaxed">{error}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void submitInquiry()}
                  className="h-10 px-4 rounded-lg border border-[#262626] text-[#F5F5F5] hover:border-[#D4AF37] label-caps inline-flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {loading ? (
              <div className="rounded-2xl border border-[#262626] bg-[#161616] p-8 space-y-6 animate-pulse">
                <div className="h-3 w-36 bg-[#262626] rounded" />
                <div className="space-y-2.5">
                  <div className="h-5 w-3/4 bg-[#262626] rounded" />
                  <div className="h-4 w-full bg-[#262626] rounded" />
                  <div className="h-4 w-5/6 bg-[#262626] rounded" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="h-48 rounded-lg bg-[#201F1F] border border-[#262626]" />
                  <div className="h-48 rounded-lg bg-[#201F1F] border border-[#262626]" />
                </div>
              </div>
            ) : activeConsultation ? (
              <div className="rounded-2xl border border-[#262626] bg-[#161616] p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#262626]">
                  <div className="flex items-center gap-2 text-xs text-[#A3A3A3]">
                    <span className="text-[#D4AF37]">{activeConsultation.occasion}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatShortDate(activeConsultation.createdAt)}</span>
                  </div>
                  <span className="label-caps text-[#A3A3A3]">Curatorial Dossier</span>
                </div>

                <blockquote className="font-editorial text-xl sm:text-2xl leading-relaxed text-[#F5F5F5] mb-6">
                  “{activeConsultation.editorialNote}”
                </blockquote>

                {activeConsultation.stylingNotes.length > 0 && (
                  <div className="mb-8 pb-6 border-b border-[#262626]">
                    <p className="label-caps text-[#A3A3A3] mb-3">Sartorial &amp; Calibre Notes</p>
                    <ul className="space-y-2">
                      {activeConsultation.stylingNotes.map((note, idx) => (
                        <li key={idx} className="text-sm text-[#D0C5AF] flex items-baseline gap-3">
                          <span className="text-[#D4AF37] tabular-nums text-xs">
                            0{idx + 1}.
                          </span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="label-caps text-[#A3A3A3] mb-4">Recommended Ensemble</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeConsultation.recommendations.map((rec) => {
                      const piece = pieceMap.get(rec.pieceId);
                      if (!piece) return null;

                      return (
                        <div
                          key={rec.pieceId}
                          className="rounded-lg bg-[#131313] border border-[#262626] p-4 flex flex-col justify-between gap-4"
                        >
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() => onInspectPiece(piece)}
                              className="w-20 h-24 rounded-md overflow-hidden bg-[#0A0A0A] shrink-0 border border-[#262626] cursor-pointer"
                            >
                              <ResilientImage
                                src={piece.image}
                                alt={piece.imageAlt}
                                title={piece.name}
                                className="w-full h-full object-cover"
                              />
                            </button>
                            <div className="min-w-0">
                              <p className="text-[11px] uppercase tracking-[0.12em] text-[#A3A3A3] mb-1">
                                {piece.category}
                              </p>
                              <h3 className="font-editorial text-lg leading-snug text-[#F5F5F5] mb-1">
                                {piece.name}
                              </h3>
                              <p className="text-sm text-[#D4AF37] tabular-nums">
                                {formatPrice(piece.price)}
                              </p>
                            </div>
                          </div>

                          <p className="text-xs text-[#A3A3A3] leading-relaxed">
                            {rec.pairingReason}
                          </p>

                          <div className="flex items-center gap-2 pt-2 border-t border-[#262626]">
                            <button
                              type="button"
                              onClick={() => onInspectPiece(piece)}
                              className="flex-1 h-9 rounded-lg border border-[#262626] text-[#F5F5F5] hover:border-[#D4AF37] label-caps cursor-pointer"
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => onAddToBag(piece)}
                              className="flex-1 h-9 rounded-lg bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#F3E5AB] label-caps cursor-pointer"
                            >
                              Add to Bag
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#262626] bg-[#161616] p-8 sm:p-12 flex flex-col justify-center min-h-[340px]">
                <p className="label-caps text-[#D4AF37] mb-3">Awaiting Brief</p>
                <h3 className="font-editorial text-2xl sm:text-3xl text-[#F5F5F5] mb-3">
                  Bespoke Pairings Across Horology &amp; Couture
                </h3>
                <p className="text-sm text-[#A3A3A3] leading-relaxed max-w-[54ch]">
                  Submit your occasion or select one of the example briefs on the left. Your curated dossiers are saved automatically in this browser for effortless comparison.
                </p>
              </div>
            )}

            {/* Saved Consultation History */}
            {consultations.length > 0 && (
              <div className="rounded-2xl border border-[#262626] bg-[#161616] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <p className="label-caps text-[#A3A3A3]">
                    Recent Salon Dossiers ({consultations.length})
                  </p>
                  <button
                    type="button"
                    onClick={onClearHistory}
                    className="text-xs text-[#A3A3A3] hover:text-[#F5F5F5] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear History</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {consultations.map((item) => {
                    const isSelected = activeConsultation?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveConsultationId(item.id)}
                        className={`text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#1C1C1C] border-[#D4AF37]'
                            : 'bg-[#131313] border-[#262626] hover:border-[#3D3D3D]'
                        }`}
                      >
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[#D4AF37] mb-1">
                          {item.occasion}
                        </p>
                        <p className="text-xs text-[#F5F5F5] line-clamp-2 leading-relaxed">
                          {item.query}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
