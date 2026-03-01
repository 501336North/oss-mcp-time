import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { getLandingHtml } from './landing.js';
import { createMcpServer } from './server.js';

export function createApp(): express.Express {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/', (_req, res) => {
    res.type('html').send(getLandingHtml());
  });

  app.post('/mcp', async (req, res) => {
    const timezoneHint = req.headers['x-timezone'] as string | undefined;
    const server = createMcpServer({ timezoneHint });

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
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
