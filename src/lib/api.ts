export async function searchVideos(query: string) {
  try {
    // Usamos o caminho relativo para a API que criamos na pasta /api/search
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    
    if (!res.ok) {
      console.error("Erro na resposta do servidor");
      return [];
    }
    
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return [];
  }
}