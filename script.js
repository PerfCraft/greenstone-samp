const API_URL = "https://api.g-stone.ro/samp/"; // Your API returning var api = {...}

function updateDashboard() {
    // Remove old script if exists
    const oldScript = document.getElementById('samp-api');
    if (oldScript) oldScript.remove();

    // Load the API dynamically
    const script = document.createElement('script');
    script.id = 'samp-api';
    script.src = API_URL + "?cache=" + new Date().getTime(); // prevent caching
    script.onload = () => {
        if (typeof api !== 'undefined') {
            document.getElementById('player-count').textContent = api.players;
            document.getElementById('status').textContent =
                `Max Players: ${api.maxplayers} | Updated: ${new Date().toLocaleTimeString()}`;
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
