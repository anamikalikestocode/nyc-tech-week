import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // TODO: When Supabase is connected:
  // 1. Create itinerary record
  // 2. Create itinerary_days
  // 3. Create itinerary_items linked to partners
  // 4. Return the created itinerary with share_token

  console.log("Itinerary creation request:", body);

  return NextResponse.json({
    id: "placeholder-id",
    shareToken: "placeholder-token",
    title: body.title,
  });
}

export async function GET() {
  // TODO: Fetch user's itineraries
  return NextResponse.json({ itineraries: [] });
}
