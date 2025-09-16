const GS_API_URL = "https://api.g-stone.ro/samp/";
const GM_API_URL = "https://api.gamemonitoring.net/servers/9337618/players?limit=100";

function updateDashboard() {
    // Remove old GS API script
    const oldScript = document.getElementById('samp-api');
    if (oldScript) oldScript.remove();

    // Load GS API (GreenStone)
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

async function updatePlayerList() {
    try {
        const res = await fetch(GM_API_URL);
        const data = await res.json();

        const players = data?.response?.items || [];
        const list = document.getElementById('players');
        list.innerHTML = "";

        if (players.length === 0) {
            list.innerHTML = "<li>No players online</li>";
        } else {
            players.forEach(p => {
                const li = document.createElement('li');
                li.innerHTML = `<img src="image.png" alt="icon"> ${p.name}`;
                list.appendChild(li);
            });
        }
    } catch (err) {
        console.error("Error fetching players:", err);
        document.getElementById('players').innerHTML = "<li>Failed to load players</li>";
    }
}

// Initial load
updateDashboard();
updatePlayerList();

// Refresh
setInterval(updateDashboard, 5000);
setInterval(updatePlayerList, 10000);
