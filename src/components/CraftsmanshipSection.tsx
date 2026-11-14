import { EDITORIAL_MEDIA } from '../data/catalogMedia';
import { ResilientImage } from './ResilientImage';

interface CraftsmanshipSectionProps {
  onOpenConcierge: () => void;
}

export function CraftsmanshipSection({ onOpenConcierge }: CraftsmanshipSectionProps) {
  return (
    <section id="atelier" className="py-16 md:py-24 border-b border-[#262626]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-[#262626] bg-[#161616]">
            <ResilientImage
              src={EDITORIAL_MEDIA.craftMovement}
              alt="Hand-beveled 18k gold calibre bridges with Cotes de Geneve finishing at Aurelia Geneva"
              title="Geneva Calibre Workshop"
              className="w-full h-full min-h-[320px] object-cover object-center"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-[#262626] bg-[#161616] p-8 sm:p-10 lg:p-12">
            <div>
              <p className="label-caps text-[#D4AF37] mb-3">Savoir-Faire · Geneva &amp; Paris</p>
              <h2 className="font-editorial text-3xl sm:text-[40px] leading-[1.15] text-[#F5F5F5] mb-6 text-balance">
                Finished by Hand Where Light Never Reaches
              </h2>
              <p className="text-[15px] leading-relaxed text-[#D0C5AF] mb-5">
                Within our Rue du Rhône horological atelier, every bridge is chamfered with gentian wood and diamond paste before a single calibre is cased. Across the Alps in Paris and Milan, our tailors apply the same quiet discipline to double-faced cashmere and bias-cut silk.
              </p>
              <p className="text-sm leading-relaxed text-[#A3A3A3] mb-8">
                Nothing is built for spectacle. Proportions remain slender enough to slip effortlessly beneath a French cuff, balanced to endure decades of private provenance.
              </p>
            </div>

            <div className="pt-8 border-t border-[#262626] grid grid-cols-3 gap-6">
              <div>
                <p className="font-editorial text-2xl sm:text-3xl text-[#F5F5F5] tabular-nums mb-1">
                  190h
                </p>
                <p className="text-xs text-[#A3A3A3]">Hand regulation per tourbillon</p>
              </div>
              <div>
                <p className="font-editorial text-2xl sm:text-3xl text-[#F5F5F5] tabular-nums mb-1">
                  18k
                </p>
                <p className="text-xs text-[#A3A3A3]">Certified champagne gold alloy</p>
              </div>
              <div>
                <p className="font-editorial text-2xl sm:text-3xl text-[#F5F5F5] tabular-nums mb-1">
                  36h
                </p>
                <p className="text-xs text-[#A3A3A3]">On-form couture draping</p>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={onOpenConcierge}
                className="py-2 text-sm text-[#F5F5F5] hover:opacity-75 transition-opacity border-b border-[#D4AF37] cursor-pointer"
              >
                Request a Private Salon Fitting
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
