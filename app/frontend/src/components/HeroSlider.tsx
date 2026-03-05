"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Initiative Panafricaine",
      description:
        "Renforcer la collaboration entre les nations africaines pour un développement durable partagé",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop",
      category: "Réseau Africain",
      icon: "🌍",
    },
    {
      id: 2,
      title: "Cartographie et SIG",
      description:
        "Analyse précise des territoires avec des systèmes d'information géographique avancés",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1920&h=1080&fit=crop",
      category: "Cartographie",
      icon: "🗺️",
    },
    {
      id: 3,
      title: "Télédétection par Satellite",
      description:
        "Surveillance et analyse spatiale des territoires pour une meilleure gestion environnementale",
      image:
        "https://images.unsplash.com/photo-1446776653964-20c1d3a81bd0?w=1920&h=1080&fit=crop",
      category: "Télédétection",
      icon: "🛰️",
    },
    {
      id: 4,
      title: "Formation et Recherche",
      description:
        "Développement des compétences et promotion de l'excellence scientifique en Afrique",
      image:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&h=1080&fit=crop",
      category: "Éducation",
      icon: "🎓",
    },
    {
      id: 5,
      title: "Technologies Géospatiales",
      description:
        "Recherche, Formation, Analyse et Application au service du développement durable",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop",
      category: "Innovation",
      icon: "🚀",
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative w-full h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 via-emerald-800/90 to-teal-900/85"></div>

            {/* Contenu centré - CORRIGÉ */}
            <div className="absolute inset-0 flex items-center pt-24">
              <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-4xl">
                  <div className="mb-4">
                    <span className="inline-block px-5 py-2 bg-emerald-600/90 backdrop-blur-sm text-white text-base md:text-lg font-semibold rounded-full shadow-lg">
                      {slide.icon} {slide.category}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-2xl text-emerald-50 mb-6 md:mb-8 leading-relaxed drop-shadow-lg">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-xl">
                      Rejoindre le réseau
                    </button>
                    <button className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-lg transition-all border-2 border-white/30 shadow-xl">
                      Découvrir nos activités
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all"
      >
        <ChevronRight size={24} />
      </button>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-8 right-8 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-cyan-400 w-8"
                : "bg-white/50 w-2 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
export default HeroSlider;
