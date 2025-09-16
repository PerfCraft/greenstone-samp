const GS_API_URL = "https://api.g-stone.ro/samp/";
const GM_API_URL = "https://api.gamemonitoring.net/servers/9337618/players?limit=100";

// === GREENSTONE: Count + Progress ===
function updateGreenStone() {
    const oldScript = document.getElementById('samp-api');
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.id = 'samp-api';
    script.src = GS_API_URL + "?cache=" + new Date().getTime();
    script.onload = () => {
        if (typeof api !== 'undefined') {
            const playerCount = api.players;
            const maxPlayers = api.maxplayers;

            document.getElementById('player-count').textContent = playerCount;
            document.getElementById('max-players').textContent = maxPlayers;

            const progress = Math.min((playerCount / maxPlayers) * 100, 100);
            document.getElementById('progress-fill').style.width = progress + "%";

            document.getElementById('status').textContent = "SA-MP Server Online";
        } else {
            document.getElementById('status').textContent = "API error";
        }
    };
    script.onerror = () => {
        document.getElementById('status').textContent = "Failed to load API";
    };

    document.body.appendChild(script);
}

// === GAMEMONITORING: Names ===
async function updateGameMonitoring() {
    try {
        const res = await fetch(GM_API_URL);
        const data = await res.json();
        const players = data.response?.items || [];

        const avatarUrl = "image.png"; // CJ avatar
        const playerListDiv = document.getElementById("player-names");

        if (players.length === 0) {
            playerListDiv.innerHTML = "<p>No players online</p>";
        } else {
            playerListDiv.innerHTML = players.map(p => `
                <div class="player-card">
                    <img src="${avatarUrl}" class="avatar" alt="">
                    <span class="player-name">${p.name}</span>
                </div>
            `).join("");
        }
    } catch (err) {
        document.getElementById("player-names").innerHTML = "<p>Failed to load players</p>";
        console.error("GameMonitoring API error:", err);
    }
}

// Run both
function updateAll() {
    updateGreenStone();
    updateGameMonitoring();
}

updateAll();
setInterval(updateAll, 15000);
