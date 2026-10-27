import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { parseXcfg, serializeXcfg } from '../utils/xcfgSerializer';
import { BUILTIN_SAMPLES } from '../data/sample-configs';

describe('xcfgRoundTrip', () => {
  // Test lossless serialization on all built-in sample configs
  for (const sample of BUILTIN_SAMPLES) {
    it(`parses and losslessly re-serializes built-in ${sample.name}`, () => {
      const originalJson = JSON.parse(JSON.stringify(sample.config));
      const serializedText = serializeXcfg(sample.config);
      const parsed = parseXcfg(serializedText);

      expect(parsed.info).toBeDefined();
      expect(parsed.layout).toBeDefined();
      expect(parsed.layout.portrait).toBeInstanceOf(Array);
      expect(parsed.layout.landscape).toBeInstanceOf(Array);

      const reSerializedJson = JSON.parse(serializeXcfg(parsed));
      expect(reSerializedJson).toEqual(originalJson);
    });
  }

  // Also test local files if present on disk
  const localCandidateFiles = [
    '2023-06-28_backup-00.xcfg',
    '2023-08-23_backup-00.xcfg',
    '2024-06-12_pages-00.xcfg',
    '2026-03-12_backup-00.xcfg',
    '2026-10-27_backup-00.xcfg',
  ];

  for (const filename of localCandidateFiles) {
    const filePath = path.resolve(process.cwd(), filename);
    if (fs.existsSync(filePath)) {
      it(`parses and losslessly re-serializes local ${filename}`, () => {
        const originalText = fs.readFileSync(filePath, 'utf-8');
        const originalJson = JSON.parse(originalText);

        const parsed = parseXcfg(originalText);
        expect(parsed.info).toBeDefined();
        expect(parsed.layout).toBeDefined();

        const serializedText = serializeXcfg(parsed);
        const reSerializedJson = JSON.parse(serializedText);
        expect(reSerializedJson).toEqual(originalJson);
      });
    }
  }
});
