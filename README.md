# MCP Time Server

**by [One Shot Ship](https://www.oneshotship.com)**

A free, hosted MCP server providing accurate time and timezone tools for Claude Code, Claude Desktop, and Cowork.

## Setup

### Claude Code

```bash
claude mcp add time-server https://one-shot-ship-api.onrender.com/mcp --transport http
```

With timezone hint (recommended):

```bash
claude mcp add time-server https://one-shot-ship-api.onrender.com/mcp \
  --transport http \
  --header "X-Timezone: America/New_York"
```

Or install as a plugin:

```
/plugin install oss-mcp-time
```

### Claude Desktop / Cowork

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "time-server": {
      "command": "npx",
      "args": ["-y", "mcp-remote",
        "https://one-shot-ship-api.onrender.com/mcp"]
    }
  }
}
```

**Config file location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

> Requires [Node.js](https://nodejs.org) 18+. The `mcp-remote` package is downloaded automatically on first use.

Restart Claude Desktop after saving. Works with Cowork sessions too.

Replace `America/New_York` with your [IANA timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

## Available Tools

### `get_current_time`

Returns current time, date, UTC offset, and DST status for any IANA timezone.

**Parameters:**
| Parameter | Required | Description |
|-----------|----------|-------------|
| `timezone` | Yes | IANA timezone string (e.g., `America/New_York`) |

**Example response:**
```json
{
  "datetime": "2026-03-02T14:30:00",
  "timezone": "America/New_York",
  "utc_offset": "-05:00",
  "is_dst": false
}
```

### `convert_time`

Converts a time from one timezone to another.

**Parameters:**
| Parameter | Required | Description |
|-----------|----------|-------------|
| `source_timezone` | Yes | Source IANA timezone |
| `time` | Yes | Time in HH:MM format |
| `target_timezone` | Yes | Target IANA timezone |
| `date` | No | Date in YYYY-MM-DD format (defaults to today) |

**Example response:**
```json
{
  "source": "14:00",
  "target": "19:00",
  "source_timezone": "America/New_York",
  "target_timezone": "Europe/London",
  "utc_offset_source": "-05:00",
  "utc_offset_target": "+00:00"
}
```

## Why?

Claude Code `/cowork` (remote) sessions run on Anthropic's infrastructure, not your machine. Local MCP servers like `mcp-server-time` aren't accessible. This hosted server solves that.

## Self-Hosting

```bash
git clone https://github.com/501336North/oss-mcp-time.git
cd oss-mcp-time
npm install
npm run build
npm start
```

## License

MIT
