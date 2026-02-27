import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  // Usaremos uma instância que raramente bloqueia servidores
  const url = `https://pipedapi.kavin.rocks/search?q=${q}&filter=videos`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 } // Cache para ser mais rápido
    });
    const data = await res.json();
    return NextResponse.json(data.items || []);
  } catch (error) {
    return NextResponse.json({ error: 'Falha externa' }, { status: 500 });
  }
}