"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { Quote } from "@/types";

export default function QuoteDetail({ params }: { params: { id: string } }) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchQuote = async () => {
      const res = await fetch("/api/quotes");
      const data = await res.json();
      const foundQuote = data.quotes.find(
        (q: Quote) => q.author === decodeURIComponent(params.id)
      );
      setQuote(foundQuote || null);
    };
    fetchQuote();
  }, [params.id]);

  if (!quote) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back
        </button>
        <div className="flex flex-col items-center">
          <Image
            src={quote.image}
            alt={quote.author}
            width={500}
            height={500}
            className="mb-8 rounded-lg"
          />
          <h1 className="text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
            {quote.author}
          </h1>
          <p className="text-2xl text-center text-gray-700 dark:text-gray-300">
            &ldquo;{quote.quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
