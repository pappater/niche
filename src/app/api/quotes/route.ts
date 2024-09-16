// src/app/api/quotes/route.ts

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Quote } from "@/types";

let cachedQuotes: Quote[][] | null = null;

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");

    if (!cachedQuotes) {
      const filePath = path.join(process.cwd(), "public", "quotes.json");
      const fileContents = await fs.readFile(filePath, "utf8");
      console.log("File Path:", filePath);
      console.log("File Contents:", fileContents);
      cachedQuotes = JSON.parse(fileContents);
    }

    const quotes = cachedQuotes![page - 1];

    return NextResponse.json({ quotes, hasMore: page < cachedQuotes!.length });
  } catch (error) {
    console.error("Error in quotes API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
