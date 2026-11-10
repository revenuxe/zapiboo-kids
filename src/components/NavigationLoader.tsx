"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Shows immediately after an internal navigation begins, before the new route streams. */
export function NavigationLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => { setLoading(false); }, [pathname]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.target === "_blank") return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) return;
      const next = new URL(href, window.location.href);
      if (next.pathname !== window.location.pathname || next.search !== window.location.search) setLoading(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!loading) return null;
  return <div aria-live="polite" aria-label="Opening page" className="pointer-events-none fixed inset-x-0 top-0 z-[100]"><div className="zap-navigation-progress"><span /></div></div>;
}
