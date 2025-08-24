const API = "https://corsproxy.io/?https://api.g-stone.ro/samp/";

async function refreshStatus() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    document.getElementById("status").textContent =
      `${data.players ?? 0} / ${data.maxplayers ?? 250} players`;
  } catch (err) {
    document.getElementById("status").textContent = "⚠️ Error fetching data";
  }
}

refreshStatus();
setInterval(refreshStatus, 1000);
