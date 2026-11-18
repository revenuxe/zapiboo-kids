"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { Check, X, Search, Loader2, RefreshCw, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ListingGallery } from "@/components/marketplace/ListingGallery";
import { money, categoryLabel, type VehicleListing } from "@/lib/marketplace";
import { listingStatusLabel } from "@/lib/listing-status";
import { toast } from "sonner";
export function ListingsPanel() {
  const [status,setStatus]=useState("pending");
  const [search,setSearch]=useState("");
  const [term,setTerm]=useState("");
  const [page,setPage]=useState(0);
  const [selected,setSelected]=useState<VehicleListing|null>(null);
  const [reason,setReason]=useState("");
  const [busy,setBusy]=useState(false);
  const [reviewError,setReviewError]=useState("");
  useEffect(()=>{const timer=setTimeout(()=>{setTerm(search);setPage(0);},300);return ()=>clearTimeout(timer);},[search]);
  const {data,error,isLoading,mutate}=useSWR<{listings:VehicleListing[];total:number}>(`/api/admin/listings?status=${status}&page=${page}&search=${encodeURIComponent(term)}`,async url=>{const response=await fetch(url);const body=await response.json();if(!response.ok)throw new Error(body.error);return body;},{revalidateOnFocus:false});
  async function review(action:"approve"|"reject") {
    if(!selected || busy)return;
    if(action==="reject" && reason.trim().length<5){setReviewError("Add a reason of at least 5 characters for the seller.");return;}
    setBusy(true);setReviewError("");
    try{
      const response=await fetch("/api/admin/listings",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:selected.id,action,reason:reason.trim(),updated_at:selected.updated_at})});
      const body=await response.json();if(!response.ok)throw new Error(body.error);
      setSelected(null);setReason("");await mutate();toast.success(action==="approve" ? "Listing approved and live in the marketplace." : "Changes requested. The seller can see your feedback.");
    }catch(error){setReviewError(error instanceof Error ? error.message : "Couldn't save the review.");}finally{setBusy(false);}
  }
  return <section className="marketplace mp-admin-listings">
    <div className="mp-admin-queue-heading"><div><span className="mp-eyebrow">MARKETPLACE MODERATION</span><h2>Listing review</h2><p>Review the vehicle, photos and seller details before approving.</p></div><button className="mp-btn-secondary" onClick={()=>mutate()}><RefreshCw size={15}/>Refresh queue</button></div>
    <div className="mp-manage-toolbar"><div className="mp-status-tabs" aria-label="Review status">{["pending","active","rejected","sold","archived","all"].map(value=><button key={value} aria-pressed={status===value} onClick={()=>{setStatus(value);setPage(0);}}>{value==="all" ? "All listings" : listingStatusLabel[value as VehicleListing["status"]]}</button>)}</div><label className="mp-manage-search"><Search size={17}/><input aria-label="Search review queue" placeholder="Search by vehicle title" value={search} onChange={e=>setSearch(e.target.value)}/></label></div>
    {isLoading ? <div className="mp-auth-loading" role="status"><Loader2 className="animate-spin"/>Loading queue...</div> : error ? <div className="mp-empty" role="alert"><h3>Couldn't load the review queue.</h3><p>{error.message}</p><button className="mp-btn" onClick={()=>mutate()}>Try again</button></div> : <>
      <p className="mp-queue-count">{data?.total ?? 0} matching listings</p>
      <div className="mp-managed-list">{data?.listings.map(listing=><article className="mp-managed-card" key={listing.id}><div className="mp-managed-photo"><Image src={listing.photos[0]} alt={listing.title} fill sizes="(max-width:639px) 120px, 210px"/></div><div className="mp-managed-copy"><span className={`mp-status-pill is-${listing.status}`}>{listingStatusLabel[listing.status]}</span><h3>{listing.title}</h3><strong>{money(listing.price)}</strong><p>{listing.seller_name} &middot; {listing.location} &middot; {listing.photos.length} photos</p><p>Submitted {new Date(listing.created_at).toLocaleDateString("en-IN")}</p><button className="mp-btn-secondary" onClick={()=>{setSelected(listing);setReason(listing.rejection_reason ?? "");setReviewError("");}}>Review listing<ShieldCheck size={16}/></button></div></article>)}</div>
      {!data?.listings.length && <div className="mp-empty"><ShieldCheck size={36}/><h3>{status==="pending" ? "You're all caught up." : "No matching listings."}</h3><p>{status==="pending" ? "New submissions will appear here for your review." : "Choose another status or search term."}</p></div>}
      {(data?.total ?? 0)>30 && <div className="mp-queue-pagination"><button className="mp-btn-secondary" disabled={!page} onClick={()=>setPage(page-1)}><ChevronLeft size={16}/>Previous</button><span>Page {page+1} of {Math.ceil((data?.total ?? 0)/30)}</span><button className="mp-btn-secondary" disabled={(page+1)*30>=(data?.total ?? 0)} onClick={()=>setPage(page+1)}>Next<ChevronRight size={16}/></button></div>}
    </>}
    {selected && <Dialog open onOpenChange={open=>{if(!open && !busy)setSelected(null);}}><DialogContent className="mp-edit-dialog mp-review-dialog"><DialogTitle>{selected.title}</DialogTitle><DialogDescription>Inspect every photo and the vehicle details before deciding.</DialogDescription><div className="marketplace mp-detail"><ListingGallery photos={selected.photos} title={selected.title}/><div className="mp-admin-review-details"><strong>{money(selected.price)}</strong><span className={`mp-status-pill is-${selected.status}`}>{listingStatusLabel[selected.status]}</span><dl>{[["Category",categoryLabel(selected.category)],["Seller",selected.seller_name],["Year",selected.year],["Kilometres",selected.mileage.toLocaleString("en-IN")],["Fuel",selected.fuel],["Transmission",selected.transmission],["Ownership",selected.owners],["Location",selected.location],["Brand",selected.brand],["Model",selected.model]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><h3>Seller description</h3><p>{selected.description}</p></div>
      {["pending","active"].includes(selected.status) ? <div className="mp-admin-review-actions"><label>Feedback for the seller<textarea value={reason} disabled={busy} onChange={e=>setReason(e.target.value)} maxLength={500} placeholder="Explain what needs to change if you reject this listing." rows={3}/></label>{reviewError && <p className="mp-auth-error" role="alert">{reviewError}</p>}<div><button className="mp-btn-secondary" disabled={busy} onClick={()=>review("reject")}><X size={17}/>Request changes</button>{selected.status==="pending" && <button className="mp-btn" disabled={busy} onClick={()=>review("approve")}>{busy ? <Loader2 size={17} className="animate-spin"/> : <Check size={17}/>}Approve & go live</button>}</div></div> : selected.rejection_reason && <p className="mp-review-feedback">{selected.rejection_reason}</p>}
    </div></DialogContent></Dialog>}
  </section>;
}
