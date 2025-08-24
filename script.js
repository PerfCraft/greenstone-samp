const API_URL = "https://api.g-stone.ro/samp/"; // Replace with your actual API URL

function updateDashboard() {
    // Remove old script if exists
    const oldScript = document.getElementById('samp-api');
    if (oldScript) oldScript.remove();

    // Load the API dynamically
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

            document.getElementById('status').textContent =
                `Time: ${new Date().toLocaleTimeString()}`;
        } else {
            document.getElementById('status').textContent = "API error";
        }
    };
    script.onerror = () => {
        document.getElementById('status').textContent = "Failed to load API";
    };

    document.body.appendChild(script);
}

// Refresh every 1 second
updateDashboard();
setInterval(updateDashboard, 1000);

