import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Heart, MapPin, Sparkles, Truck } from 'lucide-react';

export function HomeHero() {
  return (
    <section id="sell-kids-items" className="home-hero" aria-label="Sell pre-loved kids items">
      <div className="home-shell home-hero-grid">
        <div className="home-hero-copy">
          <span className="home-eyebrow"><span className="home-status-dot" /> LITTLE THINGS. BIG NEW BEGINNINGS.</span>
          <h1>Outgrown.<br />Still <span className="home-loved">so loved.<svg viewBox="0 0 400 20" aria-hidden="true"><path d="M4 14 Q180 -5 394 10" /></svg></span></h1>
          <p>Their next chapter starts with a little more space. Sell pre-loved toys, books & baby gear, right from home.</p>
          <div className="home-hero-actions">
            <Link href="#sell-categories" className="home-button">Sell your items <ArrowUpRight size={20} /></Link>
            <Link href="#how-it-works" className="home-text-link">How it works <ArrowDown size={16} /></Link>
          </div>
          <div className="home-hero-notes"><span><MapPin size={15} /> Made for Bangalore</span><span><Truck size={16} /> Doorstep pickup</span></div>
        </div>
        <div className="home-collage" aria-label="Give toys, books and baby gear a new beginning">
          <span className="home-collage-orbit" aria-hidden="true" />
          <div className="home-mini-note"><Heart size={18} fill="currentColor" /> More play. Less waste.</div>
          <Link href="/pickup?category=toys" className="home-display-card home-display-toys">
            <div className="home-display-label"><span>THE PLAYTIME COLLECTION</span><ArrowUpRight size={18} /></div>
            <Image src="/sell-categories/toys.webp" alt="Pre-loved toys and games" width={440} height={330} preload sizes="(max-width: 600px) 70vw, 360px" />
            <div className="home-display-bottom"><strong>Small toys.<br />Endless possibilities.</strong><span className="home-round-arrow"><ArrowUpRight size={22} /></span></div>
          </Link>
          <Link href="/pickup?category=books" className="home-display-card home-display-books"><span>ONE MORE STORY</span><Image src="/sell-categories/books.webp" alt="Kids story books" width={200} height={170} sizes="180px" /><strong>Pass on the magic <ArrowUpRight size={15} /></strong></Link>
          <div className="home-circle-stamp"><Sparkles size={23} /><span>PRE-LOVED.<br />RE-LOVED.</span></div>
          <div className="home-pickup-note"><span><Truck size={21} /></span><div><strong>A lighter home awaits</strong><small>You share. We help with the rest.</small></div></div>
        </div>
      </div>
      <div className="home-values-strip"><span>Less clutter, more possibilities</span><span aria-hidden="true">&#10035;</span><span>Good things deserve a second childhood</span><span aria-hidden="true">&#10035;</span><span>A little kinder to the planet</span></div>
    </section>
  );
}
