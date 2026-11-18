import sharp from "sharp";

export const listingPhotoMaxBytes = 120 * 1024;

/** Auto-orient, strip metadata and encode every uploaded listing photo as bounded WebP. */
export async function optimizeListingPhoto(input: Buffer): Promise<Buffer> {
  const image = sharp(input, { limitInputPixels: 40000000, animated: false }).rotate();
  let result = Buffer.alloc(0);
  for (const size of [1440, 1152, 920, 736, 588, 470, 376, 300]) {
    for (const quality of [76, 64, 52]) {
      result = await image.clone()
        .resize(size, size, { fit: "inside", withoutEnlargement: true })
        .webp({ quality, effort: 5 })
        .toBuffer();
      if (result.length <= listingPhotoMaxBytes) return result;
    }
  }
  throw new Error("This photo couldn't be compressed. Please choose another image.");
}
