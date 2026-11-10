import AuthPage from '@/views/auth';
import { pageMetadata } from '@/lib/metadata';
import { safeRedirect } from '@/lib/safe-redirect';
export const metadata = pageMetadata('/auth', 'Sign in or create an account | Zapiboo', 'Sign in to manage your item pickup requests.', true);
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const search = await searchParams;
  return <AuthPage redirectPath={safeRedirect(search.redirectTo)} />;
}
