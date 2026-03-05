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
      description: "",
      image:
        "https://img.freepik.com/photos-gratuite/belles-plantes-dans-environnement-naturel_23-2151357966.jpg?semt=ais_hybrid&w=740&q=80",
      category: "Réseau Africain",
      icon: "🌍",
    },
    {
      id: 2,
      title: "Cartographie et SIG",
      description: "",
      image:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjlnmDw6GRoDswrfBo1sRCCEbg1-HQExSu0nvVl5cjGAB9AHblcBaTB0TM0YD-I7KkwHv9vityByttrcnZvLIzBWdPng3JP-G42ibAPZEfnDAa1wRXrujlxPxzY9lIx9Ji6klXKiv6gKfUz/?imgmax=800",
      category: "Cartographie",
      icon: "🗺️",
    },
    {
      id: 3,
      title: "Télédétection par Satellite",
      description: "",
      image:
        "https://cdn.mos.cms.futurecdn.net/v2/t:0,l:157,cw:405,ch:405,q:80,w:405/KnJ52ca4BX5nqXZHNLAJB5.jpg",
      category: "Télédétection",
      icon: "🛰️",
    },
    {
      id: 4,
      title: "Formation et Recherche",
      description: "",
      image:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&h=1080&fit=crop",
      category: "Éducation",
      icon: "🎓",
    },
    {
      id: 5,
      title: "Technologies Géospatiales",
      description: "",
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
                  <div className="flex flex-col sm:flex-row gap-4"></div>
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
    </div>
  );
};

export default HeroSlider;
