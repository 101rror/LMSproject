import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { posts } from '@/lib/api/data';
export default function BlogPage() { return <><SiteHeader /><main className="mx-auto max-w-7xl px-6 py-20"><PageHeader eyebrow="Luma journal" title="Ideas worth lingering with." description="Thoughts on learning, making, and the small practices that keep us moving." /><div className="mt-16 grid gap-5 md:grid-cols-3">{posts.map((post, i) => <Link href={`/blog/${post.id}`} key={post.id} className={`group rounded-2xl border border-[var(--line)] p-6 transition hover:-translate-y-1 hover:bg-white ${i === 0 ? 'bg-[#dcebe1]' : ''}`}><div className="flex justify-between"><Badge>{post.category}</Badge><ArrowUpRight size={20} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></div><h2 className="mt-20 font-[family-name:var(--font-display)] text-3xl leading-tight">{post.title}</h2><p className="mt-4 text-sm leading-6 text-[#65736d]">{post.excerpt}</p><p className="mt-8 text-xs font-bold text-[#87938d]">{post.date} · {post.readTime}</p></Link>)}</div></main></> }
