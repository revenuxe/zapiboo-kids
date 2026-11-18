"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { Plus, Search, Pencil, Trash2, CheckCircle2, Archive, Send, Loader2, ClipboardList, Heart, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { listingPath, money, type VehicleListing } from "@/lib/marketplace";
import { listingStatusLabel } from "@/lib/listing-status";
import { toast } from "sonner";
const EditListing = dynamic(() => import("./EditListing").then(module => module.EditListing), { ssr: false });
async function fetchListings(url: string) {
  const response=await fetch(url); const data=await response.json();
  if (!response.ok || !data.available) throw new Error(data.error || "Couldn't load your listings.");
  return data as { listings: VehicleListing[]; available: boolean };
}
export function MyListings() {
  const { user, loading } = useAuth();
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [editing,setEditing]=useState<VehicleListing|null>(null);
  const [busy,setBusy]=useState<string|null>(null);
  const { data,error,isLoading,mutate }=useSWR(user ? ["/api/marketplace?mine=true",user.id] : null, ([url])=>fetchListings(url), {
    revalidateOnFocus:true,
    refreshInterval: current => current?.listings.some(listing => listing.status === "pending") ? 30000 : 0,
  });
  const listings=data?.listings ?? [];
  const results=listings.filter(listing=>(filter==="all" || listing.status===filter) && `${listing.title} ${listing.location}`.toLowerCase().includes(search.toLowerCase().trim()));
  async function action(listing: VehicleListing, status?: "sold"|"archived"|"pending") {
    if (busy) return;
    if (!status && !window.confirm(`Delete "${listing.title}"? This permanently removes the listing and its chats. You can archive it instead.`)) return;
    setBusy(listing.id);
    try {
      const response=await fetch(`/api/marketplace/${listing.id}`, { method:status ? "PATCH" : "DELETE", ...(status ? { headers:{"Content-Type":"application/json"},body:JSON.stringify({status}) } : {}) });
      const body=await response.json(); if (!response.ok) throw new Error(body.error || "Couldn't update your listing.");
      await mutate(current=>current ? {...current,listings:status ? current.listings.map(item=>item.id===listing.id ? body.listing : item) : current.listings.filter(item=>item.id!==listing.id)} : current,false);
      toast.success(!status ? "Listing deleted." : status==="pending" ? "Listing sent for approval." : status==="sold" ? "Marked as sold." : "Listing archived.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Couldn't update your listing."); }
    finally { setBusy(null); }
  }
  return <div className="marketplace mp-manage"><div className="mp-shell">
    <nav className="mp-library-nav" aria-label="Your vehicles"><Link href="/marketplace">Explore vehicles</Link><Link href="/marketplace/my-listings" aria-current="page"><ClipboardList size={16}/>My Listings</Link><Link href="/marketplace/saved"><Heart size={16}/>Saved</Link></nav>
    <header className="mp-manage-heading"><div><span className="mp-eyebrow">YOUR SELLER SPACE</span><h1>My Listings</h1><p>Manage your vehicles, follow approvals and keep buyers up to date.</p></div><Link href="/marketplace/sell" className="mp-btn"><Plus size={18}/>Create listing</Link></header>
    <div className="mp-review-banner"><CheckCircle2 size={22}/><p><strong>A quick review before every listing goes live.</strong> New listings and edits are sent to our admin team for approval. You can follow their status here.</p></div>
    {loading || isLoading ? <div className="mp-auth-loading" role="status"><Loader2 className="animate-spin"/>Loading your listings...</div> : !user ? <div className="mp-empty"><ClipboardList size={36}/><h2>Your listings, all in one place.</h2><p>Sign in to manage your vehicles and follow their approval status.</p><Link className="mp-btn" href="/auth?redirectTo=%2Fmarketplace%2Fmy-listings">Sign in to continue</Link></div> : error ? <div className="mp-empty" role="alert"><h2>Couldn't load your listings.</h2><p>{error.message}</p><button className="mp-btn" onClick={()=>mutate()}><RefreshCw size={16}/>Try again</button></div> : <>
      <div className="mp-manage-toolbar"><div className="mp-status-tabs" aria-label="Filter listings">{["all","pending","active","rejected","sold","archived"].map(status=><button key={status} type="button" aria-pressed={filter===status} onClick={()=>setFilter(status)}>{status==="all" ? "All listings" : listingStatusLabel[status as VehicleListing["status"]]}<span>{status==="all" ? listings.length : listings.filter(listing=>listing.status===status).length}</span></button>)}</div><label className="mp-manage-search"><Search size={17}/><input aria-label="Search my listings" placeholder="Search your listings" value={search} onChange={event=>setSearch(event.target.value)}/></label></div>
      <div className="mp-managed-list">{results.map(listing=><article className="mp-managed-card" key={listing.id}>
        <Link className="mp-managed-photo" href={listingPath(listing)} aria-label={`View ${listing.title}`}><Image src={listing.photos[0]} alt={listing.title} fill sizes="(max-width:639px) 120px, 210px"/></Link>
        <div className="mp-managed-copy"><span className={`mp-status-pill is-${listing.status}`}>{listingStatusLabel[listing.status]}</span><Link href={listingPath(listing)}><h2>{listing.title}</h2></Link><strong>{money(listing.price)}</strong><p>{listing.year} &middot; {listing.mileage.toLocaleString("en-IN")} km &middot; {listing.location}</p>
          {listing.status==="pending" && <p className="mp-review-message">Your listing is waiting for admin approval and is hidden from buyers.</p>}
          {listing.status==="rejected" && <p className="mp-review-feedback"><strong>Admin feedback:</strong> {listing.rejection_reason || "Please review your details and photos before resubmitting."}</p>}
          <div className="mp-managed-actions"><button disabled={!!busy} onClick={()=>setEditing(listing)}><Pencil size={15}/>Edit listing</button>
            {listing.status==="active" && <button disabled={!!busy} onClick={()=>action(listing,"sold")}><CheckCircle2 size={15}/>Mark as sold</button>}
            {["rejected","sold","archived"].includes(listing.status) && <button disabled={!!busy} onClick={()=>action(listing,"pending")}><Send size={15}/>{listing.status==="rejected" ? "Resubmit" : "Relist for approval"}</button>}
            {listing.status!=="archived" && <button disabled={!!busy} onClick={()=>action(listing,"archived")}><Archive size={15}/>Archive</button>}
            <button className="mp-delete-action" disabled={!!busy} onClick={()=>action(listing)}><Trash2 size={15}/>Delete</button>
            {busy===listing.id && <Loader2 size={17} className="animate-spin"/>}
          </div>
        </div>
      </article>)}</div>
      {!results.length && <div className="mp-empty"><ClipboardList size={36}/><h2>{listings.length ? "No matching listings." : "Your first listing starts here."}</h2><p>{listings.length ? "Try another status or search." : "Add your vehicle and send it for approval. We'll keep you updated here."}</p><Link href="/marketplace/sell" className="mp-btn">Create listing<Plus size={16}/></Link></div>}
    </>}
    {editing && <EditListing key={editing.id+editing.updated_at} listing={editing} onClose={()=>setEditing(null)} onSaved={listing=>{mutate(current=>current ? {...current,listings:current.listings.map(item=>item.id===listing.id ? listing : item)} : current,false);setEditing(null);toast.success("Changes saved and sent for approval.");}}/>}
  </div></div>;
}
