# PlaylistVibe for Spotify 🎵

PlaylistVibe is a local Next.js utility that lets you compare Spotify playlists to find common songs, find artist overlap, and filter existing songs by their specific vibes (energy, danceability, valence, acousticness) to create highly curated mixes. 

## Features

- **Common Songs** 🔀: Input up to 100 Spotify playlists and instantly see exactly which songs appear in all of them.
- **Vibe Filter** ⚡: Analyze the exact audio features (Energy, Positivity, Danceability, Acousticness) of songs, and filter them using a visual radar chart and manual dual-slice sliders (e.g., find all high-energy and high-danceability common tracks). 
- **Artist Overlap** 👥: Quickly discover matching artists across playlists, even if the exact tracks don't overlap.
- **Export Mixes**: Save the final curated tracks natively back to your Spotify account as a new playlist.

## Setup Instructions

This project uses Next.js with `next-auth` to interact directly with the Spotify Web API.

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Register your app on Spotify**:
   - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create a new project.
   - For Redirect URI, enter: `http://localhost:3000/api/auth/callback/spotify`
4. **Environment Variables**: Create a `.env.local` file in the root directory:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=a_random_secure_string
   ```
5. **Run the dev server**:
   `npm run dev`
6. Open `http://localhost:3000` in your browser. 

## Privacy & Security

All interactions with Spotify happen directly via NextAuth. Your Spotify credentials are required locally but never stored externally. Ensure `.env.local` remains out of version control and in the provided `.gitignore`.

Built with Next.js 16, Tailwind CSS v4, and Recharts. Designed loosely based on the [Spotify Design Guidelines](https://developer.spotify.com/documentation/design).
