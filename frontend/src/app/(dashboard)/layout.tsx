'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { cn, getInitials } from '@/lib/utils';
import {
  LayoutDashboard, Megaphone, Users, Inbox, BarChart2,
  Settings, Zap, ChevronDown, LogOut, Plus, Bell,
  UserCheck, Menu, X,
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { label: 'LinkedIn Accounts', href: '/accounts', icon: UserCheck },
  { label: 'Inbox', href: '/inbox', icon: Inbox },
  { label: 'Analytics', href: '/analytics', icon: BarChart2 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, fetchMe, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('lr_token');
    if (!token) { router.push('/login'); return; }
    if (!user) fetchMe();
  }, []);

  const Sidebar = () => (
    <aside className="flex flex-col h-full" style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border)' }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand)' }}>
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>LinkedReach</span>
      </div>

      {/* New Campaign CTA */}
      <div className="px-4 py-4">
        <Link href="/campaigns/new" className="btn-primary w-full justify-center text-sm py-2">
          <Plus size={15} /> New Campaign
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'text-white'
                  : 'hover:text-white'
              )}
              style={{
                background: active ? 'var(--brand-glow)' : 'transparent',
                color: active ? 'var(--brand)' : 'var(--text-secondary)',
                borderLeft: active ? '2px solid var(--brand)' : '2px solid transparent',
              }}>
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: 'var(--brand)', color: 'white' }}>
            {user ? getInitials(user.name) : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.plan} plan</p>
          </div>
          <button onClick={logout} className="p-1 rounded transition-colors hover:text-red-400"
            style={{ color: 'var(--text-muted)' }} title="Logout">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-60 flex-shrink-0 flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 flex flex-col z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
          <button className="lg:hidden p-1.5 rounded-lg" style={{ color: 'var(--text-secondary)' }}
            onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)', background: 'var(--bg-elevated)' }}>
              <Bell size={17} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--brand)' }} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
