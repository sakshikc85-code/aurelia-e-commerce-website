import { useState } from 'react';
import { Watch } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

export function ResilientImage({ src, alt, title, className = '' }: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#1C1B1B] to-[#0E0E0E] text-[#A3A3A3] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Watch className="w-7 h-7 text-[#D4AF37]/70 mb-3" strokeWidth={1.25} />
        <span className="font-editorial text-sm text-[#E5E2E1]/80 max-w-[18ch]">
          {title || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
