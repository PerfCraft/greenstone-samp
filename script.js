const API_URL = "https://corsproxy.io/?https://api.g-stone.ro/samp/"; // Your SA-MP API

// --- Update Dashboard ---
function updateDashboard() {
    // Check internet
    if (!navigator.onLine) return;

    // Remove old script if exists
    const oldScript = document.getElementById('samp-api');
    if (oldScript) oldScript.remove();

    // Load API dynamically
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
                `Updated: ${new Date().toLocaleTimeString()}`;
        } else {
            document.getElementById('status').textContent = "API error";
        }
    };
    script.onerror = () => {
        document.getElementById('status').textContent = "Failed to load API";
    };

    document.body.appendChild(script);
}

// --- Client-side Page Uptime ---
let seconds = 0;
function updateUptime() {
    seconds++;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    document.getElementById('uptime').textContent =
        `Page Uptime: ${h}h ${m}m ${s}s`;
}

// --- Offline Detection ---
function checkConnection() {
    const offlineDiv = document.getElementById('offline-message');
    const dashboard = document.querySelector('.dashboard');

    if (!navigator.onLine) {
        offlineDiv.style.display = 'flex';
        dashboard.style.display = 'none';
    } else {
        offlineDiv.style.display = 'none';
        dashboard.style.display = 'block';
    }
}

// --- Initial Calls ---
updateDashboard();
updateUptime();
checkConnection();

// --- Intervals ---
setInterval(updateDashboard, 1000);
setInterval(updateUptime, 1000);
window.addEventListener('online', checkConnection);
window.addEventListener('offline', checkConnection);
