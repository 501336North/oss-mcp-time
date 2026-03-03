import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './server.js';

const timezoneHint = process.env['TIMEZONE'] || undefined;
const server = createMcpServer({ timezoneHint });
const transport = new StdioServerTransport();

await server.connect(transport);
