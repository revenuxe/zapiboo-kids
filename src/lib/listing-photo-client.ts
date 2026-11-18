export async function compressPhoto(file: File) {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 10 * 1024 * 1024
  )
    throw new Error("Choose a JPG, PNG or WebP photo under 10 MB.");
  const image = await createImageBitmap(file);
  try {
    let scale = Math.min(1, 1440 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser couldn't process the photo.");
    for (let attempt = 0; attempt < 8; attempt++) {
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.8, 0.68, 0.56]) {
        const url = canvas.toDataURL("image/webp", quality);
        if (!url.startsWith("data:image/webp"))
          throw new Error("This browser doesn't support WebP conversion. Please use a current browser.");
        // Data URLs use four base64 characters for every three bytes.
        if (url.length <= 160 * 1024 * 4 / 3) return url;
      }
      scale *= 0.8;
    }
    throw new Error("This photo couldn't be compressed. Please choose another image.");
  } finally {
    image.close();
  }
}
