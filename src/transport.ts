import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { getLandingHtml } from './landing.js';
import { createMcpServer } from './server.js';

export function createApp(): express.Express {
  const app = express();
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/', (_req, res) => {
    res.type('html').send(getLandingHtml());
  });

  app.post('/mcp', async (req, res) => {
    // Ensure Accept header includes text/event-stream so the SDK doesn't reject
    // older clients (e.g. Claude Desktop) that omit it.
    // Must patch raw headers since the SDK converts to Web Standard Request.
    const accept = req.headers['accept'] || '';
    if (!accept.includes('text/event-stream')) {
      const raw = (req as any).rawHeaders as string[] | undefined;
      if (raw) {
        const idx = raw.findIndex((h: string) => h.toLowerCase() === 'accept');
        if (idx >= 0) {
          raw[idx + 1] = 'application/json, text/event-stream';
        } else {
          raw.push('Accept', 'application/json, text/event-stream');
        }
      }
      req.headers['accept'] = 'application/json, text/event-stream';
    }

    const timezoneHint = req.headers['x-timezone'] as string | undefined;
    const server = createMcpServer({ timezoneHint });

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } finally {
      await server.close();
    }
  });

  return app;
}

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);

if (process.env['NODE_ENV'] !== 'test') {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`MCP Time Server running on port ${PORT}`);
  });
}
