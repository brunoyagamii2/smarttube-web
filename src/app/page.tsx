"use client";

import React, { useState, useEffect } from 'react';
import { searchVideos } from '@/lib/api';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [busca, setBusca] = useState("Carros e robôs para crianças");
  const [videoSelecionado, setVideoSelecionado] = useState<string | null>(null);

  const carregarVideos = async (termo: string) => {
    const resultados = await searchVideos(termo);
    // Filtramos para garantir que só entrem itens que tenham imagem e link
    if (resultados) {
      setVideos(resultados);
    }
  };

  useEffect(() => {
    carregarVideos(busca);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans p-8">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold italic">SmartTube <span className="text-red-600">Web</span></h1>
        <div className="flex gap-2 w-full max-w-2xl">
          <input 
            type="text" 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-red-600"
            placeholder="O que o Thomas quer ver?"
          />
          <button onClick={() => carregarVideos(busca)} className="bg-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors">Buscar</button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((video: any, index: number) => {
          // Extração robusta do ID do vídeo
          const videoId = video.url?.split("v=")[1] || video.videoId || video.url?.split("/").pop();
          const thumb = video.thumbnail || video.videoThumbnails?.[0]?.url;

          return (
            <div 
              key={videoId || index} 
              className="group cursor-pointer"
              onClick={() => videoId && setVideoSelecionado(videoId)}
            >
              <div className="aspect-video bg-zinc-800 rounded-xl mb-2 overflow-hidden border-2 border-transparent group-hover:border-red-600 transition-all shadow-lg">
                <img 
                  src={thumb} 
                  className="w-full h-full object-cover" 
                  alt={video.title} 
                  onError={(e: any) => e.target.src = 'https://via.placeholder.com/480x270?text=Vídeo+de+Robô'} 
                />
              </div>
              <h3 className="text-sm font-medium line-clamp-2 text-zinc-300 group-hover:text-white">{video.title}</h3>
              <p className="text-xs text-zinc-500 mt-1">{video.uploaderName || video.author}</p>
            </div>
          );
        })}
      </div>

      {videoSelecionado && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <button 
            onClick={() => setVideoSelecionado(null)}
            className="absolute top-5 right-5 text-white text-5xl hover:text-red-600 transition-colors"
          >
            ×
          </button>
          <div className="w-full max-w-5xl aspect-video shadow-2xl border border-zinc-800 rounded-2xl overflow-hidden">
            <iframe 
              src={`https://www.youtube.com/embed/${videoSelecionado}?autoplay=1&modestbranding=1&rel=0`}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
          <p className="mt-6 text-zinc-400 font-medium">Divirta-se, Thomas! 🏎️🤖</p>
        </div>
      )}
    </div>
  );
}