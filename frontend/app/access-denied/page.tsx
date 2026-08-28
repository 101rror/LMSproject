'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { ROLE_ROUTES } from '@/lib/auth/roles';

export default function AccessDeniedPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <ShieldAlert className="h-16 w-16 text-destructive" />
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p className="max-w-md text-center text-muted-foreground">
        You don&apos;t have permission to access this page. Your role ({user?.role || 'unknown'}) does not allow this action.
      </p>
      <Button asChild>
        <Link href={user ? ROLE_ROUTES[user.role] : '/login'}>
          Go to your dashboard
        </Link>
      </Button>
    </div>
  );
}
