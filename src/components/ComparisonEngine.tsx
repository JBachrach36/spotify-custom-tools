"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Loader2,
  GitMerge,
  Users,
  Zap,
  ListMusic,
  CheckCircle2,
  ExternalLink,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { TrackRow } from "./TrackRow";

interface Track {
  id: string;
  uri: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  duration_ms: number;
  explicit?: boolean;
}

interface PlaylistData {
  id: string;
  tracks: { track: Track }[];
}

}

type CompareMode = "intersection" | "artists";

const MODES = [
  {
    id: "intersection" as CompareMode,
    label: "Common Songs",
    icon: GitMerge,
    description: "Songs in ALL selected playlists",
  },
  {
    id: "artists" as CompareMode,
    label: "Artist Overlap",
    icon: Users,
    description: "Artists appearing in ALL playlists",
  },
];

interface ComparisonEngineProps {
  playlistUrls: string[];
}

export function ComparisonEngine({ playlistUrls }: ComparisonEngineProps) {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<CompareMode>("intersection");
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [selectedUris, setSelectedUris] = useState<Set<string>>(new Set());
  const [playlistName, setPlaylistName] = useState("My PlaylistVibe Mix");
  const [creating, setCreating] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canCompare = playlistUrls.length >= 2;

  // ── Fetch playlists ──────────────────────────────────────────────────────
  const fetchPlaylists = async () => {
    setLoading(true);
    setError(null);
    setCreatedUrl(null);
    setPlaylists([]);
    setAudioFeatures({});
    setSelectedUris(new Set());

    try {
      const res = await fetch("/api/spotify/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: playlistUrls }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch playlists");

      setPlaylists(data.playlists);
    } catch (e: any) {
      if (e.message && e.message.includes("Unauthorized")) {
        setError("Your Spotify session has expired. Please log in again to continue.");
      } else {
        setError(e.message ?? "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Compute results ──────────────────────────────────────────────────────
  const commonTracks = useCallback((): Track[] => {
    if (playlists.length < 2) return [];
    // Start with first playlist's track IDs
    const idSets = playlists.map(
      (pl) => new Set(pl.tracks.map((t) => t.track?.id).filter(Boolean))
    );
    const intersection = [...idSets[0]].filter((id) =>
      idSets.slice(1).every((s) => s.has(id))
    );
    // Return the actual track objects (from first playlist)
    const trackMap = new Map(
      playlists[0].tracks.map((t) => [t.track?.id, t.track])
    );
    return intersection.map((id) => trackMap.get(id)!).filter(Boolean);
  }, [playlists]);

  const commonArtists = useCallback((): string[] => {
    if (playlists.length < 2) return [];
    const artistSets = playlists.map((pl) => {
      const set = new Set<string>();
      pl.tracks.forEach((t) =>
        (t.track?.artists ?? []).forEach((a) => set.add(a.name))
      );
      return set;
    });
    return [...artistSets[0]].filter((artist) =>
      artistSets.slice(1).every((s) => s.has(artist))
    );
  }, [playlists]);

  // ── Toggle track selection ────────────────────────────────────────────────
  const toggleSelect = (uri: string) => {
    setSelectedUris((prev) => {
      const next = new Set(prev);
      if (next.has(uri)) next.delete(uri);
      else next.add(uri);
      return next;
    });
  };

  const selectAll = (tracks: Track[]) => {
    setSelectedUris(new Set(tracks.map((t) => t.uri)));
  };

  const clearSelection = () => setSelectedUris(new Set());

  // ── Create playlist ───────────────────────────────────────────────────────
  const createPlaylist = async () => {
    if (selectedUris.size === 0) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/spotify/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playlistName,
          description: `Created with PlaylistVibe — Mode: ${mode}`,
          trackUris: Array.from(selectedUris),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create playlist");
      setCreatedUrl(data.playlist.external_urls?.spotify ?? null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  // ── Active result tracks for current mode ────────────────────────────────
  const activeTracks = mode === "intersection" ? commonTracks() : [];

  const hasResults = playlists.length > 0;

  return (
    <div>
      {/* Mode tabs */}
      <div
        className="flex gap-2 flex-wrap"
        role="tablist"
        aria-label="Comparison modes"
        style={{ marginBottom: "24px" }}
      >
        {MODES.map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              id={`btn-mode-${m.id}`}
              role="tab"
              aria-selected={active}
              onClick={() => setMode(m.id)}
              className="flex items-center gap-2 cursor-pointer"
              style={{
                background: active ? "rgba(29, 185, 84, 0.12)" : "#181818",
                border: active ? "1px solid #1DB954" : "1px solid #282828",
                borderRadius: "8px",
                padding: "10px 16px",
                color: active ? "#1DB954" : "#B3B3B3",
                fontSize: "13px",
                fontWeight: active ? 700 : 400,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#535353";
                  (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#282828";
                  (e.currentTarget as HTMLButtonElement).style.color = "#B3B3B3";
                }
              }}
            >
              <Icon size={15} aria-hidden="true" />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Compare button */}
      {!hasResults && (
        <button
          id="btn-compare"
          onClick={fetchPlaylists}
          disabled={!canCompare || loading}
          className="flex items-center gap-2 cursor-pointer"
          style={{
            background: canCompare && !loading ? "#1DB954" : "#282828",
            border: "none",
            borderRadius: "8px",
            padding: "14px 28px",
            color: canCompare && !loading ? "#000000" : "#535353",
            fontSize: "15px",
            fontWeight: 700,
            transition: "background-color 0.2s",
            cursor: canCompare && !loading ? "pointer" : "not-allowed",
            marginBottom: "24px",
          }}
          onMouseEnter={(e) => {
            if (canCompare && !loading)
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1ED760";
          }}
          onMouseLeave={(e) => {
            if (canCompare && !loading)
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1DB954";
          }}
          aria-label="Compare playlists"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <ListMusic size={16} aria-hidden="true" />
          )}
          {loading ? "Fetching playlists…" : "Compare Playlists"}
        </button>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          style={{
            background: "rgba(241, 94, 108, 0.1)",
            border: "1px solid rgba(241, 94, 108, 0.4)",
            borderRadius: "8px",
            padding: "16px",
            color: "#FFFFFF",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle size={20} color="#F15E6C" aria-hidden="true" />
            <span style={{ fontSize: "14px", fontWeight: 500 }}>{error}</span>
          </div>
          {error.includes("expired") && (
            <button
              onClick={() => signIn("spotify")}
              style={{
                background: "#F15E6C",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                color: "#191414",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.9")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
            >
              Log In Again
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {hasResults && (
        <div>
          {/* Radar chart (always shown when data is loaded) */}
          {Object.keys(audioFeatures).length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <VibeRadarChart playlists={radarData()} />
            </div>
          )}

          {/* Re-compare button */}
          <div className="flex items-center gap-3" style={{ marginBottom: "20px" }}>
            <button
              id="btn-recompare"
              onClick={fetchPlaylists}
              disabled={loading}
              className="flex items-center gap-2 cursor-pointer"
              style={{
                background: "transparent",
                border: "1px solid #535353",
                borderRadius: "6px",
                padding: "8px 14px",
                color: "#B3B3B3",
                fontSize: "13px",
                transition: "border-color 0.15s, color 0.15s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#FFFFFF";
                (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#535353";
                (e.currentTarget as HTMLButtonElement).style.color = "#B3B3B3";
              }}
            >
              {loading && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
              Refresh
            </button>
          </div>

          {/* Mode: Artist overlap */}
          {mode === "artists" && (
            <div>
              <p style={{ color: "#B3B3B3", fontSize: "14px", marginBottom: "16px" }}>
                <span style={{ color: "#1DB954", fontWeight: 700 }}>
                  {commonArtists().length}
                </span>{" "}
                artists appear in all {playlists.length} playlists
              </p>
              <div className="flex flex-wrap gap-2">
                {commonArtists().map((artist) => (
                  <span
                    key={artist}
                    style={{
                      background: "#282828",
                      border: "1px solid #535353",
                      borderRadius: "20px",
                      padding: "6px 14px",
                      fontSize: "13px",
                      color: "#FFFFFF",
                    }}
                  >
                    {artist}
                  </span>
                ))}
                {commonArtists().length === 0 && (
                  <p style={{ color: "#B3B3B3", fontSize: "14px" }}>
                    No common artists found across all playlists.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Mode: Tracks (intersection) */}
          {(mode === "intersection") && (
            <div>
              {/* Stats + select controls */}
              <div
                className="flex flex-wrap items-center justify-between gap-3"
                style={{ marginBottom: "16px" }}
              >
                <p style={{ color: "#B3B3B3", fontSize: "14px" }}>
                  <span style={{ color: "#1DB954", fontWeight: 700 }}>
                    {activeTracks.length}
                  </span>{" "}
                  {mode === "intersection"
                    ? `track${activeTracks.length !== 1 ? "s" : ""} in common`
                    : `track${activeTracks.length !== 1 ? "s" : ""}`}
                </p>
                {activeTracks.length > 0 && (
                  <div className="flex gap-3">
                    <button
                      id="btn-select-all"
                      onClick={() => selectAll(activeTracks)}
                      className="cursor-pointer"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#1DB954",
                        fontSize: "13px",
                        fontWeight: 600,
                        padding: 0,
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = "#1ED760";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = "#1DB954";
                      }}
                    >
                      Select all
                    </button>
                    {selectedUris.size > 0 && (
                      <button
                        id="btn-clear-selection"
                        onClick={clearSelection}
                        className="cursor-pointer"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#B3B3B3",
                          fontSize: "13px",
                          padding: 0,
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = "#B3B3B3";
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Track list */}
              <div
                role="grid"
                aria-label="Results track list"
                style={{
                  background: "#181818",
                  borderRadius: "12px",
                  border: "1px solid #282828",
                  overflow: "hidden",
                  maxHeight: "480px",
                  overflowY: "auto",
                }}
              >
                {activeTracks.length === 0 ? (
                  <div
                    style={{
                      padding: "48px 24px",
                      textAlign: "center",
                      color: "#B3B3B3",
                    }}
                  >
                    No songs in common across all playlists.
                  </div>
                ) : (
                  <div style={{ padding: "8px" }}>
                    {activeTracks.map((track, i) => (
                      <TrackRow
                        key={track.id}
                        track={track}
                        index={i}
                        selected={selectedUris.has(track.uri)}
                        onToggleSelect={toggleSelect}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Create playlist panel */}
              {selectedUris.size > 0 && (
                <div
                  style={{
                    background: "#181818",
                    border: "1px solid #1DB954",
                    borderRadius: "12px",
                    padding: "20px",
                    marginTop: "16px",
                  }}
                >
                  {createdUrl ? (
                    <div className="flex items-center gap-3">
                      <CheckCircle2
                        size={20}
                        style={{ color: "#1DB954", flexShrink: 0 }}
                        aria-hidden="true"
                      />
                      <div>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#FFFFFF",
                            margin: 0,
                          }}
                        >
                          Playlist created!
                        </p>
                        <a
                          href={createdUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                          style={{
                            color: "#1DB954",
                            fontSize: "13px",
                            textDecoration: "none",
                          }}
                        >
                          Open in Spotify
                          <ExternalLink size={12} aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#B3B3B3",
                          marginBottom: "12px",
                        }}
                      >
                        Save{" "}
                        <span style={{ color: "#1DB954", fontWeight: 700 }}>
                          {selectedUris.size}
                        </span>{" "}
                        selected track{selectedUris.size !== 1 ? "s" : ""} as a new playlist
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        <input
                          id="playlist-name-input"
                          type="text"
                          value={playlistName}
                          onChange={(e) => setPlaylistName(e.target.value)}
                          aria-label="New playlist name"
                          style={{
                            flex: 1,
                            minWidth: "200px",
                            background: "#282828",
                            border: "1px solid #535353",
                            borderRadius: "6px",
                            padding: "10px 14px",
                            color: "#FFFFFF",
                            fontSize: "14px",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "#1DB954";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "#535353";
                          }}
                        />
                        <button
                          id="btn-create-playlist"
                          onClick={createPlaylist}
                          disabled={creating || !playlistName.trim()}
                          className="flex items-center gap-2 cursor-pointer"
                          style={{
                            background: "#1DB954",
                            border: "none",
                            borderRadius: "6px",
                            padding: "10px 20px",
                            color: "#000000",
                            fontSize: "14px",
                            fontWeight: 700,
                            transition: "background-color 0.2s",
                            cursor: creating ? "wait" : "pointer",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) => {
                            if (!creating)
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                "#1ED760";
                          }}
                          onMouseLeave={(e) => {
                            if (!creating)
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                "#1DB954";
                          }}
                        >
                          {creating ? (
                            <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                          ) : (
                            <ListMusic size={15} aria-hidden="true" />
                          )}
                          {creating ? "Creating…" : "Save to Spotify"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
