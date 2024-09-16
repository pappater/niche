// src/app/api/quotes/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Quote } from "@/types";

// Initialize a cache for quotes
let cachedQuotes: Quote[][] | null = null;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);

    // Load quotes from the file if not cached
    if (!cachedQuotes) {
      const filePath = path.join(process.cwd(), "public", "quotes.json");
      const fileContents = await fs.readFile(filePath, "utf8");
      cachedQuotes = JSON.parse(fileContents);
    }

    // Ensure quotes exist for the requested page
    if (page < 1 || page > cachedQuotes!.length) {
      return NextResponse.json(
        { error: "Page out of bounds" },
        { status: 400 }
      );
    }

    const quotes = cachedQuotes![page - 1];
    const hasMore = page < cachedQuotes!.length;

    return NextResponse.json({ quotes, hasMore });
  } catch (error) {
    console.error("Error in quotes API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
