import Image from "next/image";
import { Quote } from "@/types";

interface QuoteCardProps {
  quote: Quote;
}

import { useState } from "react";

export default function QuoteCard({ quote }: QuoteCardProps) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="bg-white overflow-hidden">
      {/* Only show image if it loads successfully */}
      {!imgError && (
        <div className="relative w-full h-[50vh]">
          <Image
            src={quote.image}
            alt={quote.author}
            layout="fill"
            objectFit="cover"
            quality={75}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJoAMyzly8qgAAAABJRU5ErkJggg=="
            onError={() => setImgError(true)}
          />
        </div>
      )}
      <div className="p-4">
        <p className="text-xs mb-2 text-neutral-800">{quote.quote}</p>
        <p className="text-xs text-neutral-800">- {quote.author}</p>
      </div>
    </div>
  );
}
