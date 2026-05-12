'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updatePreference } from '@/lib/actions/preferences';

interface SettingsTogglesProps {
  initialPrefs: any;
}

export function SettingsToggles({ initialPrefs }: SettingsTogglesProps) {
  const [saving, setSaving] = useState<string | null>(null);
  const [prefs, setPrefs] = useState({
    anonymized_logging: initialPrefs?.anonymized_logging ?? true,
    auto_cleanup: (initialPrefs?.auto_cleanup_days ?? 90) > 0,
    threat_alerts: true,
    extension_active: true,
  });

  async function togglePref(key: keyof typeof prefs, label: string) {
    const newValue = !prefs[key];
    const prevValue = prefs[key];
    
    // Optimistic update
    setPrefs(prev => ({ ...prev, [key]: newValue }));
    setSaving(key);

    try {
      await updatePreference(key, newValue);
      toast.success(`${label} ${newValue ? 'Enabled' : 'Disabled'}`);
    } catch (error) {
      toast.error(`Failed to update ${label}`);
      setPrefs(prev => ({ ...prev, [key]: prevValue })); // Revert
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Group 1: Data Privacy */}
      <div className="space-y-4">
        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">Data & Privacy</h3>
        
        {/* Anonymized Logging */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-bold text-white">Anonymized Logging</p>
            <p className="text-xs text-zinc-500">Hash-only storage for incident domains.</p>
          </div>
          <button
            onClick={() => togglePref('anonymized_logging', 'Anonymized Logging')}
            disabled={saving === 'anonymized_logging'}
            className={`relative h-5 w-10 rounded-full transition-all duration-300 ${
              prefs.anonymized_logging ? 'bg-neon-blue/20 border-neon-blue/30' : 'bg-zinc-800 border-zinc-700'
            } border flex items-center px-1`}
          >
            <div
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                prefs.anonymized_logging 
                  ? 'bg-neon-blue shadow-[0_0_8px_rgba(0,210,255,0.5)] translate-x-5' 
                  : 'bg-zinc-500 translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Auto-Cleanup */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-bold text-white">Incident Auto-Cleanup</p>
            <p className="text-xs text-zinc-500">Purge logs older than 90 days automatically.</p>
          </div>
          <button
            onClick={() => togglePref('auto_cleanup', 'Auto-Cleanup')}
            disabled={saving === 'auto_cleanup'}
            className={`relative h-5 w-10 rounded-full transition-all duration-300 ${
              prefs.auto_cleanup ? 'bg-neon-blue/20 border-neon-blue/30' : 'bg-zinc-800 border-zinc-700'
            } border flex items-center px-1`}
          >
            <div
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                prefs.auto_cleanup 
                  ? 'bg-neon-blue shadow-[0_0_8px_rgba(0,210,255,0.5)] translate-x-5' 
                  : 'bg-zinc-500 translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Group 2: Notifications */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">Notifications</h3>
        
        {/* Threat Alerts */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-bold text-white">Browser Threat Alerts</p>
            <p className="text-xs text-zinc-500">Real-time desktop notifications for blocked threats.</p>
          </div>
          <button
            onClick={() => togglePref('threat_alerts', 'Threat Alerts')}
            disabled={saving === 'threat_alerts'}
            className={`relative h-5 w-10 rounded-full transition-all duration-300 ${
              prefs.threat_alerts ? 'bg-neon-blue/20 border-neon-blue/30' : 'bg-zinc-800 border-zinc-700'
            } border flex items-center px-1`}
          >
            <div
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                prefs.threat_alerts 
                  ? 'bg-neon-blue shadow-[0_0_8px_rgba(0,210,255,0.5)] translate-x-5' 
                  : 'bg-zinc-500 translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
