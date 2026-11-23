import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Bake the background into the pixels: page CSS cannot affect search thumbnails.
const directory = new URL("../public/vehicles/", import.meta.url);
for (const file of await readdir(directory)) {
  if (!file.endsWith("-cutout.webp")) continue;
  await sharp(fileURLToPath(new URL(file, directory)))
    .flatten({ background: "#f3f6fa" })
    .webp({ quality: 85 })
    .toFile(fileURLToPath(new URL(file.replace("-cutout.webp", "-light.webp"), directory)));
}
