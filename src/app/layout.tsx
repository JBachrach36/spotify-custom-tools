import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "PlaylistVibe",
  description: "Compare playlists and generate vibe mixes for Spotify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: "#191414", color: "#FFFFFF" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
