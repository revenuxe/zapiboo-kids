import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Heart, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';

export function LandingHero({ eyebrow, title, description, href, action, image, imageAlt, children }: {
  eyebrow: string; title: ReactNode; description: string; href?: string; action?: string;
  image?: string; imageAlt?: string; children?: ReactNode;
}) {
  return <section className="landing-hero"><div className="home-shell landing-hero-grid"><div className="landing-hero-copy"><span className="home-eyebrow"><span className="home-status-dot" />{eyebrow}</span><h1>{title}</h1><p>{description}</p>{href && <Link href={href} className="home-button">{action || 'Start selling'}<ArrowUpRight size={19} /></Link>}<div className="landing-hero-notes"><span><MapPin size={14} />Made for Bangalore</span><span><Heart size={14} />A little used. A lot to give.</span></div></div>{image ? <div className="landing-art-wrap"><div className="landing-art-card"><span className="home-eyebrow">GOOD THINGS KEEP GOING</span><Image src={image} alt={imageAlt || ''} width={480} height={360} preload sizes="(min-width: 1024px) 430px, 85vw" /><div><strong>{imageAlt}</strong><span><ArrowUpRight size={22} /></span></div></div><span className="landing-art-sticker">PRE-LOVED.<br />RE-LOVED.</span></div> : children}</div></section>;
}
