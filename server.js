const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Proxy endpoint for players
app.get("/api/players", async (req, res) => {
  try {
    const r = await fetch("https://api.g-stone.ro/samp/");
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ players: 0, maxplayers: 250 });
  }
});

app.listen(PORT, () => {
  console.log(`✅ SA-MP status running on http://localhost:${PORT}`);
});
