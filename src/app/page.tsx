"use client";

import React, { useState, useEffect } from 'react';
import { searchVideos } from '@/lib/api';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [busca, setBusca] = useState("Carros e robôs para crianças");
  const [videoSelecionado, setVideoSelecionado] = useState<string | null>(null);

  const carregarVideos = async (termo: string) => {
    const resultados = await searchVideos(termo);
    setVideos(resultados);
  };

  useEffect(() => {
    carregarVideos(busca);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans p-8">
      {/* Interface Principal */}
      <header className="mb-10">
        <h1 className="text-2xl font-bold mb-4">SmartTube <span className="text-red-600">Web</span></h1>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full max-w-xl bg-zinc-900 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-red-600"
            placeholder="Buscar no YouTube..."
          />
          <button onClick={() => carregarVideos(busca)} className="bg-red-600 px-6 py-2 rounded-lg font-bold">Buscar</button>
        </div>
      </header>

      {/* Grade de Vídeos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((video: any) => (
          <div 
            key={video.url} 
            className="group cursor-pointer"
            onClick={() => {
              // Extrai o ID do vídeo da URL (ex: /watch?v=ID)
              const id = video.url.split("v=")[1];
              setVideoSelecionado(id);
            }}
          >
            <div className="aspect-video bg-zinc-800 rounded-xl mb-2 overflow-hidden border border-transparent group-hover:border-red-600 transition-all">
              <img src={video.thumbnail} className="w-full h-full object-cover" alt="" />
            </div>
            <h3 className="text-sm font-medium line-clamp-2">{video.title}</h3>
          </div>
        ))}
      </div>

      {/* Player Modal (Onde o vídeo roda) */}
      {videoSelecionado && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50 p-4">
          <button 
            onClick={() => setVideoSelecionado(null)}
            className="absolute top-5 right-5 text-white text-4xl hover:text-red-600"
          >
            ×
          </button>
          <div className="w-full max-w-5xl aspect-video">
            <iframe 
              src={`https://www.youtube.com/embed/${videoSelecionado}?autoplay=1`}
              className="w-full h-full rounded-2xl shadow-2xl"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
          <p className="mt-4 text-zinc-400 font-bold">Assistindo no SmartTube Web de Bruno</p>
        </div>
      )}
    </div>
  );
}