import { strapiFetch } from '@/lib/api/strapi';
export async function login(identifier: string, password: string) { const result = await strapiFetch<{ jwt: string; user: unknown }>('/auth/local', { method: 'POST', body: JSON.stringify({ identifier, password }) }); localStorage.setItem('luma_token', result.jwt); return result; }
export async function register(username: string, email: string, password: string) { return strapiFetch('/auth/local/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }); }
export function logout() { localStorage.removeItem('luma_token'); }
