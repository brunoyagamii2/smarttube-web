"use client";

import React, { useState, useEffect } from 'react';
import { searchVideos } from '@/lib/api';

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [busca, setBusca] = useState("Carros e robôs para crianças");
  const [videoSelecionado, setVideoSelecionado] = useState<string | null>(null);

  const carregarVideos = async (termo: string) => {
    const resultados = await searchVideos(termo);
    if (resultados) setVideos(resultados);
  };

  useEffect(() => {
    carregarVideos(busca);
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data === 'string' && event.data.includes('onStateChange')) {
        const data = JSON.parse(event.data);
        if (data.info === 0) tocarProximo();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [videoSelecionado, videos]);

  const tocarProximo = () => {
    const indice = videos.findIndex(v => {
      const id = v.url?.split("v=")[1] || v.videoId || v.url?.split("/").pop();
      return id === videoSelecionado;
    });
    if (indice !== -1 && indice < videos.length - 1) {
      const proximo = videos[indice + 1];
      const nextId = proximo.url?.split("v=")[1] || proximo.videoId || proximo.url?.split("/").pop();
      setVideoSelecionado(nextId);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
      <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold italic">SmartTube <span className="text-red-600">Web</span></h1>
        <div className="flex gap-2 w-full max-w-2xl">
          <input 
            type="text" value={busca} onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg"
            placeholder="O que vamos ver hoje?"
          />
          <button onClick={() => carregarVideos(busca)} className="bg-red-600 px-6 py-2 rounded-lg font-bold">Buscar</button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((video: any, index: number) => {
          const videoId = video.url?.split("v=")[1] || video.videoId || video.url?.split("/").pop();
          const thumb = video.thumbnail || (video.videoThumbnails && video.videoThumbnails[0]?.url);
          return (
            <div key={videoId || index} className="group cursor-pointer" onClick={() => videoId && setVideoSelecionado(videoId)}>
              <div className="aspect-video bg-zinc-800 rounded-xl mb-2 overflow-hidden border-2 border-transparent group-hover:border-red-600 transition-all">
                <img src={thumb} className="w-full h-full object-cover" alt="" />
              </div>
              <h3 className="text-sm font-medium line-clamp-2">{video.title}</h3>
            </div>
          );
        })}
      </div>

      {videoSelecionado && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 p-4">
          <button onClick={() => setVideoSelecionado(null)} className="absolute top-5 right-5 text-white text-5xl">×</button>
          <div className="w-full max-w-5xl aspect-video">
            <iframe 
              src={`https://www.youtube.com/embed/${videoSelecionado}?autoplay=1&enablejsapi=1`}
              className="w-full h-full rounded-2xl"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
          <p className="mt-4 text-zinc-500">Próximo vídeo toca sozinho! 🏎️</p>
        </div>
      )}
    </div>
  );
}