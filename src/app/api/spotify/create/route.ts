import { NextResponse } from "next/server";
import { createVibePlaylist } from "@/lib/spotify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, trackUris } = await req.json();
    if (!name || !trackUris || !Array.isArray(trackUris) || trackUris.length === 0) {
      return NextResponse.json({ error: "Name and track URIs are required." }, { status: 400 });
    }

    const playlist = await createVibePlaylist(
      name,
      description ?? "Created with PlaylistVibe",
      trackUris
    );

    return NextResponse.json({ playlist });
  } catch (err: any) {
    console.error("[/api/spotify/create]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to create playlist." },
      { status: 500 }
    );
  }
}
