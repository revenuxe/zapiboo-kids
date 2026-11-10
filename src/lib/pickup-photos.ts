import { supabase } from "@/integrations/supabase/client";

export const pickupPhotoBucket = "pickup-photos";
export function pickupPhotoPath(value: string): string | null {
  if (value.startsWith(`${pickupPhotoBucket}/`)) return value.slice(pickupPhotoBucket.length + 1);
  try {
    const url = new URL(value);
    const match = url.pathname.match(
      /^\/storage\/v1\/object\/(?:public|sign|authenticated)\/pickup-photos\/(.+)$/,
    );
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}
export async function resolvePickupPhoto(value: string): Promise<string> {
  const path = pickupPhotoPath(value);
  if (path) {
    const { data, error } = await supabase.storage
      .from(pickupPhotoBucket)
      .createSignedUrl(path, 600);
    if (error || !data?.signedUrl) throw new Error("Could not open the private pickup photo.");
    return data.signedUrl;
  }
  // Compatibility for compressed photos already stored with the protected lead.
  if (/^data:image\/(webp|png|jpeg);base64,/.test(value)) return value;
  throw new Error("This photo needs migration to private pickup storage.");
}
