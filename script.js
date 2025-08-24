const API = "/.netlify/functions/samp-proxy"; // Netlify function

async function fetchPlayers() {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Failed to fetch API");
        const api = await res.json();

        // Update stats
        document.getElementById('player-count').textContent = api.players;
        document.getElementById('max-players').textContent = api.maxplayers;
        document.getElementById('status').textContent = `Updated: ${new Date().toLocaleTimeString()}`;

        // Update player list
        const playersDiv = document.getElementById('players');
        playersDiv.innerHTML = "";

        if (api.players === 0) {
            playersDiv.innerHTML = "<p>No players online.</p>";
        } else {
            // If API provides real player names, replace fake names below
            for (let i = 1; i <= api.players; i++) {
                const card = document.createElement('div');
                card.className = 'player-card';
                card.innerHTML = `<strong>Player ${i}</strong><span>Online</span>`;
                playersDiv.appendChild(card);
            }
        }
    } catch (error) {
        const playersDiv = document.getElementById('players');
        const statusDiv = document.getElementById('status');
        playersDiv.innerHTML = "<p>Error fetching players.</p>";
        statusDiv.textContent = error.message;
        console.error(error);
    }
}

// Refresh every 5 seconds
fetchPlayers();
setInterval(fetchPlayers, 5000);
