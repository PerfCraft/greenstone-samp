function updatePlayers() {
    if (typeof api !== 'undefined') {
        const playersDiv = document.getElementById('players');
        const statusDiv = document.getElementById('status');

        playersDiv.innerHTML = `<p>${api.players} players online</p>`;
        statusDiv.textContent = `Max players: ${api.maxplayers}`;
    } else {
        document.getElementById('players').innerHTML = "<p>Loading...</p>";
    }
}

function loadAPI() {
    // Remove old script if exists
    const oldScript = document.getElementById('samp-api-script');
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.id = 'samp-api-script';
    script.src = "https://api.g-stone.ro/samp/"; // URL returning var api
    script.onload = () => {
        updatePlayers();
        // Refresh every 5 seconds
        setTimeout(loadAPI, 5000);
    };
    script.onerror = () => {
        document.getElementById('players').innerHTML = "<p>Error loading players.</p>";
        document.getElementById('status').textContent = "";
    };
    document.body.appendChild(script);
}

// Start loading
loadAPI();
