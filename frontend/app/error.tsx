'use client';
import { Button } from '@/components/ui/button';
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="grid min-h-screen place-items-center p-6 text-center"><div><p className="text-sm font-bold text-[var(--coral)]">Something went sideways</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl">Let&apos;s try that again.</h1><Button onClick={reset} className="mt-8">Reload page</Button></div></main>; }
