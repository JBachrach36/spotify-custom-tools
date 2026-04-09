"use client";

import { useState } from "react";
import { Plus, X, Link2, AlertCircle } from "lucide-react";

interface PlaylistInputProps {
  onPlaylistsChange: (urls: string[]) => void;
}

function isValidSpotifyPlaylistUrl(url: string): boolean {
  return /open\.spotify\.com\/playlist\/[a-zA-Z0-9]+/.test(url);
}

export function PlaylistInput({ onPlaylistsChange }: PlaylistInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [playlists, setPlaylists] = useState<{ url: string; id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addPlaylist = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (!isValidSpotifyPlaylistUrl(trimmed)) {
      setError("Please paste a valid Spotify playlist URL (e.g. open.spotify.com/playlist/...)");
      return;
    }
    if (playlists.find((pl) => pl.url === trimmed)) {
      setError("This playlist has already been added.");
      return;
    }
    if (playlists.length >= 100) {
      setError("Maximum of 100 playlists allowed.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/spotify/playlist-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Spotify Session expired. Please refresh the page and sign in again.");
        }
        throw new Error(data.error ?? "Failed to fetch playlist info.");
      }

      const next = [...playlists, { url: trimmed, id: data.info.id, name: data.info.name }];
      setPlaylists(next);
      onPlaylistsChange(next.map(p => p.url));
      setInputValue("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const removePlaylist = (index: number) => {
    const next = playlists.filter((_, i) => i !== index);
    setPlaylists(next);
    onPlaylistsChange(next.map(p => p.url));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addPlaylist();
  };

  return (
    <section aria-label="Add playlists">
      <h2
        style={{ color: "#FFFFFF", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}
      >
        Add Playlists
      </h2>
      <p style={{ color: "#B3B3B3", fontSize: "14px", marginBottom: "20px" }}>
        Paste Spotify playlist links below. Add 2–100 playlists to compare.
      </p>

      {/* Input row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Link2
            size={16}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#B3B3B3",
            }}
          />
          <input
            id="playlist-url-input"
            type="url"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="https://open.spotify.com/playlist/..."
            aria-label="Paste a Spotify playlist URL"
            style={{
              width: "100%",
              background: "#282828",
              border: error ? "1px solid #F15E6C" : "1px solid #535353",
              borderRadius: "8px",
              padding: "12px 14px 12px 40px",
              color: "#FFFFFF",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              if (!error) e.currentTarget.style.borderColor = "#1DB954";
            }}
            onBlur={(e) => {
              if (!error) e.currentTarget.style.borderColor = "#535353";
            }}
          />
        </div>
        <button
          id="btn-add-playlist"
          onClick={addPlaylist}
          disabled={!inputValue.trim() || loading}
          className="flex items-center gap-2 cursor-pointer"
          aria-label="Add playlist"
          style={{
            background: inputValue.trim() && !loading ? "#1DB954" : "#282828",
            border: "none",
            borderRadius: "8px",
            padding: "12px 20px",
            color: inputValue.trim() && !loading ? "#000000" : "#535353",
            fontSize: "14px",
            fontWeight: 700,
            transition: "background-color 0.2s, color 0.2s",
            cursor: inputValue.trim() && !loading ? "pointer" : "not-allowed",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (inputValue.trim() && !loading)
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1ED760";
          }}
          onMouseLeave={(e) => {
            if (inputValue.trim() && !loading)
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1DB954";
          }}
        >
          {loading ? "Adding..." : (
            <>
              <Plus size={16} aria-hidden="true" />
              Add
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-2 mt-2"
          role="alert"
          style={{ color: "#F15E6C", fontSize: "13px" }}
        >
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </div>
      )}

      {/* Playlist chips */}
      {playlists.length > 0 && (
        <div
          className="flex flex-wrap gap-2 mt-4"
          aria-label={`${playlists.length} playlists added`}
        >
          {playlists.map((pl, i) => {
            return (
              <div
                key={pl.url}
                className="flex items-center gap-2"
                style={{
                  background: "#282828",
                  border: "1px solid #535353",
                  borderRadius: "20px",
                  padding: "6px 12px",
                  fontSize: "13px",
                  color: "#FFFFFF",
                  maxWidth: "280px",
                }}
              >
                <span
                  style={{
                    color: "#1DB954",
                    fontWeight: 700,
                    fontSize: "11px",
                    flexShrink: 0,
                  }}
                >
                  #{i + 1}
                </span>
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "#B3B3B3",
                    fontSize: "12px",
                  }}
                  title={pl.url}
                >
                  {pl.name}
                </span>
                <button
                  onClick={() => removePlaylist(i)}
                  aria-label={`Remove playlist ${i + 1}`}
                  className="flex-shrink-0 cursor-pointer"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#B3B3B3",
                    padding: "0",
                    display: "flex",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#B3B3B3";
                  }}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Count badge */}
      {playlists.length > 0 && (
        <p style={{ color: "#B3B3B3", fontSize: "12px", marginTop: "12px" }}>
          {playlists.length} playlist{playlists.length !== 1 ? "s" : ""} added
          {playlists.length < 2 && (
            <span style={{ color: "#F15E6C" }}> — add at least 1 more to compare</span>
          )}
        </p>
      )}
    </section>
  );
}
