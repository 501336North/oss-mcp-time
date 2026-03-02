import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/transport.js';

const MCP_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json, text/event-stream',
};

describe('Integration: Full MCP tool calls via HTTP', () => {
  const app = createApp();

  it('should complete full get_current_time tool call', async () => {
    const response = await request(app)
      .post('/mcp')
      .set(MCP_HEADERS)
      .send({
        jsonrpc: '2.0',
        id: 10,
        method: 'tools/call',
        params: {
          name: 'get_current_time',
          arguments: { timezone: 'America/New_York' },
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.result.content).toHaveLength(1);
    expect(response.body.result.content[0].type).toBe('text');

    const result = JSON.parse(response.body.result.content[0].text);
    expect(result.timezone).toBe('America/New_York');
    expect(result.datetime).toBeDefined();
    expect(result.utc_offset).toBeDefined();
    expect(typeof result.is_dst).toBe('boolean');
  });

  it('should complete full convert_time tool call', async () => {
    const response = await request(app)
      .post('/mcp')
      .set(MCP_HEADERS)
      .send({
        jsonrpc: '2.0',
        id: 11,
        method: 'tools/call',
        params: {
          name: 'convert_time',
          arguments: {
            source_timezone: 'UTC',
            time: '00:00',
            target_timezone: 'Asia/Tokyo',
          },
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.result.content).toHaveLength(1);

    const result = JSON.parse(response.body.result.content[0].text);
    expect(result.target).toContain('09:00');
    expect(result.source_timezone).toBe('UTC');
    expect(result.target_timezone).toBe('Asia/Tokyo');
  });

  it('should return error for invalid timezone in tool call', async () => {
    const response = await request(app)
      .post('/mcp')
      .set(MCP_HEADERS)
      .send({
        jsonrpc: '2.0',
        id: 12,
        method: 'tools/call',
        params: {
          name: 'get_current_time',
          arguments: { timezone: 'Not/Real' },
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.result.isError).toBe(true);
    expect(response.body.result.content[0].text).toContain('Invalid timezone');
  });
});
