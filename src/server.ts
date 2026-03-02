import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getCurrentTime } from './tools/get-current-time.js';
import { convertTime } from './tools/convert-time.js';

export interface ServerOptions {
  timezoneHint?: string;
}

export function createMcpServer(options: ServerOptions = {}): McpServer {
  const { timezoneHint } = options;

  const timeDescription = timezoneHint
    ? `Get the current time in a specified timezone. User's timezone is ${timezoneHint}.`
    : 'Get the current time in a specified timezone. The timezone parameter is required — ask the user if not known.';

  const convertDescription = timezoneHint
    ? `Convert a time from one timezone to another. User's timezone is ${timezoneHint}.`
    : 'Convert a time from one timezone to another. The timezone parameters are required — ask the user if not known.';

  const server = new McpServer({
    name: 'oss-mcp-time',
    version: '1.0.0',
  });

  server.registerTool('get_current_time', {
    title: 'Get Current Time',
    description: timeDescription,
    inputSchema: {
      timezone: z.string().describe('IANA timezone string (e.g., "America/New_York", "Europe/London", "Asia/Tokyo", "UTC")'),
    },
  }, async ({ timezone }) => {
    try {
      const result = getCurrentTime(timezone);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: (error as Error).message }],
      };
    }
  });

  server.registerTool('convert_time', {
    title: 'Convert Time',
    description: convertDescription,
    inputSchema: {
      source_timezone: z.string().describe('Source IANA timezone'),
      time: z.string().describe('Time to convert in HH:MM format'),
      target_timezone: z.string().describe('Target IANA timezone'),
      date: z.string().optional().describe('Optional date in YYYY-MM-DD format (defaults to today)'),
    },
  }, async ({ source_timezone, time, target_timezone, date }) => {
    try {
      const result = convertTime({ source_timezone, time, target_timezone, date });
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: (error as Error).message }],
      };
    }
  });

  return server;
}
