"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Quote } from "@/types";
import QuoteGrid from "@/components/quote-grid";

export default function Home() {
  const QUOTES_PER_PAGE = 10;
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref for the observer element at the bottom
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Shuffle array utility
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Load all quotes from the static JSON file on mount
  useEffect(() => {
    const loadQuotes = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use basePath for GitHub Pages compatibility
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
        const res = await fetch(`${basePath}/quotes.json`);
        if (!res.ok) {
          throw new Error("Failed to load quotes.json");
        }
        const data = await res.json();
        // Flatten if nested
        const flatQuotes = Array.isArray(data) ? data.flat() : [];
        const shuffled = shuffleArray(flatQuotes);
        setAllQuotes(shuffled);
        // Set initial page
        setQuotes(shuffled.slice(0, QUOTES_PER_PAGE));
        setHasMore(shuffled.length > QUOTES_PER_PAGE);
        setPage(2);
      } catch (err) {
        setError("Failed to load quotes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadQuotes();
  }, []);

  // Fetch next page of quotes (client-side)
  const fetchQuotes = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      const startIndex = (page - 1) * QUOTES_PER_PAGE;
      const endIndex = startIndex + QUOTES_PER_PAGE;
      const nextQuotes = allQuotes.slice(startIndex, endIndex);
      setQuotes((prevQuotes) => {
        // Remove duplicates based on quote text
        const existingQuotes = new Set(prevQuotes.map((q) => q.quote));
        const newUniqueQuotes = nextQuotes.filter(
          (q) => !existingQuotes.has(q.quote)
        );
        return [...prevQuotes, ...newUniqueQuotes];
      });
      setHasMore(endIndex < allQuotes.length);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
    }, 400); // Simulate loading delay for smooth UX
  }, [loading, hasMore, page, allQuotes]);

  // Callback function to handle intersection with the loader element
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        hasMore &&
        !loading &&
        allQuotes.length > 0
      ) {
        fetchQuotes();
      }
    },
    [loading, hasMore, allQuotes, fetchQuotes]
  );

  // Callback function to handle intersection with the loader element

  // UseEffect to observe the loader ref
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  return (
    <div className="min-h-screen bg-white  transition-colors duration-200">
      <div className="container mx-auto p-2 lg:px-[7em] py-7">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 ">Niche //</h1>
          {/* <ThemeToggle /> */}
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <QuoteGrid quotes={quotes} />
        {loading && (
          <div className="flex justify-center mt-4">
            <span className="inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        )}

        {/* Loader element at the bottom for intersection observer */}
        <div ref={loaderRef} className="h-1" />
      </div>
    </div>
  );
}
