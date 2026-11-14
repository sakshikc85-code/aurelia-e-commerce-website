import { useMemo, useState } from 'react';
import { Heart, Search, SlidersHorizontal } from 'lucide-react';
import type { CatalogPiece, CategoryFilter } from '../types/aurelia';
import { formatPrice } from '../utils/format';
import { ResilientImage } from './ResilientImage';

interface CollectionSectionProps {
  pieces: CatalogPiece[];
  wishlistIds: string[];
  onToggleWishlist: (pieceId: string) => void;
  onInspectPiece: (piece: CatalogPiece) => void;
  onQuickAdd: (piece: CatalogPiece) => void;
}

type SortOrder = 'featured' | 'price-asc' | 'price-desc';

const CATEGORIES: CategoryFilter[] = [
  'All Pieces',
  'Haute Horlogerie',
  'Evening Couture',
  'Fine Jewellery',
  'Saved',
];

export function CollectionSection({
  pieces,
  wishlistIds,
  onToggleWishlist,
  onInspectPiece,
  onQuickAdd,
}: CollectionSectionProps) {
  const [category, setCategory] = useState<CategoryFilter>('All Pieces');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('featured');

  const filteredPieces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const list = pieces.filter((piece) => {
      if (category === 'Saved') {
        if (!wishlistIds.includes(piece.id)) return false;
      } else if (category !== 'All Pieces') {
        if (piece.category !== category) return false;
      }

      if (!query) return true;
      return (
        piece.name.toLowerCase().includes(query) ||
        piece.material.toLowerCase().includes(query) ||
        piece.category.toLowerCase().includes(query) ||
        piece.reference.toLowerCase().includes(query)
      );
    });

    if (sortOrder === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortOrder === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [pieces, category, searchQuery, sortOrder, wishlistIds]);

  return (
    <section id="collection" className="py-16 md:py-24 border-b border-[#262626]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="label-caps text-[#D4AF37] mb-2">Curated Salon Vitrine</p>
            <h2 className="font-editorial text-3xl md:text-[40px] leading-tight text-[#F5F5F5] text-balance">
              The Seasonal Allocation
            </h2>
          </div>

          <p className="text-sm text-[#A3A3A3] max-w-[44ch]">
            Every timepiece and garment is crafted in numbered runs. Select a piece to review technical calibres, sizing, and private allocation.
          </p>
        </div>

        {/* Interactive Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 mb-10 border-b border-[#262626]">
          <div
            role="tablist"
            aria-label="Collection categories"
            className="flex flex-wrap items-center gap-2"
          >
            {CATEGORIES.map((tab) => {
              const isActive = category === tab;
              const label =
                tab === 'Saved' && wishlistIds.length > 0 ? `Saved (${wishlistIds.length})` : tab;

              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setCategory(tab)}
                  className={`h-10 px-4 rounded-lg label-caps transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
                    isActive
                      ? 'bg-[#F5F5F5] text-[#0A0A0A]'
                      : 'bg-[#161616] text-[#A3A3A3] border border-[#262626] hover:text-[#F5F5F5] hover:border-[#3D3D3D]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#A3A3A3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                strokeWidth={1.5}
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search calibre, silk, gold..."
                aria-label="Search Aurelia collection"
                className="h-12 w-full sm:w-64 pl-10 pr-4 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F5] placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal
                className="w-4 h-4 text-[#A3A3A3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                strokeWidth={1.5}
              />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                aria-label="Sort collection"
                className="h-12 pl-10 pr-8 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F5] focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer appearance-none"
              >
                <option value="featured">Curatorial Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredPieces.length === 0 ? (
          <div className="rounded-2xl border border-[#262626] bg-[#161616] p-12 text-center">
            <p className="font-editorial text-2xl text-[#F5F5F5] mb-2">
              {category === 'Saved'
                ? 'Your private shortlist is empty'
                : 'No matching pieces in this allocation'}
            </p>
            <p className="text-sm text-[#A3A3A3] mb-6 max-w-md mx-auto">
              {category === 'Saved'
                ? 'Select the heart icon on any timepiece, gown, or parure to curate your private viewing list.'
                : 'Adjust your search terms or return to the full seasonal allocation.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory('All Pieces');
                setSearchQuery('');
              }}
              className="h-11 px-6 rounded-lg border border-[#262626] text-[#F5F5F5] hover:border-[#D4AF37] transition-colors label-caps cursor-pointer"
            >
              View All Pieces
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredPieces.map((piece) => {
              const isSaved = wishlistIds.includes(piece.id);

              return (
                <article
                  key={piece.id}
                  className="group flex flex-col rounded-lg bg-[#161616] border border-[#262626] hover:border-[#3D3D3D] transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
                >
                  <div className="relative aspect-[3/4] w-full bg-[#0E0E0E] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onInspectPiece(piece)}
                      className="block w-full h-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D4AF37]"
                      aria-label={`Inspect ${piece.name}`}
                    >
                      <ResilientImage
                        src={piece.image}
                        alt={piece.imageAlt}
                        title={piece.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleWishlist(piece.id)}
                      aria-label={isSaved ? `Remove ${piece.name} from saved` : `Save ${piece.name}`}
                      aria-pressed={isSaved}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-lg border flex items-center justify-center transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
                        isSaved
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0A0A0A]'
                          : 'bg-[#0A0A0A]/75 border-[#262626] text-[#F5F5F5] hover:border-[#D4AF37]'
                      }`}
                    >
                      <Heart
                        className="w-4 h-4"
                        strokeWidth={1.6}
                        fill={isSaved ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#A3A3A3] mb-2">
                        <span>{piece.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{piece.reference}</span>
                      </div>

                      <h3 className="font-editorial text-[22px] leading-[30px] text-[#F5F5F5] mb-1.5">
                        <button
                          type="button"
                          onClick={() => onInspectPiece(piece)}
                          className="text-left hover:text-[#F3E5AB] transition-colors cursor-pointer focus-visible:outline-none focus-visible:underline"
                        >
                          {piece.name}
                        </button>
                      </h3>

                      <p className="text-xs text-[#A3A3A3] mb-5">{piece.material}</p>
                    </div>

                    <div className="pt-4 border-t border-[#262626] flex items-center justify-between gap-4">
                      <span className="text-[15px] font-normal tracking-[0.03em] text-[#F5F5F5] tabular-nums">
                        {formatPrice(piece.price)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onInspectPiece(piece)}
                          className="h-9 px-3.5 rounded-lg border border-[#262626] text-[#F5F5F5] hover:border-[#D4AF37] transition-colors label-caps whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickAdd(piece)}
                          className="h-9 px-4 rounded-lg bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#F3E5AB] active:bg-[#C5A028] transition-colors label-caps whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
