import { ArrowRight } from 'lucide-react';
import { EDITORIAL_MEDIA } from '../data/catalogMedia';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onExploreCollection: () => void;
  onOpenConcierge: () => void;
}

export function HeroSection({ onExploreCollection, onOpenConcierge }: HeroSectionProps) {
  return (
    <section id="top" className="relative bg-[#0A0A0A] border-b border-[#262626]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-10 md:py-14 lg:py-16">
        <div className="relative overflow-hidden rounded-2xl border border-[#262626] bg-[#131313]">
          <div className="relative aspect-[16/10] md:aspect-[16/8] lg:aspect-[16/7] w-full">
            <ResilientImage
              src={EDITORIAL_MEDIA.heroCampaign}
              alt="Aurelia 18k champagne gold dress watch alongside tailored obsidian cashmere"
              title="Aurelia Monograph"
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/92 via-[#0A0A0A]/65 to-[#0A0A0A]/20"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-transparent"
              aria-hidden="true"
            />

            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14 lg:p-16">
              <div className="max-w-2xl">
                <p className="label-caps text-[#D4AF37] mb-3">
                  Geneva · Paris · Autumn Monograph
                </p>
                <h1 className="font-editorial text-[clamp(2.25rem,4.5vw,4.5rem)] leading-[1.08] tracking-[-0.02em] text-[#F5F5F5] text-balance mb-4">
                  Architecture of Time and Tailored Silence
                </h1>
                <p className="text-[15px] md:text-base font-light leading-relaxed text-[#D0C5AF] max-w-[54ch] mb-8">
                  Hand-regulated Swiss mechanical calibres and sculptural Milanese evening tailoring, curated in numbered salon editions.
                </p>

                <div className="flex flex-wrap items-center gap-6">
                  <button
                    type="button"
                    onClick={onExploreCollection}
                    className="h-12 px-7 rounded-lg bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#F3E5AB] active:bg-[#C5A028] transition-colors duration-200 label-caps inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E5AB]"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>

                  <button
                    type="button"
                    onClick={onOpenConcierge}
                    className="py-2 text-sm text-[#F5F5F5] hover:opacity-75 transition-opacity duration-200 border-b border-[#D4AF37] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
                  >
                    Consult Atelier Concierge
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
