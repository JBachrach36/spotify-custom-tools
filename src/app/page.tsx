"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { PlaylistInput } from "@/components/PlaylistInput";
import { ComparisonEngine } from "@/components/ComparisonEngine";
import { LogIn, Music2, GitMerge, Zap, Users } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [playlistUrls, setPlaylistUrls] = useState<string[]>([]);

  return (
    <div style={{ minHeight: "100vh", background: "#191414" }}>
      <Navbar />

      <main
        id="main"
        style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 80px" }}
      >
        {/* ── Not logged in ── */}
        {status !== "loading" && !session && (
          <div>
            {/* Hero */}
            <div style={{ textAlign: "center", marginBottom: "64px", paddingTop: "24px" }}>
              <div
                className="flex justify-center"
                style={{ marginBottom: "20px" }}
                aria-hidden="true"
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "rgba(29,185,84,0.12)",
                    border: "1px solid rgba(29,185,84,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Music2 size={36} style={{ color: "#1DB954" }} />
                </div>
              </div>
              <h1
                style={{
                  fontSize: "clamp(32px, 5vw, 52px)",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  lineHeight: 1.1,
                  margin: "0 0 16px",
                  letterSpacing: "-0.02em",
                }}
              >
                Compare, Filter &amp;{" "}
                <span style={{ color: "#1DB954" }}>Vibe</span>
                <br />
                Your Playlists
              </h1>
              <p
                style={{
                  fontSize: "18px",
                  color: "#B3B3B3",
                  maxWidth: "480px",
                  margin: "0 auto 32px",
                  lineHeight: 1.6,
                }}
              >
                Paste any Spotify playlists, find shared songs, discover artist
                overlaps, and generate new mixes tuned to exactly your vibe.
              </p>
              <button
                id="btn-hero-login"
                onClick={() => signIn("spotify")}
                className="inline-flex items-center gap-3 cursor-pointer"
                style={{
                  background: "#1DB954",
                  border: "none",
                  borderRadius: "32px",
                  padding: "16px 36px",
                  color: "#000000",
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  transition: "background-color 0.2s, transform 0.1s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1ED760";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1DB954";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
                aria-label="Log in with Spotify to get started"
              >
                <LogIn size={18} aria-hidden="true" />
                Log in with Spotify
              </button>
            </div>

            {/* Feature cards */}
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
              aria-label="Feature highlights"
            >
              {[
                {
                  Icon: GitMerge,
                  title: "Common Songs",
                  desc: "Find every track that appears across all your selected playlists at once.",
                  color: "#1DB954",
                },
                {
                  Icon: Zap,
                  title: "Vibe Filter",
                  desc: "Dial in energy, danceability, positivity, and acousticness to build the perfect mix.",
                  color: "#FFD700",
                },
                {
                  Icon: Users,
                  title: "Artist Overlap",
                  desc: "Discover which artists are consistently loved across all your playlists.",
                  color: "#1DA0F2",
                },
              ].map(({ Icon, title, desc, color }) => (
                <button
                  key={title}
                  onClick={() => signIn("spotify")}
                  style={{
                    background: "#181818",
                    border: "1px solid #282828",
                    borderRadius: "12px",
                    padding: "24px",
                    transition: "border-color 0.2s, transform 0.2s",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "block",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#535353";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#282828";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: `rgba(${
                        color === "#1DB954"
                          ? "29,185,84"
                          : color === "#FFD700"
                          ? "255,215,0"
                          : "29,160,242"
                      }, 0.12)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                    aria-hidden="true"
                  >
                    <Icon size={20} style={{ color }} />
                  </div>
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#FFFFFF",
                      margin: "0 0 8px",
                    }}
                  >
                    {title}
                  </h2>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#B3B3B3",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {status === "loading" && (
          <div
            className="flex justify-center items-center"
            style={{ height: "40vh" }}
            aria-label="Loading"
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "3px solid #282828",
                borderTopColor: "#1DB954",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── Logged in app ── */}
        {session && (
          <div>
            {/* Welcome */}
            <div style={{ marginBottom: "36px" }}>
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  margin: "0 0 6px",
                  letterSpacing: "-0.01em",
                }}
              >
                PlaylistVibe
              </h1>
              <p style={{ color: "#B3B3B3", fontSize: "14px", margin: 0 }}>
                Add playlists below, then compare, filter, and save your mix.
              </p>
            </div>

            {/* Divider */}
            <div
              style={{
                borderBottom: "1px solid #282828",
                marginBottom: "36px",
              }}
              aria-hidden="true"
            />

            {/* Playlist input */}
            <div style={{ marginBottom: "40px" }}>
              <PlaylistInput onPlaylistsChange={setPlaylistUrls} />
            </div>

            {/* Comparison engine */}
            {playlistUrls.length >= 1 && (
              <>
                <div
                  style={{
                    borderBottom: "1px solid #282828",
                    marginBottom: "36px",
                  }}
                  aria-hidden="true"
                />
                <ComparisonEngine playlistUrls={playlistUrls} />
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer attribution per Spotify guidelines */}
      <footer
        style={{
          borderTop: "1px solid #282828",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#B3B3B3", fontSize: "12px" }}>
          PlaylistVibe uses the{" "}
          <a
            href="https://developer.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1DB954", textDecoration: "none" }}
          >
            Spotify Web API
          </a>
          . All music data is provided by and attributed to Spotify.
        </p>
      </footer>
    </div>
  );
}
