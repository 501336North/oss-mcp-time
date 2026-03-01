import express from 'express';

export function createApp(): express.Express {
  const app = express();
  return app;
}

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);

if (process.env['NODE_ENV'] !== 'test') {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`MCP Time Server running on port ${PORT}`);
  });
}
