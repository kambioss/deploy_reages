"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, ChevronDown, LogOut, User, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const menuItems = [
    { title: "Accueil", href: "/", children: [] },
    {
      title: "À Propos",
      href: "/a-propos",
      children: [
        { title: "Mission", href: "/mission" },
        { title: "Vision", href: "/vision" },
        { title: "Valeurs", href: "/valeurs" },
        { title: "Pourquoi nous rejoindre", href: "/pourquoi-nous-rejoindre" },
      ],
    },
    {
      title: "Réseau",
      href: "/reseau",
      children: [
        { title: "Membres", href: "/reseau/membres" },
        { title: "Organisations", href: "/reseau/organisations" },
        { title: "Partenaires", href: "/reseau/partenaires" },
      ],
    },
    {
      title: "Actualités",
      href: "/actualites",
      children: [
        { title: "Actualités", href: "/actualites" },
        { title: "Événements", href: "/actualites/evenements" },
        { title: "Activités", href: "/actualites/activites" },
      ],
    },
    {
      title: "Projets",
      href: "/projets",
      children: [
        { title: "Tous les projets", href: "/projets" },
        { title: "Projets en cours", href: "/projets/encours" },
        { title: "Projets terminés", href: "/projets/termines" },
        { title: "Appels à projets", href: "/projets/appels" },
      ],
    },
    {
      title: "Ressources",
      href: "/ressources",
      children: [
        { title: "Publications", href: "/publications" },
        { title: "Rapports", href: "/publications/rapports" },
        { title: "Formation", href: "/ressources/formation" },
      ],
    },
    {
      title: "Carrière",
      href: "/carriere",
      children: [
        { title: "Appels d'offres", href: "/carriere/appels-offres" },
        { title: "Opportunités", href: "/carriere/opportunites" },
      ],
    },
    { title: "Contact", href: "/contact", children: [] },
  ];

  return (
    <>
      {/* Top Bar */}
      <div
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          isScrolled
            ? "opacity-0 h-0 pointer-events-none -translate-y-full"
            : "opacity-100 h-10 translate-y-0"
        } bg-emerald-700 backdrop-blur-sm overflow-hidden`}
        style={{ zIndex: 9999 }}
      >
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full text-white text-sm">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>contact@reaages.org</span>
              </span>
              <span className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+228 33 123 45 67</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="flex items-center gap-1 hover:text-cyan-300 transition-colors text-yellow-300">
                      <ShieldCheck size={14} />
                      Admin
                    </Link>
                  )}
                  <Link href="/mon-espace" className="flex items-center gap-1 hover:text-cyan-300 transition-colors">
                    <User size={14} />
                    {user?.prenom}
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors text-sm">
                    <LogOut size={14} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:text-cyan-300 transition-colors">
                    Connexion
                  </Link>
                  <Link href="/register" className="bg-cyan-600 hover:bg-cyan-700 px-4 py-1 rounded transition-colors">
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`fixed left-0 right-0 transition-all duration-300 ${
          isScrolled
            ? "top-0 bg-white shadow-lg"
            : "top-10 bg-white/10 backdrop-blur-md"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div
                className={`p-2 rounded-lg transition-colors ${
                  isScrolled ? "bg-emerald-600" : "bg-white"
                }`}
              >
                <img
                  src="/images/logo.png"
                  alt="REAAGES Logo"
                  className="h-8 w-auto"
                />
              </div>
              <span
                className={`text-xl font-bold transition-colors ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                REAAGES
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <div
                  key={item.title}
                  className="relative group"
                  onMouseEnter={() =>
                    item.children.length > 0 && setActiveDropdown(item.title)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.children.length > 0 ? (
                    <>
                      <button
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-1 ${
                          isActive(item.href)
                            ? isScrolled
                              ? "text-emerald-600 bg-emerald-50"
                              : "text-white bg-white/20"
                            : isScrolled
                              ? "text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
                              : "text-white hover:bg-white/20"
                        }`}
                      >
                        <span>{item.title}</span>
                        <ChevronDown
                          size={16}
                          className="transition-transform group-hover:rotate-180"
                        />
                      </button>

                      <div
                        className={`absolute top-full left-0 mt-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                          activeDropdown === item.title
                            ? "opacity-100 visible"
                            : ""
                        }`}
                      >
                        <div className="bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block px-4 py-2 text-sm transition-colors ${
                                isActive(child.href)
                                  ? "text-emerald-600 bg-emerald-50 font-medium"
                                  : "text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                              }`}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-4 py-2 rounded-lg font-medium transition-all block ${
                        isActive(item.href)
                          ? isScrolled
                            ? "text-emerald-600 bg-emerald-50"
                            : "text-white bg-white/20"
                          : isScrolled
                            ? "text-gray-700 hover:text-emerald-600 hover:bg-gray-100"
                            : "text-white hover:bg-white/20"
                      }`}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  isScrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/20"
                }`}
              >
                <Search size={20} />
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  isScrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="py-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    isScrolled
                      ? "bg-gray-100 text-gray-900 placeholder-gray-500"
                      : "bg-white/20 text-white placeholder-white/70"
                  } outline-none`}
                  placeholder="Rechercher..."
                />
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isScrolled
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-white text-emerald-600 hover:bg-white/90"
                  }`}
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-white/10">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <div key={item.title}>
                    {item.children.length > 0 ? (
                      <>
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === item.title ? null : item.title,
                            )
                          }
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-between ${
                            isScrolled
                              ? "text-gray-700 hover:bg-gray-100"
                              : "text-white hover:bg-white/20"
                          }`}
                        >
                          <span>{item.title}</span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${activeDropdown === item.title ? "rotate-180" : ""}`}
                          />
                        </button>

                        {activeDropdown === item.title && (
                          <div className="ml-4 mt-2 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                                  isScrolled
                                    ? "text-gray-600 hover:bg-gray-50"
                                    : "text-white/80 hover:bg-white/10"
                                }`}
                              >
                                {child.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                          isScrolled
                            ? "text-gray-700 hover:bg-gray-100"
                            : "text-white hover:bg-white/20"
                        }`}
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
