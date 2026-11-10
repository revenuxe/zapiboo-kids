import AdminDashboard from '@/views/admin.dashboard';
import { requireAdmin } from '@/integrations/supabase/server';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('/admin/dashboard', 'Admin Dashboard | Zapiboo', 'Manage item pickups, availability and customer enquiries.', true);
export default async function Page() {
  await requireAdmin();
  return <AdminDashboard />;
}
