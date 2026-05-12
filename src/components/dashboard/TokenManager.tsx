'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Laptop, Plus, Trash2, Key, CheckCircle2, Copy, Info } from 'lucide-react';
import { toast } from 'sonner';
import { issueToken, revokeToken } from '@/lib/actions/tokens';

interface Token {
  id: string;
  label: string | null;
  extension_id: string;
  issued_at: string;
  last_seen_at: string | null;
  revoked: boolean;
}

interface TokenManagerProps {
  initialTokens: Token[];
}

export function TokenManager({ initialTokens }: TokenManagerProps) {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [newLabel, setNewLabel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  async function handleGenerateToken(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabel.trim()) return;
    
    setIsGenerating(true);
    setGeneratedToken(null);
    const loadingToast = toast.loading('Generating secure identity...');

    try {
      const data = await issueToken(newLabel.trim());
      setGeneratedToken(data.rawToken);
      setTokens([data, ...tokens]);
      setNewLabel('');
      toast.success('Token issued successfully', { id: loadingToast });
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate token', { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleRevokeToken(id: string, label: string) {
    if (!confirm(`Are you sure you want to revoke "${label}"?`)) return;

    const loadingToast = toast.loading(`Revoking ${label}...`);
    try {
      await revokeToken(id);
      setTokens(tokens.map(t => t.id === id ? { ...t, revoked: true } : t));
      toast.success('Token revoked', { id: loadingToast });
    } catch (err: any) {
      toast.error(err.message || 'Failed to revoke token', { id: loadingToast });
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Token copied to clipboard');
  };

  return (
    <div className="space-y-12">
      {/* Generate Form */}
      <section className="relative overflow-hidden rounded-3xl border border-neon-blue/10 bg-zinc-900/10 backdrop-blur-md p-8 sm:p-10 transition-all hover:border-neon-blue/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
              <Plus className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Provision New Device</h2>
              <p className="text-xs text-zinc-500 font-medium">Issue a unique identity token for a new browser installation</p>
            </div>
          </div>
          
          <form onSubmit={handleGenerateToken} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Label (e.g. Work Laptop, Chrome Home)..."
              className="flex-1 rounded-xl border border-white/5 bg-zinc-900/40 px-5 py-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-neon-blue/30 focus:bg-zinc-900/60"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="rounded-xl border border-neon-blue/20 bg-neon-blue/10 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue transition-all duration-300 hover:bg-neon-blue hover:text-black hover:shadow-[0_0_25px_rgba(0,210,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 group/issue"
            >
              {isGenerating ? (
                <div className="w-3.5 h-3.5 border-2 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin" />
              ) : (
                <>
                  <Key className="w-3.5 h-3.5 transition-transform group-hover/issue:scale-110" />
                  Issue Token
                </>
              )}
            </button>
          </form>

          {generatedToken && (
            <div className="mt-8 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-6 animate-fade-in relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Identity Provisioned Successfully</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-center gap-4">
                  <code className="flex-1 text-xs text-emerald-400 font-mono break-all leading-relaxed">
                    {generatedToken}
                  </code>
                  <button
                    onClick={() => copyToClipboard(generatedToken)}
                    className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black transition-all"
                    title="Copy Token"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-4 text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-3 h-3" />
                  Warning: Save this token now. It will never be shown again.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Active Tokens */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Active Identities</h2>
          <span className="px-2.5 py-1 rounded-md bg-white/3 border border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
            {tokens.filter(t => !t.revoked).length} Active
          </span>
        </div>

        <div className="grid gap-4">
          {tokens.length > 0 ? (
            tokens.map((token) => (
              <div 
                key={token.id} 
                className={`group relative rounded-2xl border ${token.revoked ? 'border-white/3 bg-transparent opacity-40' : 'border-white/6 bg-white/2 hover:border-neon-blue/20'} p-6 transition-all duration-300`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${token.revoked ? 'bg-zinc-900 text-zinc-700' : 'bg-white/5 text-zinc-500 group-hover:text-neon-blue group-hover:bg-neon-blue/5'} transition-all duration-500`}>
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-white tracking-tight">{token.label}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-mono text-zinc-500 tracking-tight">ID: {token.extension_id}</span>
                        {!token.revoked && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60">Ready</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="hidden md:block text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Provisioned</p>
                      <p className="text-[10px] font-bold text-zinc-400">{formatDistanceToNow(new Date(token.issued_at), { addSuffix: true })}</p>
                    </div>
                    
                    {!token.revoked && (
                      <button
                        onClick={() => handleRevokeToken(token.id, token.label || 'Token')}
                        className="p-3 rounded-xl hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                        title="Revoke Token"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {token.revoked && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700">Revoked</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/3 bg-white/1 p-12 text-center">
              <Key className="w-8 h-8 text-zinc-800 mx-auto mb-4" />
              <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest">No active device identities</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
