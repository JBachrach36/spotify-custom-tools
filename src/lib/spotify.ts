import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Retrieves the currently authenticated user's session.
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Spotify API Base URL
 */
const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

/**
 * General purpose fetcher for Spotify API.
 */
async function fetchSpotify(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();
  // @ts-ignore
  const accessToken = session?.accessToken;

  if (!accessToken) {
    throw new Error("No Spotify access token available. Please log in.");
  }

  const res = await fetch(`${SPOTIFY_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Spotify API error: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Extracts the Playlist ID from a URL or URI
 */
export function extractPlaylistId(urlOrId: string) {
  const regex = /playlist\/([a-zA-Z0-9]+)/;
  const match = urlOrId.match(regex);
  return match ? match[1] : urlOrId; // If match fails, assume it's already an ID
}

/**
 * Fetch basic info for a single playlist
 */
export async function getPlaylistInfo(playlistId: string) {
  const id = extractPlaylistId(playlistId);
  return fetchSpotify(`/playlists/${id}?fields=id,name`);
}

/**
 * Given a playlist ID, fetch all of its tracks (handling pagination).
 */
export async function getPlaylistTracks(playlistId: string) {
  const id = extractPlaylistId(playlistId);
  let tracks: any[] = [];
  let nextUrl: string | null = `/playlists/${id}/tracks?limit=100`;

  while (nextUrl) {
    // Strip the SPOTIFY_BASE_URL if it's an absolute URL from pagination `next` return
    const endpoint = nextUrl.startsWith("http")
      ? nextUrl.replace(SPOTIFY_BASE_URL, "")
      : nextUrl;

    const data = await fetchSpotify(endpoint);
    tracks = [...tracks, ...data.items];
    nextUrl = data.next;
  }

  // Filter out local tracks
  return tracks.filter((t) => t.track && !t.track.is_local);
}

/**
 * Gets the current user profile
 */
export async function getCurrentUser() {
  return fetchSpotify("/me");
}

/**
 * Create a new playlist and add tracks to it
 */
export async function createVibePlaylist(name: string, description: string, trackUris: string[]) {
  const user = await getCurrentUser();
  
  // 1. Create the playlist
  const playlist = await fetchSpotify(`/users/${user.id}/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description,
      public: false,
    }),
  });

  // 2. Add tracks (chunk into 100s)
  for (let i = 0; i < trackUris.length; i += 100) {
    const chunk = trackUris.slice(i, i + 100);
    await fetchSpotify(`/playlists/${playlist.id}/tracks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: chunk,
      }),
    });
  }

  return playlist;
}
