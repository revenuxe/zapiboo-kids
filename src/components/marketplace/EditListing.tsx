"use client";
import { useState } from "react";
import Image from "next/image";
import { Loader2, Plus, X, ArrowLeft, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { vehicleCategories, type VehicleListing } from "@/lib/marketplace";
import { compressPhoto } from "@/lib/listing-photo-client";

type Photo = { url: string; fresh: boolean };
export function EditListing({ listing, onClose, onSaved }: { listing: VehicleListing; onClose: () => void; onSaved: (listing: VehicleListing) => void }) {
  const [draft, setDraft] = useState(listing);
  const [photos, setPhotos] = useState<Photo[]>(listing.photos.map(url => ({ url, fresh: false })));
  const [busy, setBusy] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const field = (key: keyof VehicleListing, value: string | number | boolean) => setDraft(current => ({ ...current, [key]: value }));
  async function addPhotos(files: FileList | null) {
    if (!files) return;
    if (photos.length + files.length > 8) { setError("Keep up to 8 photos."); return; }
    setProcessing(true); setError("");
    try {
      const added = await Promise.all(Array.from(files).map(compressPhoto));
      setPhotos(current => [...current, ...added.map(url => ({ url, fresh: true }))].slice(0, 8));
    } catch (error) { setError(error instanceof Error ? error.message : "Couldn't process the photo."); }
    finally { setProcessing(false); }
  }
  async function save(event: React.FormEvent) {
    event.preventDefault(); if (busy || processing) return;
    if (!photos.length) { setError("Keep at least one photo."); return; }
    setBusy(true); setError("");
    try {
      const body = new FormData();
      body.set("listing", JSON.stringify(draft));
      const retained = photos.filter(photo => !photo.fresh);
      const added = photos.filter(photo => photo.fresh);
      body.set("retainedPhotos", JSON.stringify(retained.map(photo => photo.url)));
      body.set("photoOrder", JSON.stringify(photos.map(photo => photo.fresh ? retained.length + added.indexOf(photo) : retained.indexOf(photo))));
      for (const photo of photos.filter(photo => photo.fresh)) {
        body.append("photos", await (await fetch(photo.url)).blob(), "vehicle.webp");
      }
      const response = await fetch(`/api/marketplace/${listing.id}`, { method: "PUT", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Couldn't save changes.");
      onSaved(data.listing);
    } catch (error) { setError(error instanceof Error ? error.message : "Couldn't save changes."); }
    finally { setBusy(false); }
  }
  return <Dialog open onOpenChange={open => { if (!open && !busy && !processing) onClose(); }}>
    <DialogContent className="mp-edit-dialog" onInteractOutside={event => event.preventDefault()}>
      <DialogTitle>Edit your listing</DialogTitle>
      <DialogDescription>Changes are sent for admin approval before the listing goes live. Your private contact details can be updated in My account.</DialogDescription>
      <form onSubmit={save} className="marketplace mp-create mp-edit-form">
        <fieldset disabled={busy || processing}>
          <div className="mp-form-fields">
            <label>Listing title<input required minLength={10} maxLength={100} value={draft.title} onChange={e => field("title", e.target.value)} /></label>
            <div className="mp-form-two">
              <label>Category<select value={draft.category} onChange={e => field("category", e.target.value)}>{vehicleCategories.map(category => <option value={category.id} key={category.id}>{category.label}</option>)}</select></label>
              <label>Seller name<input required minLength={2} maxLength={80} value={draft.seller_name} onChange={e => field("seller_name", e.target.value)} /></label>
              <label>Brand<input required minLength={2} maxLength={40} value={draft.brand} onChange={e => field("brand", e.target.value)} /></label>
              <label>Model / variant<input required maxLength={60} value={draft.model} onChange={e => field("model", e.target.value)} /></label>
              <label>Registration year<input required type="number" min={1980} max={new Date().getFullYear()+1} value={draft.year} onChange={e => field("year", Number(e.target.value))} /></label>
              <label>Kilometres driven<input required type="number" min={0} max={2000000} value={draft.mileage} onChange={e => field("mileage", Number(e.target.value))} /></label>
              <label>Fuel type<select value={draft.fuel} onChange={e => field("fuel", e.target.value)}>{["Petrol","Diesel","Electric","CNG","Hybrid"].map(value => <option key={value}>{value}</option>)}</select></label>
              <label>Transmission<select value={draft.transmission} onChange={e => field("transmission", e.target.value)}><option>Manual</option><option>Automatic</option></select></label>
              <label>Ownership<select value={draft.owners} onChange={e => field("owners", e.target.value)}>{["1st owner","2nd owner","3rd owner or more"].map(value => <option key={value}>{value}</option>)}</select></label>
              <label>Asking price<input required type="number" min={1000} max={100000000} value={draft.price} onChange={e => field("price", Number(e.target.value))} /></label>
            </div>
            <label>Bangalore neighbourhood<input required minLength={2} maxLength={80} value={draft.location} onChange={e => field("location", e.target.value)} /></label>
            <label className="mp-checkbox"><input type="checkbox" checked={draft.negotiable} onChange={e => field("negotiable", e.target.checked)} /><span>Open to reasonable offers</span></label>
            <label className="mp-checkbox"><input type="checkbox" checked={draft.buyer_call_enabled} onChange={e => field("buyer_call_enabled", e.target.checked)} /><span>Allow signed-in buyers to see my number and call me. You can turn this off at any time.</span></label>
            <label>Description<textarea required minLength={40} maxLength={3000} rows={5} value={draft.description} onChange={e => field("description", e.target.value)} /></label>
            <div><h3>Photos ({photos.length}/8)</h3><p className="mp-edit-photo-note">The first photo is your cover. Use the arrows to reorder photos or choose a new cover.</p>
              <div className="mp-edit-photos">{photos.map((photo, index) => <div key={photo.url}>
                <img src={photo.url} alt={`Listing photo ${index+1}`} />
                <span>{index === 0 ? "Cover" : index+1}</span>
                <button type="button" aria-label={`Remove photo ${index+1}`} onClick={() => setPhotos(current => current.filter((_, i) => i !== index))}><X size={16}/></button>
                {<div className="mp-edit-photo-order"><button type="button" aria-label={`Move photo ${index+1} earlier`} disabled={index===0} onClick={() => setPhotos(current => { const next=[...current]; [next[index-1],next[index]]=[next[index],next[index-1]]; return next; })}><ArrowLeft size={14}/></button><button type="button" aria-label={`Move photo ${index+1} later`} disabled={index===photos.length-1} onClick={() => setPhotos(current => { const next=[...current]; [next[index+1],next[index]]=[next[index],next[index+1]]; return next; })}><ArrowRight size={14}/></button></div>}
              </div>)}</div>
              {photos.length<8 && <label className="mp-edit-upload"><Plus size={18}/>{processing ? "Optimizing photos..." : "Add photos"}<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => { addPhotos(e.target.files); e.target.value=""; }}/></label>}
            </div>
            {error && <p className="mp-auth-error" role="alert">{error}</p>}
          </div>
        </fieldset>
        <div className="mp-form-footer"><button type="button" className="mp-btn-secondary" onClick={onClose} disabled={busy || processing}>Cancel</button><button type="submit" className="mp-btn" disabled={busy || processing}>{busy ? <Loader2 size={17} className="animate-spin"/> : "Save & submit for approval"}</button></div>
      </form>
    </DialogContent>
  </Dialog>;
}
