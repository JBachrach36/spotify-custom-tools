"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut, Music2 } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav
      style={{ background: "#000000", borderBottom: "1px solid #282828" }}
      className="sticky top-0 z-50 w-full"
      aria-label="Primary navigation"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <Music2
            size={28}
            style={{ color: "#1DB954" }}
            aria-hidden="true"
            strokeWidth={2}
          />
          <span className="text-white font-bold text-xl tracking-tight">
            PlaylistVibe
          </span>
          <span
            style={{
              color: "#B3B3B3",
              fontSize: "11px",
              border: "1px solid #282828",
              borderRadius: "4px",
              padding: "1px 6px",
              marginLeft: "2px",
            }}
          >
            for Spotify
          </span>
        </div>

        {/* Auth Controls */}
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                border: "2px solid #282828",
                borderTopColor: "#1DB954",
                animation: "spin 0.8s linear infinite",
              }}
              aria-label="Loading"
            />
          ) : session ? (
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "User avatar"}
                  width={32}
                  height={32}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              )}
              <span style={{ color: "#B3B3B3", fontSize: "14px" }}>
                {session.user?.name}
              </span>
              <button
                id="btn-sign-out"
                onClick={() => signOut()}
                className="flex items-center gap-2 cursor-pointer"
                style={{
                  background: "transparent",
                  border: "1px solid #535353",
                  borderRadius: "20px",
                  padding: "6px 14px",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#535353";
                }}
                aria-label="Sign out of Spotify"
              >
                <LogOut size={14} aria-hidden="true" />
                Log out
              </button>
            </div>
          ) : (
            <button
              id="btn-sign-in"
              onClick={() => signIn("spotify")}
              className="flex items-center gap-2 cursor-pointer"
              style={{
                background: "#1DB954",
                border: "none",
                borderRadius: "20px",
                padding: "8px 20px",
                color: "#000000",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.02em",
                transition: "background-color 0.2s, transform 0.1s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1ED760";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1DB954";
              }}
              aria-label="Log in with Spotify"
            >
              <LogIn size={16} aria-hidden="true" />
              Log in with Spotify
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </nav>
  );
}
