import { Sidebar } from "@/components/dashboard/Sidebar";
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch actual incident count for the sidebar badge
  const { count: incidentCount } = await supabase
    .from('incidents')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  return (
    <div className="flex bg-zinc-950 min-h-screen relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-blue/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <Sidebar user={user} incidentCount={incidentCount || 0} />
      
      <main className="flex-1 lg:ml-64 relative z-10">
        <div className="pt-16 lg:pt-0">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-10 py-10 md:py-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
