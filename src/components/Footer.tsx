export function Footer() {
  return (
    <footer id="salons" className="bg-[#0A0A0A] py-16 md:py-20">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-[#262626]">
          <div className="md:col-span-5">
            <p className="font-editorial text-2xl tracking-[0.14em] text-[#F5F5F5] mb-3">
              AURELIA
            </p>
            <p className="text-sm text-[#A3A3A3] max-w-[40ch] leading-relaxed">
              Independent Swiss Haute Horlogerie and Parisian Evening Couture. Private viewings by appointment across Geneva, Paris, and Milan.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <p className="label-caps text-[#D4AF37] mb-3">Geneva</p>
              <p className="text-sm text-[#D0C5AF] leading-relaxed">
                42 Rue du Rhône
                <br />
                1204 Genève, Switzerland
              </p>
            </div>
            <div>
              <p className="label-caps text-[#D4AF37] mb-3">Paris</p>
              <p className="text-sm text-[#D0C5AF] leading-relaxed">
                18 Place Vendôme
                <br />
                75001 Paris, France
              </p>
            </div>
            <div>
              <p className="label-caps text-[#D4AF37] mb-3">Milan</p>
              <p className="text-sm text-[#D0C5AF] leading-relaxed">
                14 Via Montenapoleone
                <br />
                20121 Milano, Italy
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#A3A3A3]">
          <p>© {new Date().getFullYear()} Maison Aurelia. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#collection" className="hover:text-[#F5F5F5] transition-colors">
              Collection
            </a>
            <a href="#concierge" className="hover:text-[#F5F5F5] transition-colors">
              Atelier Concierge
            </a>
            <a href="#atelier" className="hover:text-[#F5F5F5] transition-colors">
              Savoir-Faire
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
