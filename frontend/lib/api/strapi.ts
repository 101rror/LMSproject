const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api';

export async function strapiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('luma_token') : null;
    const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }, next: { revalidate: 60 } });
    if (!response.ok) throw new Error(`Strapi request failed: ${response.status}`);
    return response.json();
}
