"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Activity } from "lucide-react";

export default function ActivitesPage() {
  return (
    <LayoutWrapper>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Activités</h1>
          <p className="text-xl text-gray-500 mb-12">Les activités du réseau REAAGESS</p>
          <div className="text-gray-400">
            <Activity size={64} className="mx-auto mb-4 opacity-30" />
            <p>Les activités du réseau sont régulièrement mises à jour.</p>
          </div>
        </div>
      </div>
      <Footer />
    </LayoutWrapper>
  );
}
