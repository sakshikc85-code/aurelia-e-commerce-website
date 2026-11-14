interface HeaderProps {
  bagCount: number;
  onOpenBag: () => void;
}

export function Header({ bagCount, onOpenBag }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-[72px] bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#262626]">
      <div className="max-w-[1600px] mx-auto h-full px-6 md:px-12 lg:px-20 flex items-center justify-between gap-8">
        <a
          href="#top"
          className="font-editorial text-2xl tracking-[0.14em] text-[#F5F5F5] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
        >
          AURELIA
        </a>

        <nav
          aria-label="Primary salon navigation"
          className="hidden md:flex items-center gap-8"
        >
          <a
            href="#collection"
            className="label-caps text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors duration-200 whitespace-nowrap shrink-0 py-2 border-b border-transparent hover:border-[#D4AF37]"
          >
            Collection
          </a>
          <a
            href="#concierge"
            className="label-caps text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors duration-200 whitespace-nowrap shrink-0 py-2 border-b border-transparent hover:border-[#D4AF37]"
          >
            Concierge
          </a>
          <a
            href="#atelier"
            className="label-caps text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors duration-200 whitespace-nowrap shrink-0 py-2 border-b border-transparent hover:border-[#D4AF37]"
          >
            Atelier
          </a>
          <a
            href="#salons"
            className="label-caps text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors duration-200 whitespace-nowrap shrink-0 py-2 border-b border-transparent hover:border-[#D4AF37]"
          >
            Salons
          </a>
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenBag}
            className="h-10 px-5 rounded-lg border border-[#262626] bg-[#161616] text-[#F5F5F5] hover:border-[#D4AF37] hover:text-[#F3E5AB] transition-colors duration-200 label-caps whitespace-nowrap shrink-0 tabular-nums cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
          >
            Bag ({bagCount})
          </button>
        </div>
      </div>
    </header>
  );
}
