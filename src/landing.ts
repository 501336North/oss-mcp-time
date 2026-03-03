const LANDING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>MCP Time Server by One Shot Ship</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e5e5; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { max-width: 680px; padding: 2rem; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #fff; }
    .subtitle { color: #a3a3a3; margin-bottom: 2rem; }
    .brand { color: #f59e0b; font-weight: 600; }
    h2 { font-size: 1.25rem; margin: 1.5rem 0 0.75rem; color: #fff; }
    h3 { font-size: 1rem; margin: 1.25rem 0 0.5rem; color: #d4d4d4; }
    pre { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 1rem; overflow-x: auto; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem; }
    code { color: #22d3ee; }
    p { margin-bottom: 0.75rem; line-height: 1.6; }
    .tab-bar { display: flex; gap: 0; margin-bottom: 0; }
    .tab { padding: 0.5rem 1rem; background: #1a1a1a; border: 1px solid #333; border-bottom: none; border-radius: 8px 8px 0 0; cursor: pointer; color: #a3a3a3; font-size: 0.875rem; font-weight: 500; }
    .tab.active { background: #262626; color: #fff; border-color: #444; }
    .tab-content { display: none; background: #262626; border: 1px solid #444; border-radius: 0 8px 8px 8px; padding: 1.25rem; margin-bottom: 1rem; }
    .tab-content.active { display: block; }
    .note { background: #1a1a0a; border: 1px solid #4a4a0a; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.8rem; color: #d4d48a; margin-bottom: 1rem; }
    .tools { margin: 1rem 0; }
    .tool { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; }
    .tool-name { color: #22d3ee; font-weight: 600; font-family: monospace; }
    .tool-desc { color: #a3a3a3; margin-top: 0.25rem; font-size: 0.875rem; }
    .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #333; color: #737373; font-size: 0.875rem; }
    a { color: #f59e0b; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>MCP Time Server</h1>
    <p class="subtitle">by <a href="https://www.oneshotship.com" class="brand">One Shot Ship</a></p>

    <p>A free, hosted MCP server providing accurate time and timezone tools for <strong>Claude Code</strong>, <strong>Claude Desktop</strong>, and <strong>Cowork</strong>.</p>

    <h2>Setup</h2>

    <div class="tab-bar">
      <div class="tab active" onclick="showTab('code')">Claude Code</div>
      <div class="tab" onclick="showTab('desktop')">Claude Desktop / Cowork</div>
    </div>

    <div id="tab-code" class="tab-content active">
      <p>Run in your terminal:</p>
      <pre><code>claude mcp add --transport http time-server \\
  https://one-shot-ship-api.onrender.com/mcp</code></pre>
      <p>With timezone hint (recommended):</p>
      <pre><code>claude mcp add --transport http \\
  --header "X-Timezone: America/New_York" \\
  time-server https://one-shot-ship-api.onrender.com/mcp</code></pre>
      <p style="font-size:0.85rem; color:#a3a3a3;">Or install as a plugin: <code>/plugin install oss-mcp-time</code></p>
    </div>

    <div id="tab-desktop" class="tab-content">
      <p>Add this to your <code>claude_desktop_config.json</code>:</p>
      <pre><code>{
  "mcpServers": {
    "time-server": {
      "command": "npx",
      "args": ["-y", "mcp-remote",
        "https://one-shot-ship-api.onrender.com/mcp"]
    }
  }
}</code></pre>
      <p style="font-size:0.85rem; color:#a3a3a3;">File location: <code>~/Library/Application Support/Claude/claude_desktop_config.json</code> (macOS) or <code>%APPDATA%\\Claude\\claude_desktop_config.json</code> (Windows)</p>
      <div class="note">Requires <a href="https://nodejs.org">Node.js</a> 18+. The <code>mcp-remote</code> package is downloaded automatically on first use.</div>
      <p>Restart Claude Desktop after saving. Works with Cowork sessions too.</p>
    </div>

    <h2>Available Tools</h2>
    <div class="tools">
      <div class="tool">
        <div class="tool-name">get_current_time</div>
        <div class="tool-desc">Returns current time, date, UTC offset, and DST status for any IANA timezone.</div>
      </div>
      <div class="tool">
        <div class="tool-name">convert_time</div>
        <div class="tool-desc">Converts a time from one timezone to another.</div>
      </div>
    </div>

    <div class="footer">
      <p>Free and open source. Built by <a href="https://www.oneshotship.com">oneshotship.com</a></p>
    </div>
  </div>

  <script>
    function showTab(id) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
      document.getElementById('tab-' + id).classList.add('active');
      event.target.classList.add('active');
    }
  </script>
</body>
</html>`;

export function getLandingHtml(): string {
  return LANDING_HTML;
}
