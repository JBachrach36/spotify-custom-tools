"use client";

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

interface TrackRowProps {
  track: Track;
  index: number;
  selected?: boolean;
  onToggleSelect?: (uri: string) => void;
  audioFeatures?: {
    energy?: number;
    valence?: number;
    danceability?: number;
    acousticness?: number;
  };
}

function formatDuration(ms: number): string {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

function FeaturePill({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const pct = Math.round(value * 100);
  return (
    <div
      title={`${label}: ${pct}%`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
      }}
    >
      <div
        style={{
          width: "28px",
          height: "4px",
          borderRadius: "2px",
          background: "#282828",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            transition: "width 0.5s ease",
          }}
        />
      </div>
      <span style={{ fontSize: "9px", color: "#B3B3B3", letterSpacing: "0.05em" }}>
        {label.slice(0, 3).toUpperCase()}
      </span>
    </div>
  );
}

export function TrackRow({
  track,
  index,
  selected,
  onToggleSelect,
  audioFeatures,
}: TrackRowProps) {
  const albumArt = track.album?.images?.find((img) => img.width <= 64) ??
    track.album?.images?.[track.album.images.length - 1];
  const artistNames = track.artists?.map((a) => a.name).join(", ") ?? "Unknown Artist";

  return (
    <div
      role="row"
      aria-selected={selected}
      onClick={() => onToggleSelect?.(track.uri)}
      className="group flex items-center gap-4"
      style={{
        padding: "8px 12px",
        borderRadius: "6px",
        background: selected ? "rgba(29, 185, 84, 0.12)" : "transparent",
        border: selected ? "1px solid rgba(29, 185, 84, 0.3)" : "1px solid transparent",
        cursor: onToggleSelect ? "pointer" : "default",
        transition: "background 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!selected)
          (e.currentTarget as HTMLDivElement).style.background = "#282828";
      }}
      onMouseLeave={(e) => {
        if (!selected)
          (e.currentTarget as HTMLDivElement).style.background = "transparent";
      }}
    >
      {/* Track number */}
      <span
        style={{
          width: "20px",
          flexShrink: 0,
          textAlign: "right",
          fontSize: "13px",
          color: "#B3B3B3",
        }}
        aria-hidden="true"
      >
        {index + 1}
      </span>

      {/* Album art — 4px radius per Spotify guidelines */}
      {albumArt ? (
        <img
          src={albumArt.url}
          alt={`Album art for ${track.album?.name ?? "unknown album"}`}
          width={40}
          height={40}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "4px",
            flexShrink: 0,
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          aria-label="No album art"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "4px",
            background: "#282828",
            flexShrink: 0,
          }}
        />
      )}

      {/* Title + Artist */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: selected ? "#1DB954" : "#FFFFFF",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            transition: "color 0.15s",
          }}
        >
          {track.name}
          {track.explicit && (
            <span
              aria-label="Explicit"
              style={{
                display: "inline-block",
                marginLeft: "6px",
                fontSize: "9px",
                fontWeight: 700,
                color: "#B3B3B3",
                border: "1px solid #B3B3B3",
                borderRadius: "2px",
                padding: "0 3px",
                verticalAlign: "middle",
                lineHeight: "14px",
              }}
            >
              E
            </span>
          )}
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "#B3B3B3",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {artistNames}
        </p>
      </div>

      {/* Audio feature mini-bars */}
      {audioFeatures && (
        <div className="hidden md:flex items-center gap-3" aria-hidden="true">
          {audioFeatures.energy !== undefined && (
            <FeaturePill label="Energy" value={audioFeatures.energy} color="#1DB954" />
          )}
          {audioFeatures.danceability !== undefined && (
            <FeaturePill label="Dance" value={audioFeatures.danceability} color="#1DA0F2" />
          )}
          {audioFeatures.valence !== undefined && (
            <FeaturePill label="Valence" value={audioFeatures.valence} color="#FFD700" />
          )}
        </div>
      )}

      {/* Duration */}
      <span
        style={{
          fontSize: "13px",
          color: "#B3B3B3",
          flexShrink: 0,
          minWidth: "36px",
          textAlign: "right",
        }}
        aria-label={`Duration: ${formatDuration(track.duration_ms)}`}
      >
        {formatDuration(track.duration_ms)}
      </span>
    </div>
  );
}
