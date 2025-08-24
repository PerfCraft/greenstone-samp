# SA-MP Players (Auto-Refresh 1s)

Static webpage that fetches `https://api.g-stone.ro/samp/` and shows `players / maxplayers`.  
Refresh rate: **1 second**.

## Run locally
Just open `index.html` in your browser.
(If your browser blocks CORS for file://, serve it:)
```bash
# python
python -m http.server 8080
# or Node
npx serve
