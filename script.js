const GS_API_URL = "https://api.g-stone.ro/samp/";

// Store player count history (last 24 hours) - one entry per hour
let playerHistory = new Array(24).fill(null);
let lastUpdateHour = -1;

// Initialize Chart
let playerChart;

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('datetime').textContent = now.toLocaleDateString('ro-RO', options);
}

function initChart() {
    const ctx = document.getElementById('playerChart').getContext('2d');
    
    // Generate labels for last 24 hours
    const labels = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now - i * 60 * 60 * 1000);
        labels.push(time.getHours() + ':00');
    }
    
    playerChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jucători Online',
                data: new Array(24).fill(0),
                borderColor: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#fff',
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#fff',
                        font: {
                            size: 14,
                            family: 'Inter'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 250,
                    beginAtZero: true,
                    ticks: {
                        color: '#fff',
                        stepSize: 25
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            animation: {
                duration: 750
            }
        }
    });
}

function updateChart(playerCount) {
    if (!playerChart) return;
    
    const now = new Date();
    const currentHour = now.getHours();
    
    // Only update the history when we enter a new hour
    if (currentHour !== lastUpdateHour) {
        // Shift all data to the left (remove oldest hour)
        playerHistory.shift();
        // Add new hour data at the end
        playerHistory.push(playerCount);
        lastUpdateHour = currentHour;
    } else {
        // Update current hour data (last position)
        playerHistory[playerHistory.length - 1] = playerCount;
    }
    
    // Update chart with actual history (fill nulls with 0 for display)
    const displayData = playerHistory.map(val => val === null ? 0 : val);
    playerChart.data.datasets[0].data = displayData;
    
    playerChart.update('none'); // Update without animation to prevent shifting
}

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
            
            // Update chart with current player count
            updateChart(playerCount);
        } else {
            document.getElementById('status').textContent = "API error";
        }
    };
    script.onerror = () => {
        document.getElementById('status').textContent = "Failed to load API";
    };

    document.body.appendChild(script);
}

// Initial load
updateDateTime();
initChart();
updateDashboard();

// Refresh date/time every second
setInterval(updateDateTime, 1000);

// Refresh dashboard every 5 seconds
setInterval(updateDashboard, 5000);

// Update chart every hour (for real hourly data points)
setInterval(() => {
    updateDashboard(); // This will also update the chart
}, 3600000); // 1 hour in milliseconds
