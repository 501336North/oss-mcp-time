import { describe, it, expect } from 'vitest';
import { getCurrentTime } from '../../src/tools/get-current-time.js';

describe('get_current_time tool', () => {
  describe('valid timezone', () => {
    it('should return time data for America/New_York', () => {
      const result = getCurrentTime('America/New_York');

      expect(result.timezone).toBe('America/New_York');
      expect(result.datetime).toBeDefined();
      expect(result.utc_offset).toBeDefined();
      expect(typeof result.is_dst).toBe('boolean');
    });

    it('should return correct offset for Asia/Tokyo (no DST)', () => {
      const result = getCurrentTime('Asia/Tokyo');

      expect(result.timezone).toBe('Asia/Tokyo');
      expect(result.utc_offset).toBe('+09:00');
      expect(result.is_dst).toBe(false);
    });

    it('should return ISO 8601 formatted datetime', () => {
      const result = getCurrentTime('UTC');

      expect(result.datetime).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      );
    });
  });

  describe('invalid timezone', () => {
    it('should throw for invalid timezone "Foo/Bar"', () => {
      expect(() => getCurrentTime('Foo/Bar')).toThrow();
    });

    it('should throw for empty timezone string', () => {
      expect(() => getCurrentTime('')).toThrow();
    });
  });
});
