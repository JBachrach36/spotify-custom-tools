const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');

const clientId = env.match(/SPOTIFY_CLIENT_ID=(.*)/)[1].trim();
const clientSecret = env.match(/SPOTIFY_CLIENT_SECRET=(.*)/)[1].trim();

async function run() {
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });
  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;
  
  const getTracks = async (id) => {
    let next = `https://api.spotify.com/v1/playlists/${id}/items?limit=100`;
    const tracks = [];
    while (next) {
      const res = await fetch(next, { headers: { 'Authorization': 'Bearer ' + token } });
      const data = await res.json();
      if (!data.items) break;
      tracks.push(...data.items);
      next = data.next;
    }
    return tracks;
  };
  
  console.log("Fetching tracks...");
  const p1 = await getTracks('2d0EAYAce2dMKwI20i7BpK');
  const p2 = await getTracks('4qrIVntkSHBhS4pbCN4ZMx');
  
  console.log('P1 track objects returned:', p1.length);
  console.log('P2 track objects returned:', p2.length);
  
  const p1Ids = new Set(p1.filter(t => t.track && t.track.id).map(t => t.track.id));
  const p2Ids = new Set(p2.filter(t => t.track && t.track.id).map(t => t.track.id));
  
  const common = [...p1Ids].filter(id => p2Ids.has(id));
  console.log('Common track IDs:', common.length);
  if (common.length > 0) {
    console.log('First common track:', p1.find(t => t.track && t.track.id === common[0]).track.name);
  } else {
    if (p1Ids.size > 0 && p2Ids.size > 0) {
        console.log('Sample P1 ID:', [...p1Ids][0]);
        console.log('Sample P2 ID:', [...p2Ids][0]);
    } else {
        console.log("One of the playlists returned zero track IDs. Maybe they are empty or private?");
    }
  }
}
run().catch(console.error);
