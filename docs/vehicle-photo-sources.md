# Vehicle category cutouts

The six active category images in public/vehicles/ are AI-generated photorealistic cutouts made with the built-in image_gen tool. They replace the earlier Unsplash scene photos.

Prompt set: one silver Indian-market hatchback, black/red commuter motorcycle, white city scooter, blue mid-size SUV, white small commercial pickup, and teal electric hatchback. Each prompt requests exactly one complete vehicle, front three-quarter view facing left, realistic photographic materials, soft studio lighting, genuine transparent alpha, and no scene, floor, text or extra objects.

Images are trimmed and encoded as transparent WebP using Sharp. Most use a 640 × 420 canvas; the motorcycle uses 560 × 368. See vehicle-cutout-sizes.json for measured sizes. Next.js serves responsive variants; only the primary hero image is preloaded.
