"use client";
import React from "react";

interface PageHeroProps {
  icon: React.ReactNode;
  label?: string;
  title: string;
  subtitle: string;
  /** Optional gradient override (tailwind classes) */
  gradient?: string;
}

/**
 * Shared hero for ALL inner pages — same font size as homepage hero.
 * Keeps visual consistency across Mission, Vision, Valeurs, etc.
 */
export default function PageHero({ icon, label, title, subtitle, gradient }: PageHeroProps) {
  const bg = gradient || "from-[#0a1628] via-[#0d2444] to-[#0c2340]";

  return (
    <section
      className={`inner-hero bg-gradient-to-br ${bg}`}
      style={{ paddingTop: "5rem" }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        {/* Icon */}
        <div className="relative inline-flex mb-7">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/50 to-blue-600/50 rounded-full blur-2xl" />
          <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white/20 shadow-2xl">
            {icon}
          </div>
        </div>

        {/* Label */}
        {label && (
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 text-xs font-bold tracking-widest uppercase font-sans">{label}</span>
          </div>
        )}

        {/* Title — uses CSS var for consistent size with homepage */}
        <h1
          className="page-h1 text-white mb-5"
          style={{ textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg font-sans">
          {subtitle}
        </p>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" className="w-full h-auto" preserveAspectRatio="none">
          <path
            className="wave-white"
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          />
        </svg>
      </div>
    </section>
  );
}
