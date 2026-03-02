import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/transport.js';

const MCP_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json, text/event-stream',
};

describe('Transport (HTTP Boundary)', () => {
  const app = createApp();

  describe('GET /health', () => {
    it('should return 200 with status ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('POST /mcp', () => {
    it('should accept a valid MCP initialize request', async () => {
      const response = await request(app)
        .post('/mcp')
        .set(MCP_HEADERS)
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'test-client', version: '1.0.0' },
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.jsonrpc).toBe('2.0');
      expect(response.body.result).toHaveProperty('serverInfo');
      expect(response.body.result.serverInfo.name).toBe('oss-mcp-time');
    });

    it('should list tools including get_current_time and convert_time', async () => {
      const response = await request(app)
        .post('/mcp')
        .set(MCP_HEADERS)
        .send({
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list',
          params: {},
        });

      expect(response.status).toBe(200);
      const tools = response.body.result.tools;
      const toolNames = tools.map((t: { name: string }) => t.name);
      expect(toolNames).toContain('get_current_time');
      expect(toolNames).toContain('convert_time');
    });
  });

  describe('Timezone hint (X-Timezone header)', () => {
    it('should include timezone hint when X-Timezone header is set', async () => {
      const response = await request(app)
        .post('/mcp')
        .set({ ...MCP_HEADERS, 'X-Timezone': 'America/New_York' })
        .send({
          jsonrpc: '2.0',
          id: 3,
          method: 'tools/list',
          params: {},
        });

      expect(response.status).toBe(200);
      const tools = response.body.result.tools;
      const timeTool = tools.find(
        (t: { name: string }) => t.name === 'get_current_time'
      );
      expect(timeTool.description).toContain('America/New_York');
    });

    it('should prompt to ask user when no X-Timezone header', async () => {
      const response = await request(app)
        .post('/mcp')
        .set(MCP_HEADERS)
        .send({
          jsonrpc: '2.0',
          id: 4,
          method: 'tools/list',
          params: {},
        });

      expect(response.status).toBe(200);
      const tools = response.body.result.tools;
      const timeTool = tools.find(
        (t: { name: string }) => t.name === 'get_current_time'
      );
      expect(timeTool.description).toContain('ask the user');
    });
  });
});
