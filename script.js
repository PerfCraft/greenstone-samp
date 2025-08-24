function renderDashboard() {
    const playersDiv = document.getElementById('players');

    // Update stats
    document.getElementById('player-count').textContent = api.players;
    document.getElementById('max-players').textContent = api.maxplayers;
    document.getElementById('status').textContent = `Updated: ${new Date().toLocaleTimeString()}`;

    // Render player cards
    playersDiv.innerHTML = "";
    if (!api.playerNames || api.playerNames.length === 0) {
        playersDiv.innerHTML = "<p>No players online.</p>";
    } else {
        api.playerNames.forEach(name => {
            const card = document.createElement('div');
            card.className = 'player-card';
            card.innerHTML = `<strong>${name}</strong><span>Online</span>`;
            playersDiv.appendChild(card);
        });
    }
}

// Initial render
renderDashboard();
