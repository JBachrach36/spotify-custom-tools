"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface PlaylistVibe {
  name: string;
  energy: number;
  danceability: number;
  valence: number;
  acousticness: number;
}

interface VibeRadarChartProps {
  playlists: PlaylistVibe[];
}

const COLORS = [
  "#1DB954",
  "#1DA0F2",
  "#FFD700",
  "#FF6B6B",
  "#A855F7",
  "#F97316",
];

export function VibeRadarChart({ playlists }: VibeRadarChartProps) {
  if (playlists.length === 0) return null;

  // Recharts Radar needs data in [{subject, p1, p2...}] format
  const metrics = ["energy", "danceability", "valence", "acousticness"];
  const labels: Record<string, string> = {
    energy: "Energy",
    danceability: "Dance",
    valence: "Positivity",
    acousticness: "Acoustic",
  };

  const data = metrics.map((metric) => {
    const entry: Record<string, string | number> = { subject: labels[metric] };
    playlists.forEach((pl, i) => {
      entry[`p${i}`] = Math.round((pl[metric as keyof PlaylistVibe] as number) * 100);
    });
    return entry;
  });

  return (
    <div
      style={{
        background: "#181818",
        borderRadius: "12px",
        padding: "24px",
        border: "1px solid #282828",
      }}
      aria-label="Playlist vibe comparison radar chart"
    >
      <h3 style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
        Vibe Check
      </h3>
      <p style={{ color: "#B3B3B3", fontSize: "12px", marginBottom: "20px" }}>
        Audio feature comparison across your playlists
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data}>
          <PolarGrid stroke="#282828" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#B3B3B3", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              background: "#282828",
              border: "1px solid #535353",
              borderRadius: "8px",
              color: "#FFFFFF",
              fontSize: "12px",
            }}
          />
          {playlists.map((pl, i) => (
            <Radar
              key={i}
              name={pl.name}
              dataKey={`p${i}`}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.12}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3 justify-center">
        {playlists.map((pl, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                flexShrink: 0,
                background: COLORS[i % COLORS.length],
              }}
              aria-hidden="true"
            />
            <span style={{ fontSize: "12px", color: "#B3B3B3" }}>{pl.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
