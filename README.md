# Spotify Custom Tools

A powerful, local Spotify utility application that allows users to compare multiple playlists (up to 100) and perform complex analytical operations. Designed for data-driven music curation, it can identify common songs across playlists and export these insights directly into a new playlist.

## Features

- **Advanced Playlist Comparison**: Compare up to 100 playlists to find intersections and unique tracks.
- **Analytical Operations**: Identify common songs and analyze listening patterns.
- **Playlist Export**: Seamlessly export your generated and filtered song lists into new Spotify playlists.
- **Black-and-Green UI**: A cohesive, premium design system inspired by Spotify.

## Getting Started

### Prerequisites

You will need a Spotify Developer account and an active application to get your API keys.

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2. Create an application.
3. Retrieve your **Client ID** and **Client Secret**.
4. Set the Redirect URI in your application settings to `http://localhost:3000/api/auth/callback/spotify`.

### Environment Setup

Create a `.env.local` file in the root of the project to store your secret keys. **Never commit this file to public repositories.**

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_secure_string
```

### Installation

Install the required dependencies:

```bash
npm install
# or yarn install / pnpm install
```

### Running the App

Start the development server:

```bash
npm run dev
# or yarn dev / pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application running.
