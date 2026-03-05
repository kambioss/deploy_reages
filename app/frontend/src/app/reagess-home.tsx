"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n-context";
import {
  MapPin,
  Satellite,
  TreePine,
  AlertTriangle,
  Wheat,
  Waves,
  Users,
  BookOpen,
  Globe,
  Calendar,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Star,
  Network,
  Heart,
  Target,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronDown,
} from "lucide-react";

// ─── Video slides ─────────────────────────────────────────────────────────────
const VIDEOS = [
  "https://assets.mixkit.co/videos/10090/10090-720.mp4",
  "https://assets.mixkit.co/videos/31689/31689-720.mp4",
  "https://assets.mixkit.co/videos/47401/47401-720.mp4",
];

const EXPERTISE_ICONS = [
  MapPin,
  Satellite,
  TreePine,
  AlertTriangle,
  Waves,
  Wheat,
];
const EXPERTISE_GRADIENTS = [
  "from-blue-600 to-cyan-500",
  "from-emerald-600 to-teal-500",
  "from-orange-600 to-amber-500",
  "from-yellow-600 to-orange-500",
  "from-cyan-600 to-blue-600",
  "from-lime-600 to-emerald-500",
];
const WHY_ICONS = [Globe, Users, BookOpen, Calendar, Lightbulb, TrendingUp];
const WHY_GRADIENTS = [
  "from-blue-600 to-indigo-600",
  "from-purple-600 to-pink-500",
  "from-emerald-600 to-green-500",
  "from-orange-600 to-red-500",
  "from-cyan-600 to-blue-500",
  "from-teal-600 to-emerald-500",
];

// ─── Reveal on scroll (cascade) ───────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
}

function StatCard({
  label,
  value,
  suffix = "",
  active,
}: {
  label: string;
  value: number;
  suffix?: string;
  active: boolean;
}) {
  const n = useCountUp(value, 2000, active);
  return (
    <div className="text-center py-4 md:py-0 group">
      <div className="text-5xl md:text-6xl font-bold text-white tabular-nums mb-1 font-sans transition-transform group-hover:scale-110 duration-300">
        {n}
        {suffix}
      </div>
      <div className="text-slate-400 text-xs font-bold tracking-widest uppercase font-sans">
        {label}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ReagessHome() {
  const { t, tRaw } = useI18n();

  // Video state
  const [videoIdx, setVideoIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // On video end, advance
  const handleVideoEnd = () => setVideoIdx((i) => (i + 1) % VIDEOS.length);

  // When index changes, reload video
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.load();
    if (playing) videoRef.current.play().catch(() => {});
  }, [videoIdx]);

  // Pause/play sync
  useEffect(() => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.play().catch(() => {});
    else videoRef.current.pause();
  }, [playing]);

  // Stats IntersectionObserver
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsOn, setStatsOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStatsOn(true);
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  // Parallax scroll effect for hero overlay
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const expertiseItems = tRaw("expertise.items") as {
    title: string;
    description: string;
  }[];
  const whyItems = tRaw("whyJoin.items") as {
    title: string;
    description: string;
  }[];
  const valueItems = tRaw("vmv.values.items") as string[];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ════════════════════════════════════════════════════
          HERO — Video Background
      ════════════════════════════════════════════════════ */}
      <section className="relative w-full h-screen min-h-[700px] overflow-hidden">
        {/* Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted={muted}
          playsInline
          autoPlay
          onEnded={handleVideoEnd}
          style={{ transform: `scale(1.05) translateY(${scrollY * 0.15}px)` }}
        >
          <source src={VIDEOS[videoIdx]} type="video/mp4" />
        </video>

        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/92 via-[#0d2444]/82 to-[#0c3060]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 via-transparent to-transparent" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Ambient glows */}
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse"
          style={{ animationDuration: "8s" }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center pt-28 pb-20">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-4xl animate-fade-up">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-300 text-sm font-bold tracking-widest uppercase font-sans">
                  {t("hero.badge")}
                </span>
              </div>

              {/* Title */}
              <h1
                className="page-h1 text-white mb-6 leading-[1.05]"
                style={{
                  textShadow: "0 4px 32px rgba(0,0,0,0.5)",
                  fontSize: "var(--text-hero)",
                }}
              >
                {t("hero.title")}
                <br />
                <span className="text-gradient">{t("hero.titleAccent")}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl font-sans">
                {t("hero.subtitle")}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all duration-300 border-0 h-auto text-base"
                  >
                    {t("hero.ctaPrimary")}{" "}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/actualites">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/5 hover:bg-white/15 border border-white/25 text-white font-semibold px-8 py-4 rounded-2xl backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 h-auto text-base"
                  >
                    {t("hero.ctaSecondary")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Video controls (bottom left) */}
        <div className="absolute bottom-10 left-6 z-20 flex items-center gap-2">
          {VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setVideoIdx(i)}
              className={`rounded-full transition-all duration-300 ${i === videoIdx ? "w-10 h-2.5 bg-cyan-400" : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"}`}
              aria-label={`Vidéo ${i + 1}`}
            />
          ))}
          <button
            onClick={() => setPlaying((p) => !p)}
            className="ml-2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={() => setMuted((m) => !m)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label={muted ? "Activer le son" : "Couper le son"}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <span className="text-xs font-sans tracking-widest uppercase">
            Scroll
          </span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          STATS BAND
      ════════════════════════════════════════════════════ */}
      <section
        ref={statsRef}
        className="relative bg-gradient-to-r from-[#0a1628] via-[#0d2444] to-[#0a1628] py-16 px-6 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-white/10">
            <StatCard
              label={t("stats.members")}
              value={0}
              suffix="+"
              active={statsOn}
            />
            <StatCard label={t("stats.countries")} value={0} active={statsOn} />
            <StatCard
              label={t("stats.projects")}
              value={0}
              suffix="+"
              active={statsOn}
            />
            <StatCard
              label={t("stats.publications")}
              value={0}
              suffix="+"
              active={statsOn}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          EXPERTISE
      ════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <div className="section-label mx-auto w-fit">
              {t("expertise.sectionLabel")}
            </div>
            <h2 className="section-h2 text-slate-900 mb-4">
              {t("expertise.sectionTitle")}
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed font-sans">
              {t("expertise.sectionDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(expertiseItems) &&
              expertiseItems.map((item, i) => {
                const Icon = EXPERTISE_ICONS[i] ?? MapPin;
                return (
                  <div
                    key={i}
                    className="card-hover group relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm overflow-hidden cursor-default animate-slide-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {/* Hover accent border */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        boxShadow: "inset 0 0 0 1.5px rgba(14,165,233,0.4)",
                      }}
                    />
                    {/* Background glow on hover */}
                    <div
                      className={`absolute -top-6 -right-6 w-28 h-28 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${EXPERTISE_GRADIENTS[i]} blur-2xl rounded-full pointer-events-none`}
                    />
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${EXPERTISE_GRADIENTS[i]} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="card-h3 text-slate-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-sm font-sans">
                      {item.description}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          ABOUT — SPLIT LAYOUT
      ════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div className="animate-slide-left">
              <div className="section-label">{t("about.sectionLabel")}</div>
              <h2 className="section-h2 text-slate-900 mb-8">
                {t("about.title")}
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed font-sans">
                <p>{t("about.p1")}</p>
                <p>{t("about.p2")}</p>
                <p>{t("about.p3")}</p>
              </div>

              {/* Vision box */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-600 text-white shadow-xl shadow-blue-600/20">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-cyan-200" />
                  <span className="text-cyan-200 text-xs font-bold uppercase tracking-widest font-sans">
                    {t("about.visionLabel")}
                  </span>
                </div>
                <p className="text-white/95 leading-relaxed font-medium text-sm font-sans">
                  {t("about.visionText")}
                </p>
              </div>

              <div className="mt-8">
                <Link href="/a-propos">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-2xl font-semibold transition-all duration-300 h-auto py-3 px-8"
                  >
                    {t("about.cta")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Decorative globe */}
            <div className="flex items-center justify-center animate-slide-right">
              <div className="relative w-full max-w-[440px] aspect-square">
                {/* Outer pulsing rings */}
                <div
                  className="absolute inset-0 rounded-full border border-cyan-200/20 animate-ping"
                  style={{ animationDuration: "4s" }}
                />
                <div className="absolute inset-4 rounded-full border border-slate-200/30" />
                <div className="absolute inset-8 rounded-full border border-cyan-200/40" />

                {/* Globe body */}
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-[#0a1628] via-[#0d2444] to-[#0c3060] shadow-2xl overflow-hidden">
                  {/* Grid lines */}
                  {[20, 40, 60, 80].map((p) => (
                    <div
                      key={`h${p}`}
                      className="absolute left-0 right-0 border-t border-white/[0.07]"
                      style={{ top: `${p}%` }}
                    />
                  ))}
                  {[20, 40, 60, 80].map((p) => (
                    <div
                      key={`v${p}`}
                      className="absolute top-0 bottom-0 border-l border-white/[0.07]"
                      style={{ left: `${p}%` }}
                    />
                  ))}
                  {/* Continents */}
                  <div className="absolute top-[22%] left-[25%] w-[40%] h-[40%] bg-emerald-500/25 rounded-full blur-md" />
                  <div className="absolute top-[12%] left-[52%] w-[26%] h-[28%] bg-blue-500/20 rounded-full blur-md" />
                  <div className="absolute bottom-[20%] left-[20%] w-[22%] h-[22%] bg-cyan-400/20 rounded-full blur-md" />
                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe className="h-14 w-14 text-cyan-400/40" />
                  </div>
                  {/* Satellite dots */}
                  {[
                    { top: "8%", left: "68%" },
                    { top: "76%", left: "62%" },
                    { top: "42%", left: "8%" },
                  ].map((pos, i) => (
                    <div
                      key={i}
                      className="absolute w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                      style={{ top: pos.top, left: pos.left }}
                    >
                      <div
                        className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-50"
                        style={{ animationDelay: `${i * 0.9}s` }}
                      />
                    </div>
                  ))}
                </div>

                {/* Floating chips */}
                <div className="absolute top-4 right-2 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-xl border border-slate-100/80 text-xs font-bold text-slate-700 flex items-center gap-1.5 font-sans">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Afrique
                </div>
                <div className="absolute bottom-8 left-0 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-xl border border-slate-100/80 text-xs font-bold text-slate-700 flex items-center gap-1.5 font-sans">
                  <Satellite className="h-3 w-3 text-blue-600" />
                  Télédétection
                </div>
                <div className="absolute top-[48%] -right-2 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-xl border border-slate-100/80 text-xs font-bold text-slate-700 flex items-center gap-1.5 font-sans">
                  <Network className="h-3 w-3 text-purple-600" />
                  Réseau
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          VISION / MISSION / VALEURS
      ════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <div className="section-label mx-auto w-fit">Notre ADN</div>
            <h2 className="section-h2 text-slate-900">
              Vision, Mission &amp; Valeurs
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Vision — dark glass */}
            <div className="card-hover relative rounded-2xl p-8 bg-gradient-to-br from-[#0a1628] to-[#0d2444] text-white overflow-hidden shadow-2xl">
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle,#fff 1px,transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-purple-600/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-purple-300" />
                </div>
                <h3 className="card-h3 text-white mb-4">
                  {t("vmv.vision.title")}
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm font-sans">
                  {t("vmv.vision.text")}
                </p>
              </div>
            </div>

            {/* Mission — cyan gradient */}
            <div className="card-hover relative rounded-2xl p-8 bg-gradient-to-br from-blue-700 to-cyan-500 text-white overflow-hidden shadow-2xl shadow-blue-600/25">
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle,#fff 1px,transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-cyan-400/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                  <Lightbulb className="h-6 w-6 text-yellow-200" />
                </div>
                <h3 className="card-h3 text-white mb-4">
                  {t("vmv.mission.title")}
                </h3>
                <p className="text-blue-50 leading-relaxed text-sm font-sans">
                  {t("vmv.mission.text")}
                </p>
              </div>
            </div>

            {/* Values — light */}
            <div className="card-hover rounded-2xl p-8 bg-slate-50 border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="card-h3 text-slate-900 mb-5">
                {t("vmv.values.title")}
              </h3>
              <ul className="space-y-2.5">
                {Array.isArray(valueItems) &&
                  valueItems.map((v, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-slate-600 font-sans"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {v}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          WHY JOIN
      ════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <div className="section-label mx-auto w-fit">
              {t("whyJoin.sectionLabel")}
            </div>
            <h2 className="section-h2 text-slate-900 mb-4">
              {t("whyJoin.title")}
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto font-sans">
              {t("whyJoin.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(whyItems) &&
              whyItems.map((item, i) => {
                const Icon = WHY_ICONS[i] ?? Globe;
                return (
                  <div
                    key={i}
                    className="card-hover group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm animate-slide-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${WHY_GRADIENTS[i]} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="card-h3 text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                );
              })}
          </div>

          <div className="text-center mt-12">
            <Link href="/pourquoi-nous-rejoindre">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-2xl font-semibold transition-all duration-300 px-10 h-auto py-3.5"
              >
                {t("whyJoin.cta")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0a1628] via-[#0d2444] to-[#0a1628] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 container mx-auto text-center max-w-3xl">
          <h2 className="section-h2 text-white mb-5">{t("ctaBanner.title")}</h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed font-sans">
            {t("ctaBanner.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-10 rounded-2xl shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all duration-300 border-0 h-auto py-4 text-base"
              >
                {t("ctaBanner.ctaPrimary")}{" "}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/5 hover:bg-white/15 border border-white/25 text-white font-semibold px-10 rounded-2xl backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 h-auto py-4 text-base"
              >
                {t("ctaBanner.ctaSecondary")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
