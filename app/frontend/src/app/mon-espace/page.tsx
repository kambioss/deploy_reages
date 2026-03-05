"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import { BookOpen, Clock, CheckCircle, XCircle, Hourglass, User, MapPin, Briefcase, Calendar } from "lucide-react";

interface Enrollment {
  id: string;
  status: string;
  createdAt: string;
  cours: {
    id: string;
    titre: string;
    description: string;
    instructeur: string;
    duree: string;
    niveau: string;
    categorie: string;
    image?: string;
  };
}

export default function MonEspacePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnrollments();
    }
  }, [isAuthenticated]);

  async function fetchEnrollments() {
    try {
      const res = await fetch("/api/enrollments");
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data.enrollments);
      }
    } catch {}
    setLoadingData(false);
  }

  const statusConfig = {
    pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: Hourglass },
    approved: { label: "Validé", color: "bg-green-100 text-green-800", icon: CheckCircle },
    rejected: { label: "Refusé", color: "bg-red-100 text-red-800", icon: XCircle },
  };

  if (loading) {
    return (
      <LayoutWrapper>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {user?.prenom?.[0]}{user?.nom?.[0]}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{user?.prenom} {user?.nom}</h1>
                <p className="text-gray-500 mb-4">{user?.email}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} className="text-blue-500" />
                    {user?.pays}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase size={16} className="text-blue-500" />
                    {user?.fonction}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User size={16} className="text-blue-500" />
                    {user?.secteurActivite}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total inscriptions", value: enrollments.length, color: "bg-blue-500" },
              { label: "Cours validés", value: enrollments.filter(e => e.status === "approved").length, color: "bg-green-500" },
              { label: "En attente", value: enrollments.filter(e => e.status === "pending").length, color: "bg-yellow-500" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className={`w-10 h-10 ${stat.color} rounded-lg mx-auto mb-3 flex items-center justify-center`}>
                  <BookOpen className="text-white" size={20} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Cours section */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Mes Cours</h2>
              <Link href="/formations" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Explorer les formations →
              </Link>
            </div>

            {loadingData ? (
              <div className="text-center py-12 text-gray-400">Chargement...</div>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Vous n'êtes inscrit à aucun cours pour le moment.</p>
                <Link href="/formations" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Découvrir les formations
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => {
                  const status = statusConfig[enrollment.status as keyof typeof statusConfig];
                  const Icon = status.icon;
                  return (
                    <div key={enrollment.id} className="border border-gray-100 rounded-xl p-6 hover:border-blue-200 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{enrollment.cours.titre}</h3>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              <Icon size={12} />
                              {status.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">{enrollment.cours.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <User size={12} /> {enrollment.cours.instructeur}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {enrollment.cours.duree}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> Inscrit le {new Date(enrollment.createdAt).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                          {enrollment.cours.niveau}
                        </span>
                      </div>
                      {enrollment.status === "approved" && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <Link
                            href={`/formations/${enrollment.cours.id}`}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Accéder au cours →
                          </Link>
                        </div>
                      )}
                      {enrollment.status === "pending" && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-yellow-600">
                            Votre inscription est en cours de validation par l'administrateur.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </LayoutWrapper>
  );
}
