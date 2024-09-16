import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Quote } from "@/types";
let cachedQuotes: Quote[][] | null = null;

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");

    // If cachedQuotes is null, load it from the file
    if (!cachedQuotes) {
      const filePath = path.join(process.cwd(), "public", "quotes.json");
      const fileContents = await fs.readFile(filePath, "utf8");
      cachedQuotes = JSON.parse(fileContents);
    }

    // Assert that cachedQuotes is not null
    const quotes = cachedQuotes![page - 1]; // The "!" ensures TypeScript that cachedQuotes is non-null

    return NextResponse.json({ quotes, hasMore: page < cachedQuotes!.length });
  } catch (error) {
    console.error("Error in quotes API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
