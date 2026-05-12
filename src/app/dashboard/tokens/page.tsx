import { TokenManager } from "@/components/dashboard/TokenManager";
import { createClient } from "@/lib/supabase/server";

export default async function TokensPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: tokens } = await supabase
    .from('extension_tokens')
    .select('*')
    .eq('user_id', user.id)
    .eq('revoked', false)
    .order('issued_at', { ascending: false });

  return (
    <div className="animate-fade-in-up">
      <header className="mb-10">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue mb-2">Connectivity</h2>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Device Management</h1>
        <p className="mt-2 text-sm text-zinc-500 max-w-xl">
          Manage access tokens for your browser extension installations. 
          Each device requires a unique token to report incidents and sync rules.
        </p>
      </header>

      <TokenManager initialTokens={tokens || []} />
    </div>
  );
}
