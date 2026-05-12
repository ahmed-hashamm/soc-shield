import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { SettingsToggles } from "@/components/dashboard/SettingsToggles";
import { getPreferences } from "@/lib/actions/preferences";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const initialPrefs = await getPreferences();
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const fullName = user.user_metadata?.full_name || (user.email ? user.email.split('@')[0] : 'User');

  return (
    <div className="animate-fade-in-up">
      <header className="mb-10">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue mb-2">Account</h2>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Settings</h1>
        <p className="mt-2 text-sm text-zinc-500 max-w-xl">
          Manage your account preferences, security settings, and personal information.
        </p>
      </header>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="rounded-2xl border border-white/6 bg-white/2 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-2xl font-black text-zinc-500">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                fullName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">{fullName}</h2>
              <p className="text-sm text-zinc-500">{user.email}</p>
            </div>
          </div>

          <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-6 border-b border-white/5 pb-2">Profile Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
              <div className="rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white font-medium">
                {user.email}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">User ID</label>
              <div className="rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-[10px] text-zinc-400 font-mono">
                {user.id}
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="rounded-2xl border border-white/6 bg-white/2 p-8">
          <h2 className="text-base font-bold text-white mb-6 tracking-tight">Security & Privacy</h2>
          <SettingsToggles initialPrefs={initialPrefs} />
        </section>

        {/* Danger Zone */}
        <section className="rounded-2xl border border-red-500/10 bg-red-500/2 p-8">
          <h2 className="text-base font-bold text-white mb-2 tracking-tight">Session Management</h2>
          <p className="text-sm text-zinc-500 mb-6">Log out of your current dashboard session.</p>
          <SignOutButton />
        </section>
      </div>
    </div>
  );
}
