const API_URL = "https://api.g-stone.ro/samp/";

// Record website start time
const websiteStartTime = new Date();

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

            document.getElementById('status').textContent = `SA-MP Server Time: ${new Date().toLocaleTimeString()}`;
        } else {
            document.getElementById('status').textContent = "API error";
        }
    };
    script.onerror = () => {
        document.getElementById('status').textContent = "Failed to load API";
    };
    document.body.appendChild(script);

    // Website uptime
    const now = new Date();
    const uptimeMs = now - websiteStartTime;

    const hours = Math.floor(uptimeMs / 1000 / 60 / 60);
    const minutes = Math.floor((uptimeMs / 1000 / 60) % 60);
    const seconds = Math.floor((uptimeMs / 1000) % 60);

    const websiteUptimeElem = document.getElementById('website-uptime');
    if (websiteUptimeElem) {
        websiteUptimeElem.textContent = `Website uptime: ${hours}h ${minutes}m ${seconds}s *Note: this is the website uptime, not the GreenStone Server*`;
    }
}

// Initial run
updateDashboard();

// Update every second
setInterval(updateDashboard, 1000);





