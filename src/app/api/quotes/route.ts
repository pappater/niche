import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Quote } from "@/types";

export const dynamic = "force-dynamic";

let allQuotes: Quote[] | null = null;
const QUOTES_PER_PAGE = 10; // Adjust this value as needed

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(request: NextRequest) {
  try {
    if (!allQuotes) {
      const filePath = path.join(process.cwd(), "public", "quotes.json");
      const fileContents = await fs.readFile(filePath, "utf8");
      allQuotes = JSON.parse(fileContents).flat(); // Flatten the array if it's nested
    }

    // Ensure allQuotes is not null before shuffling
    if (!allQuotes || allQuotes.length === 0) {
      throw new Error("No quotes available");
    }

    // Shuffle all quotes
    const shuffledQuotes = shuffleArray(allQuotes);

    // Determine the page number (default to 1)
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");

    // Calculate start and end indices for the current page
    const startIndex = (page - 1) * QUOTES_PER_PAGE;
    const endIndex = startIndex + QUOTES_PER_PAGE;

    // Get quotes for the current page
    const quotesForPage = shuffledQuotes.slice(startIndex, endIndex);

    // Calculate total pages
    const totalPages = Math.ceil(shuffledQuotes.length / QUOTES_PER_PAGE);

    return NextResponse.json({
      quotes: quotesForPage,
      currentPage: page,
      totalPages: totalPages,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Error in quotes API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
