// This API route is disabled for static export compatibility.
// All quote loading is now done client-side from /public/quotes.json.
// This file is kept for reference only and is not used in production static builds.

export function GET() {
  return new Response(
    JSON.stringify({ error: "API route is disabled. Use /quotes.json instead." }),
    { status: 410, headers: { "Content-Type": "application/json" } }
  );
}
