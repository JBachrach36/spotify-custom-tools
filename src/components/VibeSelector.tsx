"use client";

import { useState } from "react";
import { Sliders, Sparkles } from "lucide-react";

export interface VibeFilter {
  energy: [number, number];
  danceability: [number, number];
  valence: [number, number];
  acousticness: [number, number];
}

interface VibeSelectorProps {
  onFilterChange: (filter: VibeFilter) => void;
}

const PRESETS: { label: string; emoji: string; filter: VibeFilter }[] = [
  {
    label: "High Energy",
    emoji: "⚡",
    filter: {
      energy: [0.7, 1],
      danceability: [0.5, 1],
      valence: [0.4, 1],
      acousticness: [0, 0.4],
    },
  },
  {
    label: "Chill & Acoustic",
    emoji: "🌿",
    filter: {
      energy: [0, 0.5],
      danceability: [0, 0.6],
      valence: [0.3, 1],
      acousticness: [0.5, 1],
    },
  },
  {
    label: "Danceable",
    emoji: "💃",
    filter: {
      energy: [0.5, 1],
      danceability: [0.7, 1],
      valence: [0.4, 1],
      acousticness: [0, 0.5],
    },
  },
  {
    label: "Moody / Sad",
    emoji: "🌧",
    filter: {
      energy: [0, 0.55],
      danceability: [0, 0.6],
      valence: [0, 0.4],
      acousticness: [0.3, 1],
    },
  },
  {
    label: "Happy & Upbeat",
    emoji: "☀️",
    filter: {
      energy: [0.5, 1],
      danceability: [0.5, 1],
      valence: [0.65, 1],
      acousticness: [0, 0.6],
    },
  },
];

const DEFAULT_FILTER: VibeFilter = {
  energy: [0, 1],
  danceability: [0, 1],
  valence: [0, 1],
  acousticness: [0, 1],
};

function SliderRow({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  color: string;
}) {
  const pctMin = value[0] * 100;
  const pctMax = value[1] * 100;

  return (
    <div style={{ marginBottom: "14px" }}>
      <div className="flex justify-between" style={{ marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", color: "#B3B3B3" }}>{label}</span>
        <span style={{ fontSize: "12px", color: color, fontWeight: 600 }}>
          {Math.round(pctMin)}% – {Math.round(pctMax)}%
        </span>
      </div>
      {/* Min slider */}
      <div style={{ position: "relative", marginBottom: "4px" }}>
        <div
          aria-hidden="true"
          style={{
            height: "4px",
            borderRadius: "2px",
            background: `linear-gradient(to right, #282828 ${pctMin}%, ${color} ${pctMin}%, ${color} ${pctMax}%, #282828 ${pctMax}%)`,
            marginBottom: "2px",
          }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={pctMin}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value) / 100, value[1]);
            onChange([v, value[1]]);
          }}
          aria-label={`${label} minimum`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            opacity: 0,
            cursor: "pointer",
            height: "100%",
          }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={pctMax}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value) / 100, value[0]);
            onChange([value[0], v]);
          }}
          aria-label={`${label} maximum`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            opacity: 0,
            cursor: "pointer",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}

export function VibeSelector({ onFilterChange }: VibeSelectorProps) {
  const [filter, setFilter] = useState<VibeFilter>(DEFAULT_FILTER);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setFilter(preset.filter);
    setSelectedPreset(preset.label);
    onFilterChange(preset.filter);
  };

  const updateFilter = (key: keyof VibeFilter, value: [number, number]) => {
    const next = { ...filter, [key]: value };
    setFilter(next);
    setSelectedPreset(null);
    onFilterChange(next);
  };

  const resetFilter = () => {
    setFilter(DEFAULT_FILTER);
    setSelectedPreset(null);
    onFilterChange(DEFAULT_FILTER);
  };

  return (
    <div
      style={{
        background: "#181818",
        borderRadius: "12px",
        border: "1px solid #282828",
        overflow: "hidden",
      }}
    >
      {/* Header / Toggle */}
      <button
        id="btn-toggle-vibe-filter"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between cursor-pointer"
        style={{
          padding: "18px 20px",
          background: "transparent",
          border: "none",
          color: "#FFFFFF",
          textAlign: "left",
        }}
        aria-expanded={isOpen}
        aria-controls="vibe-filter-panel"
      >
        <div className="flex items-center gap-3">
          <Sliders size={18} style={{ color: "#1DB954" }} aria-hidden="true" />
          <div>
            <p style={{ fontWeight: 700, fontSize: "15px", margin: 0 }}>
              Vibe Filter
            </p>
            {selectedPreset && (
              <p style={{ fontSize: "12px", color: "#1DB954", margin: 0 }}>
                {selectedPreset}
              </p>
            )}
          </div>
        </div>
        <span
          style={{
            color: "#B3B3B3",
            fontSize: "12px",
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            display: "inline-block",
          }}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {/* Collapsible panel */}
      {isOpen && (
        <div
          id="vibe-filter-panel"
          style={{ padding: "0 20px 20px" }}
        >
          {/* Presets */}
          <div style={{ marginBottom: "20px" }}>
            <p
              style={{
                fontSize: "11px",
                color: "#B3B3B3",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              Quick Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  id={`btn-preset-${preset.label.replace(/\s+/g, "-").toLowerCase()}`}
                  onClick={() => applyPreset(preset)}
                  className="cursor-pointer"
                  style={{
                    background:
                      selectedPreset === preset.label
                        ? "rgba(29, 185, 84, 0.15)"
                        : "#282828",
                    border:
                      selectedPreset === preset.label
                        ? "1px solid #1DB954"
                        : "1px solid #535353",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    color:
                      selectedPreset === preset.label ? "#1DB954" : "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: selectedPreset === preset.label ? 700 : 400,
                    transition: "all 0.15s",
                  }}
                  aria-pressed={selectedPreset === preset.label}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Manual sliders */}
          <div>
            <p
              style={{
                fontSize: "11px",
                color: "#B3B3B3",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              Fine-Tune
            </p>
            <SliderRow
              label="Energy"
              value={filter.energy}
              onChange={(v) => updateFilter("energy", v)}
              color="#1DB954"
            />
            <SliderRow
              label="Danceability"
              value={filter.danceability}
              onChange={(v) => updateFilter("danceability", v)}
              color="#1DA0F2"
            />
            <SliderRow
              label="Positivity (Valence)"
              value={filter.valence}
              onChange={(v) => updateFilter("valence", v)}
              color="#FFD700"
            />
            <SliderRow
              label="Acousticness"
              value={filter.acousticness}
              onChange={(v) => updateFilter("acousticness", v)}
              color="#A855F7"
            />
          </div>

          <button
            id="btn-reset-vibe"
            onClick={resetFilter}
            className="cursor-pointer"
            style={{
              background: "transparent",
              border: "none",
              color: "#B3B3B3",
              fontSize: "12px",
              padding: 0,
              marginTop: "4px",
              textDecoration: "underline",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#B3B3B3";
            }}
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
