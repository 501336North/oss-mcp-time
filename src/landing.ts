const LANDING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>MCP Time Server by One Shot Ship</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e5e5; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { max-width: 640px; padding: 2rem; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #fff; }
    .subtitle { color: #a3a3a3; margin-bottom: 2rem; }
    .brand { color: #f59e0b; font-weight: 600; }
    h2 { font-size: 1.25rem; margin: 1.5rem 0 0.75rem; color: #fff; }
    pre { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 1rem; overflow-x: auto; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem; }
    code { color: #22d3ee; }
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

    <p>A free, hosted MCP server providing accurate time and timezone tools for <strong>Claude Code</strong> — including remote <code>/cowork</code> sessions.</p>

    <h2>Quick Setup</h2>
    <pre><code>claude mcp add --transport http time-server https://oss-mcp-time.onrender.com/mcp</code></pre>

    <p>With timezone hint (recommended):</p>
    <pre><code>claude mcp add --transport http \\
  --header "X-Timezone: America/New_York" \\
  time-server https://oss-mcp-time.onrender.com/mcp</code></pre>

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
</body>
</html>`;

export function getLandingHtml(): string {
  return LANDING_HTML;
}
