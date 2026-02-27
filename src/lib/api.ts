export async function searchVideos(query: string) {
  try {
    // Adicionamos um número aleatório no final para o navegador não "viciar" no erro
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&t=${Date.now()}`);
    
    if (!res.ok) {
      console.error("Servidor da Vercel respondeu com erro");
      return [];
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao conectar com a API interna:", error);
    return [];
  }
}