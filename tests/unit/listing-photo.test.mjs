import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import sharp from 'sharp';
const require = createRequire(import.meta.url);
const source = readFileSync(new URL('../../src/lib/listing-photo.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const moduleSource = outputText.replace('"sharp"', JSON.stringify(pathToFileURL(require.resolve('sharp')).href));
const { optimizeListingPhoto, listingPhotoMaxBytes } = await import(`data:text/javascript;base64,${Buffer.from(moduleSource).toString('base64')}`);

test('large detailed photos become WebP under 120 KB without stretching or EXIF metadata', async () => {
  const input = await sharp(randomBytes(2000 * 1500 * 3), { raw: { width: 2000, height: 1500, channels: 3 } }).png().withMetadata().toBuffer();
  const output = await optimizeListingPhoto(input);
  const meta = await sharp(output).metadata();
  assert.equal(meta.format, 'webp');
  assert.ok(output.length <= listingPhotoMaxBytes);
  assert.ok(meta.width <= 1440 && meta.height <= 1440);
  assert.ok(Math.abs(meta.width / meta.height - 4 / 3) < .01);
  assert.equal(meta.exif, undefined);
});

test('portrait JPEG orientation is applied and small images are never enlarged', async () => {
  const input = await sharp({ create: { width: 600, height: 400, channels: 3, background: '#2976a3' } }).jpeg().withMetadata({ orientation: 6 }).toBuffer();
  const output = await optimizeListingPhoto(input);
  const meta = await sharp(output).metadata();
  assert.equal(meta.format, 'webp');
  assert.equal(meta.width, 400);
  assert.equal(meta.height, 600);
  assert.equal(meta.orientation, undefined);
  assert.ok(output.length <= listingPhotoMaxBytes);
});

test('invalid image bytes are rejected', async () => {
  await assert.rejects(optimizeListingPhoto(Buffer.from('not an image')));
});
