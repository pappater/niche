import { Quote } from "@/types";
import Link from "next/link";

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 overflow-hidden">
      {/* Responsive image with object-cover */}
      <img
        src={quote.image}
        alt={quote.author}
        className="w-full object-cover "
      />

      <div className="p-4">
        <p className="text-xs mb-2 text-neutral-800 dark:text-white">
          {quote.quote}
        </p>
        <p className="text-xs text-neutral-800 dark:text-neutral-400">
          - {quote.author}
        </p>
      </div>
    </div>
  );
}
