export interface TimeResult {
  datetime: string;
  timezone: string;
  utc_offset: string;
  is_dst: boolean;
}

export function isValidTimezone(timezone: string): boolean {
  try {
    if (!timezone) return false;
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

export function getCurrentTime(timezone: string): TimeResult {
  if (!isValidTimezone(timezone)) {
    throw new Error(
      `Invalid timezone: "${timezone}". Use IANA timezone strings like "America/New_York", "Europe/London", "Asia/Tokyo", "UTC".`
    );
  }

  const now = new Date();

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'longOffset',
  });

  const parts = formatter.formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? '';

  const year = get('year');
  const month = get('month');
  const day = get('day');
  const hour = get('hour');
  const minute = get('minute');
  const second = get('second');
  const datetime = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

  const offsetStr = get('timeZoneName');
  const utc_offset = parseOffset(offsetStr);

  const jan = new Date(now.getFullYear(), 0, 1);
  const jul = new Date(now.getFullYear(), 6, 1);
  const janOffset = getUtcOffsetMinutes(jan, timezone);
  const julOffset = getUtcOffsetMinutes(jul, timezone);
  const currentOffset = getUtcOffsetMinutes(now, timezone);
  const standardOffset = Math.max(janOffset, julOffset);
  const is_dst = currentOffset !== standardOffset;

  return { datetime, timezone, utc_offset, is_dst };
}

function parseOffset(offsetStr: string): string {
  const match = offsetStr.match(/GMT([+-]\d{2}:\d{2})/);
  if (match) return match[1];
  if (offsetStr === 'GMT' || offsetStr.includes('GMT+00:00')) return '+00:00';
  return '+00:00';
}

function getUtcOffsetMinutes(date: Date, timezone: string): number {
  const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' });
  const tzStr = date.toLocaleString('en-US', { timeZone: timezone });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
}
