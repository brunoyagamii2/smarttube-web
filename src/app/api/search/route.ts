import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || "carros e robos para crianças";
  
  // Usaremos uma instância que está com 100% de estabilidade hoje
  const url = `https://pipedapi.adminforge.de/search?q=${encodeURIComponent(q)}&filter=videos`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 0 }
    });
    
    const data = await res.json();
    return NextResponse.json(data.items || []);
  } catch (error) {
    return NextResponse.json([]);
  }
}