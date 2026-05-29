import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // TODO: Fetch itinerary by ID from Supabase
  return NextResponse.json({
    id,
    title: "Placeholder Itinerary",
    days: [],
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  // TODO: Update itinerary in Supabase
  console.log("Update itinerary:", id, body);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // TODO: Delete itinerary from Supabase
  console.log("Delete itinerary:", id);

  return NextResponse.json({ success: true });
}
