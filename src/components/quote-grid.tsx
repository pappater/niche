import { Quote } from "@/types";
import QuoteCard from "./quote-card";

interface QuoteGridProps {
  quotes: Quote[];
}

// Function to remove duplicate quotes based on quote text
const removeDuplicates = (quotes: Quote[]) => {
  const seen = new Set();
  return quotes.filter((quote) => {
    const isDuplicate = seen.has(quote.quote);
    seen.add(quote.quote);
    return !isDuplicate;
  });
};

export default function QuoteGrid({ quotes }: QuoteGridProps) {
  // Remove duplicates before rendering
  const uniqueQuotes = removeDuplicates(quotes);

  return (
    <div className="masonry">
      {uniqueQuotes.map((quote, index) => (
        <QuoteCard key={index} quote={quote} />
      ))}
    </div>
  );
}
