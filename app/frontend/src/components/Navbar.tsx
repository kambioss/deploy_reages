"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, Search, ChevronDown, LogOut, User, ShieldCheck, Globe,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useI18n, SUPPORTED_LANGS, type Lang } from "@/lib/i18n-context";

const LANG_LABELS: Record<Lang, { short: string; label: string; flag: string }> = {
  fr: { short: "FR", label: "Français", flag: "🇫🇷" },
  en: { short: "EN", label: "English",  flag: "🇬🇧" },
};

const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { t, lang, setLang } = useI18n();

  const [isOpen,       setIsOpen]       = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled,   setIsScrolled]   = useState(false);
  const [langOpen,     setLangOpen]     = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const menuItems = [
    { title: t("nav.home"),    href: "/",         children: [] },
    {
      title: t("nav.about"), href: "/a-propos",
      children: [
        { title: t("nav.mission"),  href: "/mission" },
        { title: t("nav.vision"),   href: "/vision" },
        { title: t("nav.values"),   href: "/valeurs" },
        { title: t("nav.whyJoin"), href: "/pourquoi-nous-rejoindre" },
      ],
    },
    {
      title: t("nav.network"), href: "/reseau",
      children: [
        { title: t("nav.members"),       href: "/reseau/membres" },
        { title: t("nav.organisations"), href: "/reseau/organisations" },
        { title: t("nav.partners"),      href: "/reseau/partenaires" },
      ],
    },
    {
      title: t("nav.news"), href: "/actualites",
      children: [
        { title: t("nav.news"),       href: "/actualites" },
        { title: t("nav.events"),     href: "/actualites/evenements" },
        { title: t("nav.activities"), href: "/actualites/activites" },
      ],
    },
    {
      title: t("nav.projects"), href: "/projets",
      children: [
        { title: t("nav.allProjects"),       href: "/projets" },
        { title: t("nav.ongoingProjects"),   href: "/projets/encours" },
        { title: t("nav.completedProjects"), href: "/projets/termines" },
        { title: t("nav.projectCalls"),      href: "/projets/appels" },
      ],
    },
    {
      title: t("nav.resources"), href: "/ressources",
      children: [
        { title: t("nav.publications"), href: "/publications" },
        { title: t("nav.reports"),      href: "/publications/rapports" },
        { title: t("nav.training"),     href: "/ressources/formation" },
      ],
    },
    {
      title: t("nav.career"), href: "/carriere",
      children: [
        { title: t("nav.tenders"),       href: "/carriere/appels-offres" },
        { title: t("nav.opportunities"), href: "/carriere/opportunites" },
      ],
    },
    { title: t("nav.contact"), href: "/contact", children: [] },
  ];

  // Shared button style helpers
  const navBtn = (active: boolean) =>
    `px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1 ${
      active
        ? isScrolled ? "text-emerald-600 bg-emerald-50" : "text-white bg-white/20"
        : isScrolled ? "text-gray-700 hover:text-emerald-600 hover:bg-gray-50" : "text-white hover:bg-white/15"
    }`;

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 right-0 transition-all duration-300 overflow-hidden bg-[#0a1628] ${
          isScrolled ? "opacity-0 h-0 pointer-events-none -translate-y-full" : "opacity-100 h-10"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between text-white text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              contact@reaagess.org
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              +228 33 123 45 67
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-1 text-yellow-300 hover:text-cyan-300 transition-colors">
                    <ShieldCheck size={14} /> {t("nav.admin")}
                  </Link>
                )}
                <Link href="/mon-espace" className="flex items-center gap-1 hover:text-cyan-300 transition-colors">
                  <User size={14} /> {user?.prenom}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors">
                  <LogOut size={14} /> {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-cyan-300 transition-colors">{t("nav.login")}</Link>
                <Link href="/register" className="bg-cyan-600 hover:bg-cyan-700 px-4 py-1 rounded transition-colors">{t("nav.register")}</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main navbar ─────────────────────────────────────────────────── */}
      <nav
        className={`fixed left-0 right-0 transition-all duration-300 ${
          isScrolled ? "top-0 bg-white shadow-lg" : "top-10 bg-white/10 backdrop-blur-md"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className={`p-2 rounded-lg transition-colors ${isScrolled ? "bg-emerald-600" : "bg-white"}`}>
                <img src="/images/logo.png" alt="REAAGESS" className="h-8 w-auto" />
              </div>
              <span className={`text-xl font-bold tracking-wide transition-colors ${isScrolled ? "text-gray-900" : "text-white"}`}>
                REAAGESS
              </span>
            </Link>

            {/* Desktop nav items */}
            <div className="hidden lg:flex items-center gap-0.5">
              {menuItems.map((item) => (
                <div
                  key={item.href}
                  className="relative group"
                  onMouseEnter={() => item.children.length && setActiveDropdown(item.title)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.children.length ? (
                    <>
                      <button className={navBtn(isActive(item.href))}>
                        {item.title}
                        <ChevronDown size={13} className="transition-transform group-hover:rotate-180" />
                      </button>
                      <div className="absolute top-full left-0 mt-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-2">
                          {item.children.map(c => (
                            <Link key={c.href} href={c.href}
                              className={`block px-4 py-2.5 text-sm transition-colors ${isActive(c.href) ? "text-emerald-600 bg-emerald-50 font-semibold" : "text-gray-700 hover:text-emerald-600 hover:bg-gray-50"}`}>
                              {c.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link href={item.href} className={navBtn(isActive(item.href))}>{item.title}</Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(o => !o)}
                className={`p-2 rounded-lg transition-colors ${isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/15"}`}
              >
                <Search size={18} />
              </button>

              {/* Language switcher */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangOpen(o => !o)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                    isScrolled ? "text-gray-700 border-gray-200 hover:bg-gray-50" : "text-white border-white/20 hover:bg-white/15"
                  }`}
                >
                  <Globe size={14} />
                  {LANG_LABELS[lang].short}
                  <ChevronDown size={12} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
                </button>

                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 min-w-[130px] z-50">
                    {SUPPORTED_LANGS.map(l => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
                          l === lang ? "text-emerald-600 bg-emerald-50 font-semibold" : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                        }`}
                      >
                        <span>{LANG_LABELS[l].flag}</span>
                        {LANG_LABELS[l].label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsOpen(o => !o)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/15"}`}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {isSearchOpen && (
            <div className="py-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder={t("nav.search")}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-colors ${
                    isScrolled ? "bg-gray-100 text-gray-900 placeholder-gray-500" : "bg-white/20 text-white placeholder-white/60"
                  }`}
                />
                <button className={`px-4 py-2.5 rounded-xl transition-colors ${isScrolled ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-white text-emerald-600 hover:bg-white/90"}`}>
                  <Search size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Mobile menu */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-white/10 space-y-0.5">
              {menuItems.map(item => (
                <div key={item.href}>
                  {item.children.length ? (
                    <>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.title ? null : item.title)}
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between transition-colors ${
                          isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/15"
                        }`}
                      >
                        {item.title}
                        <ChevronDown size={14} className={`transition-transform ${activeDropdown === item.title ? "rotate-180" : ""}`} />
                      </button>
                      {activeDropdown === item.title && (
                        <div className="ml-4 space-y-0.5 mt-1">
                          {item.children.map(c => (
                            <Link key={c.href} href={c.href} onClick={() => setIsOpen(false)}
                              className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${
                                isScrolled ? "text-gray-600 hover:bg-gray-50" : "text-white/80 hover:bg-white/10"
                              }`}>
                              {c.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href={item.href} onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                        isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/15"
                      }`}>
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile lang switcher */}
              <div className="border-t border-white/10 pt-3 mt-2 flex items-center gap-2 px-4">
                {SUPPORTED_LANGS.map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      l === lang
                        ? isScrolled ? "bg-emerald-50 text-emerald-700" : "bg-white/20 text-white"
                        : isScrolled ? "text-gray-500 hover:bg-gray-100" : "text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {LANG_LABELS[l].flag} {LANG_LABELS[l].short}
                  </button>
                ))}
              </div>

              {/* Mobile auth */}
              <div className="border-t border-white/10 pt-3 mt-2 px-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-yellow-400 py-2 text-sm font-medium">
                        <ShieldCheck size={14} /> Admin
                      </Link>
                    )}
                    <Link href="/mon-espace" onClick={() => setIsOpen(false)} className={`flex items-center gap-2 py-2 text-sm font-medium ${isScrolled ? "text-gray-700" : "text-white"}`}>
                      <User size={14} /> {user?.prenom}
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 py-2 text-sm font-medium">
                      <LogOut size={14} /> {t("nav.logout")}
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link href="/login" onClick={() => setIsOpen(false)}
                      className={`flex-1 text-center py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        isScrolled ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/30 text-white hover:bg-white/10"
                      }`}>
                      {t("nav.login")}
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 transition-colors">
                      {t("nav.register")}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
