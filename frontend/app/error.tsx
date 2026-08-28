'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">An unexpected error occurred. Please try again.</p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
