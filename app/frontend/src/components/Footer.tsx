"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Globe, Satellite, Users, BookOpen } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Satellite className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">REAAGESS</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Réseau Africain des Acteurs de la Géomatique et des Sciences Spatiales, 
              dédié à la promotion des technologies géospatiales au service du développement durable en Afrique.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/a-propos" className="text-gray-300 hover:text-white transition-colors">
                  Qui sommes-nous ?
                </Link>
              </li>
              <li>
                <Link href="/vision" className="text-gray-300 hover:text-white transition-colors">
                  Notre vision
                </Link>
              </li>
              <li>
                <Link href="/mission" className="text-gray-300 hover:text-white transition-colors">
                  Notre mission
                </Link>
              </li>
              <li>
                <Link href="/valeurs" className="text-gray-300 hover:text-white transition-colors">
                  Nos valeurs
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="text-gray-300 hover:text-white transition-colors">
                  Actualités
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Domaines d'expertise */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Domaines d'expertise</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/expertise/cartographie" className="text-gray-300 hover:text-white transition-colors">
                  Cartographie et SIG
                </Link>
              </li>
              <li>
                <Link href="/expertise/teledetection" className="text-gray-300 hover:text-white transition-colors">
                  Télédétection par Satellite
                </Link>
              </li>
              <li>
                <Link href="/expertise/foncier" className="text-gray-300 hover:text-white transition-colors">
                  Suivi Foncier
                </Link>
              </li>
              <li>
                <Link href="/expertise/foret" className="text-gray-300 hover:text-white transition-colors">
                  Gestion Forestière
                </Link>
              </li>
              <li>
                <Link href="/expertise/secheresse" className="text-gray-300 hover:text-white transition-colors">
                  Surveillance Sécheresse
                </Link>
              </li>
              <li>
                <Link href="/expertise/agriculture" className="text-gray-300 hover:text-white transition-colors">
                  Agriculture Intelligente
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">contact@reaagess.org</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">+221 33 123 45 67</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Dakar, Sénégal</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">www.reaagess.org</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-3">
                Abonnez-vous pour recevoir nos actualités
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:border-blue-500 text-white"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md transition-colors">
                  S'abonner
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} REAAGESS. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/mentions-legales" className="text-gray-400 hover:text-white text-sm transition-colors">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="text-gray-400 hover:text-white text-sm transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;