export async function searchVideos(query: string) {
  try {
    // Chamada para a sua própria API interna
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Erro na busca");
    return await res.json();
  } catch (error) {
    console.error("Erro no cliente:", error);
    return [];
  }
}