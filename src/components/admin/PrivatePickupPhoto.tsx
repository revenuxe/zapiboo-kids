"use client";
import useSWR from "swr";
import { resolvePickupPhoto } from "@/lib/pickup-photos";
import { Button } from "@/components/ui/button";

export function PrivatePickupPhoto({ value }: { value: string }) {
  const { data, error, mutate } = useSWR(
    ["private-pickup-photo", value],
    () => resolvePickupPhoto(value),
    { refreshInterval: 480000 },
  );
  if (error)
    return (
      <div role="alert" className="rounded-xl border border-border p-3 text-sm">
        <p>Could not open the pickup photo.</p>
        <Button variant="outline" size="sm" className="mt-2" onClick={() => void mutate()}>
          Retry photo
        </Button>
      </div>
    );
  if (!data) return <p className="text-sm text-muted-foreground">Opening private photo...</p>;
  return (
    <a href={data} target="_blank" rel="noreferrer" className="block">
      <img
        src={data}
        alt="Uploaded item"
        className="max-h-64 w-full rounded-2xl border border-border object-contain"
      />
    </a>
  );
}
