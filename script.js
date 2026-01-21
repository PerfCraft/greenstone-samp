const GS_API_URL = "https://api.g-stone.ro/samp/";
const STORAGE_KEY = 'greenstone_player_history';

// Store player count history (last 24 hours) - one entry per hour
let playerHistory = [];

// Initialize Chart
let playerChart;

// Load history from localStorage
function loadHistory() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            // Validate and clean old data (older than 24 hours)
            const now = Date.now();
            playerHistory = data.filter(entry => {
                return (now - entry.timestamp) < 24 * 60 * 60 * 1000; // 24 hours
            });
        }
    } catch (e) {
        console.error('Error loading history:', e);
        playerHistory = [];
    }
}

// Save history to localStorage
function saveHistory() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(playerHistory));
    } catch (e) {
        console.error('Error saving history:', e);
    }
}

// Add or update player count for current hour
function addPlayerCount(count) {
    const now = new Date();
    const currentHourTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0).getTime();
    
    // Check if we already have an entry for this hour
    const existingIndex = playerHistory.findIndex(entry => entry.timestamp === currentHourTimestamp);
    
    if (existingIndex >= 0) {
        // Update existing hour
        playerHistory[existingIndex].count = count;
    } else {
        // Add new hour
        playerHistory.push({
            timestamp: currentHourTimestamp,
            count: count
        });
        
        // Keep only last 24 hours
        const cutoff = Date.now() - (24 * 60 * 60 * 1000);
        playerHistory = playerHistory.filter(entry => entry.timestamp >= cutoff);
    }
    
    saveHistory();
}

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
    
    // Load initial data
    updateChartFromHistory();
}

function updateChartFromHistory() {
    if (!playerChart) return;
    
    const now = new Date();
    const chartData = new Array(24).fill(0);
    
    // Fill chart with data from history
    for (let i = 0; i < 24; i++) {
        const hourTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - (23 - i), 0, 0, 0).getTime();
        
        const entry = playerHistory.find(e => e.timestamp === hourTimestamp);
        if (entry) {
            chartData[i] = entry.count;
        }
    }
    
    playerChart.data.datasets[0].data = chartData;
    playerChart.update('none');
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
            
            // Add player count to history and update chart
            addPlayerCount(playerCount);
            updateChartFromHistory();
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
loadHistory();
updateDateTime();
initChart();
updateDashboard();

// Refresh date/time every second
setInterval(updateDateTime, 1000);

// Refresh dashboard every 5 seconds
setInterval(updateDashboard, 5000);
