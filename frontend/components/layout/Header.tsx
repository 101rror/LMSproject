'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, Menu } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">CPS Academy</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/courses" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Courses
          </Link>
          <Link href="/blog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium sm:block">
                {user.username}
              </span>
              <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
