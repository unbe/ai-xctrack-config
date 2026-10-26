import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { parseXcfg, serializeXcfg } from '../utils/xcfgSerializer';

describe('xcfgRoundTrip', () => {
  const exampleFiles = [
    '2023-06-28_backup-00.xcfg',
    '2023-08-23_backup-00.xcfg',
    '2024-06-12_pages-00.xcfg',
    '2026-03-12_backup-00.xcfg',
  ];

  for (const filename of exampleFiles) {
    it(`parses and losslessly re-serializes ${filename}`, () => {
      const filePath = path.resolve(process.cwd(), filename);
      const originalText = fs.readFileSync(filePath, 'utf-8');
      const originalJson = JSON.parse(originalText);

      // Parse using our serializer
      const parsed = parseXcfg(originalText);

      // Verify essential sections
      expect(parsed.info).toBeDefined();
      expect(parsed.layout).toBeDefined();
      expect(parsed.layout.portrait).toBeInstanceOf(Array);
      expect(parsed.layout.landscape).toBeInstanceOf(Array);

      // Re-serialize
      const serializedText = serializeXcfg(parsed);
      const reSerializedJson = JSON.parse(serializedText);

      // Deep equality check: nothing lost, nothing accidentally modified
      expect(reSerializedJson).toEqual(originalJson);
    });
  }
});
