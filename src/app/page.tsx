"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Quote } from "@/types";
import QuoteGrid from "@/components/quote-grid";
import ThemeToggle from "@/components/theme-toggle";

export default function Home() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref for the observer element at the bottom
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchQuotes = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotes?page=${page}`);
      if (!res.ok) {
        throw new Error("Failed to fetch quotes");
      }
      const data = await res.json();
      console.log("Fetched data:", data);
      if (Array.isArray(data.quotes)) {
        setQuotes((prevQuotes) => [...prevQuotes, ...data.quotes]);
        setHasMore(data.hasMore);
        setPage((prevPage) => prevPage + 1);
      } else {
        console.error("Unexpected data structure:", data);
        setError("Unexpected data structure received from server");
      }
    } catch (err) {
      console.error("Error fetching quotes:", err);
      setError("Failed to fetch quotes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Callback function to handle intersection with the loader element
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        fetchQuotes();
      }
    },
    [loading, hasMore]
  );

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
        {loading && <p className="text-center mt-4">Loading more...</p>}

        {/* Loader element at the bottom for intersection observer */}
        <div ref={loaderRef} className="h-1" />
      </div>
    </div>
  );
}
