"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, ZoomIn, ZoomOut } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

export function ListingGallery({ photos, title, demo = false }: { photos: string[]; title: string; demo?: boolean }) {
  const [photo, setPhoto] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchStart = useRef<number | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const move = (delta: number) => {
    setPhoto(current => (current + delta + photos.length) % photos.length);
    setZoomed(false);
    viewport.current?.scrollTo(0, 0);
  };
  const swipe = {
    onTouchStart: (event: React.TouchEvent) => { touchStart.current = event.touches[0].clientX; },
    onTouchEnd: (event: React.TouchEvent) => {
      if (!zoomed && touchStart.current !== null) {
        const distance = event.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(distance) > 50) move(distance > 0 ? -1 : 1);
      }
      touchStart.current = null;
    },
  };
  if (!photos.length) return <div className="mp-gallery-empty">No photos available</div>;
  return (
    <Dialog onOpenChange={() => setZoomed(false)}>
      <div className="mp-gallery-wrap">
        <div className={`mp-gallery ${demo ? "mp-demo-photo" : ""}`} {...swipe}>
          <DialogTrigger asChild>
            <button type="button" className="mp-gallery-open" aria-label="Open photo fullscreen">
              <Image src={photos[photo]} alt={`${title}, photo ${photo + 1}`} fill sizes="(max-width: 899px) 94vw, 65vw" preload />
              <span className="mp-gallery-expand"><Expand size={16} /> View photos</span>
            </button>
          </DialogTrigger>
          {photos.length > 1 && <>
            <button type="button" className="mp-gallery-prev" aria-label="Previous photo" onClick={() => move(-1)}><ChevronLeft size={22} /></button>
            <button type="button" className="mp-gallery-next" aria-label="Next photo" onClick={() => move(1)}><ChevronRight size={22} /></button>
          </>}
          <span className="mp-photo-count" aria-live="polite">{photo + 1} / {photos.length}</span>
        </div>
        <div className="mp-gallery-bottom"><span>{demo ? "Illustrative photos" : "Photos from the seller"}</span><span>Swipe or tap to explore</span></div>
        {photos.length > 1 && <div className="mp-gallery-thumbs" aria-label="Vehicle photos">
          {photos.map((src, index) => <button type="button" key={`${src}-${index}`} onClick={() => { setPhoto(index); setZoomed(false); }} aria-label={`Show photo ${index + 1}`} aria-pressed={photo === index}>
            <Image src={src} alt="" width={100} height={76} sizes="100px" />
          </button>)}
        </div>}
      </div>
      <DialogContent className="mp-lightbox" onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
        <div className="mp-lightbox-heading">
          <div><DialogTitle>{title}</DialogTitle><DialogDescription>Photo {photo + 1} of {photos.length}. Use arrow keys to browse. Press Escape to close.</DialogDescription></div>
          <button type="button" className="mp-zoom" onClick={() => { setZoomed(!zoomed); viewport.current?.scrollTo(0, 0); }} aria-label={zoomed ? "Zoom out" : "Zoom in"} aria-pressed={zoomed}>{zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}<span>{zoomed ? "Fit photo" : "Zoom in"}</span></button>
        </div>
        <div ref={viewport} className={`mp-lightbox-viewport ${zoomed ? "is-zoomed" : ""}`} {...swipe}>
          <button type="button" className="mp-lightbox-image" onClick={() => setZoomed(!zoomed)} aria-label={zoomed ? "Fit photo to screen" : "Enlarge photo"}>
            <Image src={photos[photo]} alt={`${title}, photo ${photo + 1}`} fill sizes={zoomed ? "200vw" : "100vw"} />
          </button>
        </div>
        <div className="mp-lightbox-controls">
          <button type="button" aria-label="Previous fullscreen photo" disabled={photos.length < 2} onClick={() => move(-1)}><ChevronLeft size={22} /></button>
          <span aria-live="polite">{photo + 1} / {photos.length}</span>
          <button type="button" aria-label="Next fullscreen photo" disabled={photos.length < 2} onClick={() => move(1)}><ChevronRight size={22} /></button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
