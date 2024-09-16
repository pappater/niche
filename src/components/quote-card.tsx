import Image from "next/image";
import { Quote } from "@/types";

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <div className="bg-white overflow-hidden">
      {/* Next.js Image component with optimization */}
      <div className="relative w-full h-[50vh]">
        {" "}
        {/* Adjust height as needed */}
        <Image
          src={quote.image}
          alt={quote.author}
          layout="fill"
          objectFit="cover"
          quality={75} // Adjust quality as needed (default is 75)
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJoAMyzly8qgAAAABJRU5ErkJggg=="
        />
      </div>

      <div className="p-4">
        <p className="text-xs mb-2 text-neutral-800">{quote.quote}</p>
        <p className="text-xs text-neutral-800">- {quote.author}</p>
      </div>
    </div>
  );
}
