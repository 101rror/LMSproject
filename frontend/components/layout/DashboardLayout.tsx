'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GraduationCap, Menu, X } from 'lucide-react';
import type { UserRole } from '@/types/user';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push('/access-denied');
      return;
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background md:block">
        <Sidebar
          role={user.role}
          username={user.username}
          onLogout={logout}
        />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 border-r bg-background">
            <Sidebar
              role={user.role}
              username={user.username}
              onLogout={logout}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="md:pl-64">
        {/* Mobile header */}
        <div className="flex h-16 items-center gap-3 border-b bg-background px-4 md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-md p-2 hover:bg-accent">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">CPS Academy</span>
          </div>
        </div>

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
