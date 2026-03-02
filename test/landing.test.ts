import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/transport.js';

describe('Landing Page (GET /)', () => {
  const app = createApp();

  it('should return HTML with Content-Type text/html', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });

  it('should include "One Shot Ship" branding', async () => {
    const response = await request(app).get('/');

    expect(response.text).toContain('One Shot Ship');
  });

  it('should include setup instructions with claude mcp add command', async () => {
    const response = await request(app).get('/');

    expect(response.text).toContain('claude mcp add');
  });

  it('should include link to oneshotship.com', async () => {
    const response = await request(app).get('/');

    expect(response.text).toContain('oneshotship.com');
  });
});
