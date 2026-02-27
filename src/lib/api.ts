export async function searchVideos(query: string) {
  try {
    // Isso garante que ele use a rota correta tanto local quanto na Vercel
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(query)}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return [];
    const data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
}