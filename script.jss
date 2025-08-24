const API = "https://corsproxy.io/?https://api.g-stone.ro/samp/";

async function fetchPlayers() {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        const playersDiv = document.getElementById('players');
        const statusDiv = document.getElementById('status');

        if (data && data.players) {
            if (data.players.length === 0) {
                playersDiv.innerHTML = "<p>No players online.</p>";
            } else {
                playersDiv.innerHTML = data.players.map(p => `<div class="player">${p.name}</div>`).join('');
            }
            statusDiv.textContent = `Updated: ${new Date().toLocaleTimeString()} | ${data.players.length}/250 players`;
        } else {
            playersDiv.innerHTML = "<p>Server data unavailable.</p>";
            statusDiv.textContent = "";
        }
    } catch (error) {
        document.getElementById('players').innerHTML = "<p>Error fetching players.</p>";
        document.getElementById('status').textContent = error.message;
        console.error(error);
    }
}

// Refresh every second
fetchPlayers();
setInterval(fetchPlayers, 1000);
