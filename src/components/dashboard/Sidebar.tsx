'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  Globe,
  ShieldCheck,
  Plug,
  BarChart3,
  Settings,
  Menu,
  X,
  User,
  ChevronRight,
  Fingerprint
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

import { APP_CONFIG } from "@/lib/constants";

interface SidebarProps {
  incidentCount?: number;
  user?: any;
}

export function Sidebar({ incidentCount = 0, user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Security Op';
  const userEmail = user?.email || '';
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menuItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/dashboard', group: 'MONITORING' },
    {
      label: 'Incidents',
      icon: ShieldAlert,
      path: '/dashboard/incidents',
      group: 'MONITORING',
      badge: incidentCount > 0 ? incidentCount.toString() : null
    },
    { label: 'Global Intel', icon: Globe, path: '/dashboard/intel', group: 'MONITORING' },
    { label: 'Rules & Lists', icon: ShieldCheck, path: '/dashboard/rules', group: 'CONFIG' },
    { label: 'Provisioning', icon: Plug, path: '/dashboard/tokens', group: 'CONFIG' },
    { label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics', group: 'REPORTING' },
    { label: 'Preferences', icon: Settings, path: '/dashboard/settings', group: 'ACCOUNT' },
  ];

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-md border-b border-white/4 z-[60] flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(0,210,255,0.2)]">
            <img src="/logo-icon.png" alt={APP_CONFIG.shortName} className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-black text-white tracking-widest uppercase">{APP_CONFIG.shortName}</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-zinc-950/40 backdrop-blur-xl border-r border-white/4 flex flex-col z-[80]
        transition-all duration-500 ease-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Section */}
        <div className="p-8 hidden lg:block">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-neon-blue/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-zinc-900 border border-white/5 shadow-2xl group-hover:border-neon-blue/20 transition-all duration-500">
                <img src="/logo-icon.png" alt="S" className="w-full h-full object-contain p-1" />
              </div>
            </div>
            <div className="group-hover:translate-x-0.5 transition-transform duration-500">
              <h1 className="text-sm font-black text-white tracking-[0.15em] uppercase">{APP_CONFIG.shortName}</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1 h-1 shrink-0 rounded-full bg-neon-blue animate-pulse" />
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">{APP_CONFIG.tagline}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Mobile Brand */}
        <div className="p-8 lg:hidden border-b border-white/4 mb-4">
          <Link href="/" className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-zinc-900 border border-white/5">
              <img src="/logo-icon.png" alt={APP_CONFIG.shortName} className="w-full h-full object-contain p-1" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-[0.15em] uppercase">{APP_CONFIG.shortName}</h1>
              <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mt-0.5">{APP_CONFIG.tagline}</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 overflow-y-auto py-4 scrollbar-hide">
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group} className="mb-10">
              <h2 className="px-5 text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-5">{group}</h2>
              <div className="space-y-1.5">
                {items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`
                        relative flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 group
                        ${isActive
                          ? 'text-white bg-white/3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]'
                          : 'text-zinc-500 hover:text-white hover:bg-white/1'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute left-0 w-1 h-4 bg-neon-blue rounded-r-full shadow-[0_0_12px_#00d2ff]" />
                      )}

                      <item.icon
                        className={`w-4 h-4 transition-all duration-300 ${isActive ? 'text-neon-blue' : 'opacity-40 group-hover:opacity-100'}`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />

                      <span className={`text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                        {item.label}
                      </span>

                      {item.badge && (
                        <span className="ml-auto px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[9px] font-black border border-red-500/10">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="mt-auto p-4 border-t border-white/4 bg-white/1">
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-white/3 hover:bg-white/2 transition-all duration-500 group cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-1 bg-neon-blue/10 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-10 h-10 rounded-xl border border-white/10 overflow-hidden bg-zinc-900 group-hover:border-neon-blue/30 transition-all duration-500 flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <Fingerprint className="w-5 h-5 text-zinc-700 group-hover:text-neon-blue transition-colors" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-sm" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black text-white uppercase tracking-wider truncate group-hover:text-neon-blue transition-colors">
                {userName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="w-1 h-1 rounded-full bg-zinc-600" />
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight truncate">{userEmail}</p>
              </div>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-zinc-800 group-hover:text-zinc-600 transition-colors" />
          </div>
        </div>
      </aside>
    </>
  );
}
