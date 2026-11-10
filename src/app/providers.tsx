"use client";

import { Suspense, useMemo, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SWRConfig } from 'swr';
import type { User } from '@supabase/supabase-js';
import { AuthProvider } from '@/components/AuthProvider';
import { useAuthContext } from '@/components/AuthProvider';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { SellByModel } from '@/components/SellByModel';
import { Toaster } from '@/components/ui/sonner';
import { NavigationLoader } from '@/components/NavigationLoader';
import { ServiceAvailability } from '@/components/ServiceAvailability';
import { ScrollToTop } from '@/components/ScrollToTop';

export function Providers({ children, initialUser }: { children: ReactNode; initialUser: User | null }) {
  return <AuthProvider initialUser={initialUser}><DataProvider>{children}</DataProvider></AuthProvider>;
}

function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  // A new cache on identity changes prevents one account's data appearing in another.
  const identity = user?.id ?? 'anonymous';
  const config = useMemo(() => ({ provider: () => new Map(), dedupingInterval: 60_000, errorRetryCount: 1 }), []);
  return <SWRConfig key={identity} value={config}><SiteShell>{children}</SiteShell></SWRConfig>;
}

function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const chromeless = pathname.startsWith('/admin') || pathname.startsWith('/auth');
  return <>
    <Suspense fallback={null}><ScrollToTop /></Suspense>
    <div className="flex min-h-screen flex-col">
      {!chromeless && <SiteHeader />}
      <main className={`flex-1 ${!chromeless && pathname !== "/" && pathname !== "/pickup" ? "editorial-pages" : ""}`}>{children}</main>
      {!chromeless && pathname !== '/repair' && <SellByModel />}
      {!chromeless && <SiteFooter />}
    </div>
    <ServiceAvailability />
    <NavigationLoader />
    <Toaster position="top-center" richColors />
  </>;
}
