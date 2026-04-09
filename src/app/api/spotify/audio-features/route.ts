import { NextResponse } from "next/server";
import { getAudioFeaturesForTracks } from "@/lib/spotify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { trackIds } = await req.json();
    if (!trackIds || !Array.isArray(trackIds) || trackIds.length === 0) {
      return NextResponse.json({ error: "No track IDs provided." }, { status: 400 });
    }

    const features = await getAudioFeaturesForTracks(trackIds);
    return NextResponse.json({ features });
  } catch (err: any) {
    console.error("[/api/spotify/audio-features]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to fetch audio features." },
      { status: 500 }
    );
  }
}
