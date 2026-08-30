'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { UserRole } from '@/types/user';
import { ROLE_LABELS } from '@/lib/auth/roles';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, BookOpen, GraduationCap, FileText, Users,
  BarChart3, PenSquare, ClipboardList, Award, LogOut, Settings,
  TrendingUp, Layers, HelpCircle, Newspaper
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  student: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Browse Courses', href: '/courses', icon: BookOpen },
    { label: 'My Courses', href: '/my-courses', icon: GraduationCap },
    { label: 'Results', href: '/results', icon: Award },
    { label: 'Blog', href: '/blog', icon: Newspaper },
  ],
  instructor: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', href: '/management/courses', icon: BookOpen },
    { label: 'Lessons', href: '/management/lessons', icon: Layers },
    { label: 'Quizzes', href: '/management/quizzes', icon: HelpCircle },
    { label: 'Student Progress', href: '/management/progress', icon: TrendingUp },
  ],
  content_manager: [
    { label: 'Dashboard', href: '/manager/dashboard', icon: LayoutDashboard },
    { label: 'Browse Courses', href: '/courses', icon: BookOpen },
    { label: 'My Courses', href: '/my-courses', icon: GraduationCap },
    { label: 'Results', href: '/results', icon: Award },
    { label: 'Blog', href: '/blog', icon: Newspaper },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Courses', href: '/admin/courses', icon: BookOpen },
    { label: 'Lessons', href: '/admin/lessons', icon: Layers },
    { label: 'Quizzes', href: '/admin/quizzes', icon: HelpCircle },
    { label: 'Blog Posts', href: '/admin/blog', icon: Newspaper },
    { label: 'Statistics', href: '/admin/statistics', icon: BarChart3 },
  ],
};

interface SidebarProps {
  role: UserRole;
  username: string;
  onLogout: () => void;
  onNavigate?: () => void;
}

export function Sidebar({ role, username, onLogout, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role] || NAV_BY_ROLE.student;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-bold">CPS Academy</span>
      </div>

      <div className="border-b px-6 py-4">
        <p className="text-xs text-muted-foreground">Signed in as</p>
        <p className="text-sm font-semibold">{username}</p>
        <span className="mt-1 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
          {ROLE_LABELS[role]}
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}
