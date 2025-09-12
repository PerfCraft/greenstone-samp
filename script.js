const API_URL = "https://api.-stone.ro/samp/";

function updateDashboard() {

    // Remove old SA-MP API script
    const oldScript = document.getElementById('samp-api');
    if (oldScript) oldScript.remove();

    // Load SA-MP API
    const script = document.createElement('script');
    script.id = 'samp-api';
    script.src = API_URL + "?cache=" + new Date().getTime();
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

// Initial run
updateDashboard();

// Update every second
setInterval(updateDashboard, 1000);

