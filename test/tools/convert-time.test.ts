import { describe, it, expect } from 'vitest';
import { convertTime } from '../../src/tools/convert-time.js';

describe('convert_time tool', () => {
  describe('basic conversion', () => {
    it('should convert 14:00 from America/New_York to Europe/London', () => {
      const result = convertTime({
        source_timezone: 'America/New_York',
        time: '14:00',
        target_timezone: 'Europe/London',
      });

      expect(result.source_timezone).toBe('America/New_York');
      expect(result.target_timezone).toBe('Europe/London');
      expect(result.source).toContain('14:00');
      expect(result.target).toBeDefined();
    });

    it('should convert 00:00 from UTC to Asia/Tokyo', () => {
      const result = convertTime({
        source_timezone: 'UTC',
        time: '00:00',
        target_timezone: 'Asia/Tokyo',
      });

      expect(result.target).toContain('09:00');
    });
  });

  describe('DST edge cases', () => {
    it('should handle different offsets for winter vs summer dates', () => {
      const winter = convertTime({
        source_timezone: 'America/New_York',
        time: '12:00',
        target_timezone: 'UTC',
        date: '2026-01-15',
      });

      const summer = convertTime({
        source_timezone: 'America/New_York',
        time: '12:00',
        target_timezone: 'UTC',
        date: '2026-07-15',
      });

      expect(winter.utc_offset_source).not.toBe(summer.utc_offset_source);
    });
  });

  describe('invalid input', () => {
    it('should throw for invalid source timezone', () => {
      expect(() =>
        convertTime({
          source_timezone: 'Invalid/Zone',
          time: '12:00',
          target_timezone: 'UTC',
        })
      ).toThrow();
    });

    it('should throw for invalid target timezone', () => {
      expect(() =>
        convertTime({
          source_timezone: 'UTC',
          time: '12:00',
          target_timezone: 'Invalid/Zone',
        })
      ).toThrow();
    });
  });
});
