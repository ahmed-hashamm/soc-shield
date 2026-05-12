'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShieldAlert, ShieldCheck, Trash2, Plus, Globe, Hash } from 'lucide-react';
import { addRule, deleteRule } from '@/lib/actions/rules';

interface Rule {
  id: string;
  value: string;
  entry_type: string;
  threat_category?: string;
  reason?: string;
}

interface RuleManagerProps {
  initialRules: Rule[];
  type: 'block' | 'allow';
}

export function RuleManager({ initialRules, type }: RuleManagerProps) {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [newValue, setNewValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  async function handleAddRule(e: React.FormEvent) {
    e.preventDefault();
    if (!newValue.trim()) return;
    
    setIsAdding(true);
    const loadingToast = toast.loading(`Adding ${newValue}...`);

    try {
      const newRule = await addRule(type, newValue);
      setRules([newRule, ...rules]);
      setNewValue('');
      toast.success('Rule added successfully', { id: loadingToast });
    } catch (err: any) {
      toast.error(err.message || 'Failed to add rule', { id: loadingToast });
    } finally {
      setIsAdding(false);
    }
  }

  async function handleDeleteRule(id: string, value: string) {
    const loadingToast = toast.loading(`Removing ${value}...`);
    try {
      await deleteRule(type, id);
      setRules(rules.filter(r => r.id !== id));
      toast.success('Rule removed', { id: loadingToast });
    } catch (err: any) {
      toast.error('Failed to remove rule', { id: loadingToast });
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Form */}
      <form onSubmit={handleAddRule} className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-neon-blue/20 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              {type === 'block' ? 
                <ShieldAlert className="w-4 h-4 text-zinc-500" /> : 
                <ShieldCheck className="w-4 h-4 text-zinc-500" />
              }
            </div>
            <input
              type="text"
              placeholder={type === 'block' ? 'Domain or IP to block...' : 'Domain or IP to allow...'}
              className="w-full rounded-xl border border-white/5 bg-zinc-900/40 pl-11 pr-4 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-neon-blue/30 focus:bg-zinc-900/60"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isAdding}
            className="rounded-xl border border-neon-blue/20 bg-neon-blue/10 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue transition-all duration-300 hover:bg-neon-blue hover:text-black hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap group/add"
          >
            {isAdding ? (
              <div className="w-3.5 h-3.5 border-2 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5 transition-transform group-hover/add:rotate-90" />
            )}
            <span className="hidden sm:inline">Add Entry</span>
          </button>
        </div>
      </form>

      {/* Error state removed - using toasts */}

      {/* List Container */}
      <div className="rounded-2xl border border-white/6 bg-zinc-900/10 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-[0_0_50px_-12px_rgba(0,210,255,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                <th className="px-6 py-4">Security Target</th>
                <th className="px-6 py-4">Entry Type</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {rules.length > 0 ? (
                rules.map((rule) => (
                  <tr key={rule.id} className="group hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-white/3 border border-white/5 group-hover:border-neon-blue/20 group-hover:bg-neon-blue/5 transition-all duration-500">
                          {rule.entry_type === 'domain' ? 
                            <Globe className="w-3.5 h-3.5 text-zinc-500 group-hover:text-neon-blue transition-colors" /> : 
                            <Hash className="w-3.5 h-3.5 text-zinc-500 group-hover:text-neon-blue transition-colors" />
                          }
                        </div>
                        <span className="font-bold text-white group-hover:text-neon-blue transition-colors tracking-tight">
                          {rule.value}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-white/3 px-2.5 py-1 rounded-md border border-white/5">
                        {rule.entry_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteRule(rule.id, rule.value)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-all group/btn"
                        title="Remove Rule"
                      >
                        <Trash2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 rounded-full bg-white/2 border border-white/5">
                        {type === 'block' ? 
                          <ShieldAlert className="w-6 h-6 text-zinc-700" /> : 
                          <ShieldCheck className="w-6 h-6 text-zinc-700" />
                        }
                      </div>
                      <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">
                        No custom {type}list rules
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
