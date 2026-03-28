import sharp from 'sharp';
import { readdirSync, existsSync } from 'fs';
import { join, extname, basename, resolve } from 'path';

const INPUT_DIR = resolve('public/images');
const QUALITY = 85;

const files = readdirSync(INPUT_DIR).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

let converted = 0;
let skipped = 0;

for (const file of files) {
  const ext = extname(file);
  const name = basename(file, ext);
  const inputPath = join(INPUT_DIR, file);
  const outputPath = join(INPUT_DIR, `${name}.webp`);

  if (existsSync(outputPath)) {
    console.log(`SKIP: ${name}.webp (already exists)`);
    skipped++;
    continue;
  }

  try {
    await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);
    console.log(`OK: ${file} -> ${name}.webp`);
    converted++;
  } catch (err) {
    console.error(`ERR: ${file} - ${err.message}`);
  }
}

console.log(`\nTotal: ${converted} converted, ${skipped} skipped.`);
