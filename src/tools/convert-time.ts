import { isValidTimezone } from './get-current-time.js';

export interface ConvertTimeParams {
  source_timezone: string;
  time: string;
  target_timezone: string;
  date?: string;
}

export interface ConvertTimeResult {
  source: string;
  target: string;
  source_timezone: string;
  target_timezone: string;
  utc_offset_source: string;
  utc_offset_target: string;
}

export function convertTime(params: ConvertTimeParams): ConvertTimeResult {
  const { source_timezone, time, target_timezone, date } = params;

  if (!isValidTimezone(source_timezone)) {
    throw new Error(
      `Invalid source timezone: "${source_timezone}". Use IANA timezone strings like "America/New_York", "Europe/London", "UTC".`
    );
  }
  if (!isValidTimezone(target_timezone)) {
    throw new Error(
      `Invalid target timezone: "${target_timezone}". Use IANA timezone strings like "America/New_York", "Europe/London", "UTC".`
    );
  }

  const timeParts = time.split(':');
  if (timeParts.length !== 2) {
    throw new Error(
      'Invalid time format. Use HH:MM format (e.g., "14:30").'
    );
  }
  const [hours, minutes] = timeParts.map(Number);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(
      'Invalid time format. Hours must be 0-23 and minutes must be 0-59.'
    );
  }

  const baseDate = date ? new Date(`${date}T00:00:00Z`) : new Date();
  const year = baseDate.getUTCFullYear();
  const month = baseDate.getUTCMonth();
  const day = baseDate.getUTCDate();

  const utcStr = new Date(
    Date.UTC(year, month, day, hours, minutes)
  ).toLocaleString('en-US', { timeZone: source_timezone });
  const sourceDate = new Date(utcStr);

  const refStr = new Date(
    Date.UTC(year, month, day, hours, minutes)
  ).toLocaleString('en-US', { timeZone: 'UTC' });
  const refDate = new Date(refStr);

  const sourceOffsetMs = sourceDate.getTime() - refDate.getTime();

  const actualUtc = new Date(
    Date.UTC(year, month, day, hours, minutes) - sourceOffsetMs
  );

  const sourceFormatted = formatTime(actualUtc, source_timezone);
  const targetFormatted = formatTime(actualUtc, target_timezone);
  const utc_offset_source = getOffset(actualUtc, source_timezone);
  const utc_offset_target = getOffset(actualUtc, target_timezone);

  return {
    source: sourceFormatted,
    target: targetFormatted,
    source_timezone,
    target_timezone,
    utc_offset_source,
    utc_offset_target,
  };
}

function formatTime(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return formatter.format(date);
}

function getOffset(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'longOffset',
  });
  const parts = formatter.formatToParts(date);
  const offsetPart = parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
  const match = offsetPart.match(/GMT([+-]\d{2}:\d{2})/);
  if (match) return match[1];
  return '+00:00';
}
