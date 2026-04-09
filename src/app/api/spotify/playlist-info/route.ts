import { NextResponse } from "next/server";
import { getPlaylistInfo } from "@/lib/spotify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "Missing playlist URL." }, { status: 400 });
    }

    const info = await getPlaylistInfo(url);
    return NextResponse.json({ info });
  } catch (err: any) {
    console.error("[/api/spotify/playlist-info]", err);
    // Let the client distinguish a 401
    const isUnauthorized = err.message?.includes("401");
    return NextResponse.json(
      { error: err.message ?? "Failed to fetch playlist info." },
      { status: isUnauthorized ? 401 : 500 }
    );
  }
}
