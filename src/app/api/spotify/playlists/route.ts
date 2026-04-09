import { NextResponse } from "next/server";
import { getPlaylistTracks, extractPlaylistId } from "@/lib/spotify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { urls } = await req.json();
    if (!urls || !Array.isArray(urls) || urls.length < 2) {
      return NextResponse.json(
        { error: "At least 2 playlist URLs are required." },
        { status: 400 }
      );
    }
    if (urls.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 playlists allowed." },
        { status: 400 }
      );
    }

    // Fetch all playlists in parallel
    const results = await Promise.all(
      urls.map(async (url: string) => {
        const id = extractPlaylistId(url);
        const tracks = await getPlaylistTracks(id);
        return { id, tracks };
      })
    );

    return NextResponse.json({ playlists: results });
  } catch (err: any) {
    console.error("[/api/spotify/playlists]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to fetch playlists." },
      { status: 500 }
    );
  }
}
