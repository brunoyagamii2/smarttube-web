import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Isso obriga a Vercel a buscar sempre dados novos

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || "carros e robos para crianças";
  
  // Usaremos um servidor reserva que é muito estável
  const url = `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(q)}&filter=videos`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 0 } // Não guarda cache de erro
    });
    
    const data = await res.json();
    return NextResponse.json(data.items || []);
  } catch (error) {
    return NextResponse.json([]); // Se der erro, manda lista vazia para não travar o site
  }
}