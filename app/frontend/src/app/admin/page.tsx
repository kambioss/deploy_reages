"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Users, FileText, BarChart3, Settings, Bell, BookOpen, Calendar,
  PlusCircle, Edit, Trash2, Check, X, Eye, EyeOff, Loader2,
  ArrowLeft, ChevronRight, Shield, Globe, TrendingUp
} from "lucide-react";

// ========== TYPES ==========
interface Cours { id: string; titre: string; instructeur: string; niveau: string; categorie: string; published: boolean; duree: string; description: string; contenu: string; prix: number; }
interface Enrollment { id: string; status: string; createdAt: string; user: { id: string; nom: string; prenom: string; email: string; pays: string }; cours: { id: string; titre: string; categorie: string } }
interface User { id: string; nom: string; prenom: string; email: string; pays: string; fonction: string; role: string; isActive: boolean; createdAt: string; _count: { enrollments: number } }
interface Actualite { id: string; titre: string; auteur: string; categorie: string; published: boolean; date: string; contenu: string; }
interface Evenement { id: string; titre: string; lieu: string; date: string; published: boolean; description: string; lien?: string; }
interface Article { id: string; titre: string; auteur: string; categorie: string; published: boolean; resume: string; contenu: string; }
interface Projet { id: string; titre: string; statut: string; published: boolean; description: string; contenu: string; partenaires: string; }

// ========== MODAL FORM ==========
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, name, type = "text", value, onChange, required = false, textarea = false, options }: {
  label: string; name: string; type?: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean; textarea?: boolean; options?: { value: string; label: string }[];
}) {
  const cls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {options ? (
        <select name={name} value={value} onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>} className={cls}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : textarea ? (
        <textarea name={name} value={value} onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>} rows={4} className={cls} required={required} />
      ) : (
        <input name={name} type={type} value={value} onChange={onChange as React.ChangeEventHandler<HTMLInputElement>} className={cls} required={required} />
      )}
    </div>
  );
}

// ========== MAIN ==========
export default function AdminPage() {
  const { user, isAuthenticated, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [cours, setCours] = useState<Cours[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [modal, setModal] = useState<{ type: string; item?: any } | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchAll();
    }
  }, [isAdmin]);

  async function fetchAll() {
    const [c, e, u, a, ev, ar, p] = await Promise.all([
      fetch("/api/cours?all=true").then(r => r.json()),
      fetch("/api/enrollments?all=true").then(r => r.json()),
      fetch("/api/users").then(r => r.json()),
      fetch("/api/actualites?all=true").then(r => r.json()),
      fetch("/api/evenements?all=true").then(r => r.json()),
      fetch("/api/articles?all=true").then(r => r.json()),
      fetch("/api/projets?all=true").then(r => r.json()),
    ]);
    if (c.cours) setCours(c.cours);
    if (e.enrollments) setEnrollments(e.enrollments);
    if (u.users) setUsers(u.users);
    if (a.actualites) setActualites(a.actualites);
    if (ev.evenements) setEvenements(ev.evenements);
    if (ar.articles) setArticles(ar.articles);
    if (p.projets) setProjets(p.projets);
  }

  function openCreate(type: string, defaults: any = {}) {
    setFormData(defaults);
    setModal({ type: `create_${type}` });
  }

  function openEdit(type: string, item: any) {
    setFormData({ ...item });
    setModal({ type: `edit_${type}`, item });
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  }

  async function handleSave(endpoint: string, method: string, id?: string) {
    setSaving(true);
    try {
      const url = id ? `${endpoint}/${id}` : endpoint;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setModal(null);
        fetchAll();
      } else {
        const d = await res.json();
        alert(d.error || "Erreur");
      }
    } catch { alert("Erreur réseau"); }
    setSaving(false);
  }

  async function handleDelete(endpoint: string, id: string) {
    if (!confirm("Supprimer cet élément ?")) return;
    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    fetchAll();
  }

  async function handleEnrollmentStatus(id: string, status: string) {
    await fetch(`/api/enrollments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchAll();
  }

  async function handleUserUpdate(id: string, updates: any) {
    await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    fetchAll();
  }

  if (loading || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>;
  }

  const stats = [
    { title: "Utilisateurs", value: users.length, icon: Users, color: "bg-blue-500" },
    { title: "Cours", value: cours.length, icon: BookOpen, color: "bg-green-500" },
    { title: "Inscriptions", value: enrollments.length, icon: TrendingUp, color: "bg-purple-500" },
    { title: "En attente", value: enrollments.filter(e => e.status === "pending").length, icon: Bell, color: "bg-orange-500" },
  ];

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
    { id: "cours", label: "Cours", icon: BookOpen },
    { id: "enrollments", label: "Inscriptions", icon: Users },
    { id: "actualites", label: "Actualités", icon: FileText },
    { id: "evenements", label: "Événements", icon: Calendar },
    { id: "articles", label: "Articles", icon: Globe },
    { id: "projets", label: "Projets", icon: TrendingUp },
    { id: "users", label: "Utilisateurs", icon: Shield },
  ];

  // ---- FORM MODALS ----
  const renderModal = () => {
    if (!modal) return null;
    const isEdit = modal.type.startsWith("edit_");
    const type = modal.type.replace(/^(create|edit)_/, "");

    const modalConfigs: any = {
      cours: {
        title: isEdit ? "Modifier le cours" : "Nouveau cours",
        defaults: { titre: "", description: "", contenu: "", instructeur: "", duree: "", niveau: "debutant", categorie: "", prix: 0, published: false },
        endpoint: "/api/cours",
        fields: () => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Titre" name="titre" value={formData.titre || ""} onChange={handleFormChange} required />
            <FormField label="Instructeur" name="instructeur" value={formData.instructeur || ""} onChange={handleFormChange} required />
            <FormField label="Catégorie" name="categorie" value={formData.categorie || ""} onChange={handleFormChange} required />
            <FormField label="Durée" name="duree" value={formData.duree || ""} onChange={handleFormChange} required />
            <FormField label="Niveau" name="niveau" value={formData.niveau || "debutant"} onChange={handleFormChange} options={[
              { value: "debutant", label: "Débutant" }, { value: "intermediaire", label: "Intermédiaire" }, { value: "avance", label: "Avancé" }
            ]} />
            <FormField label="Prix (FCFA)" name="prix" type="number" value={formData.prix || 0} onChange={handleFormChange} />
            <FormField label="Image URL" name="image" value={formData.image || ""} onChange={handleFormChange} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="published" name="published" checked={formData.published || false} onChange={handleFormChange} className="w-4 h-4" />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">Publié</label>
            </div>
            <div className="md:col-span-2">
              <FormField label="Description courte" name="description" value={formData.description || ""} onChange={handleFormChange} textarea required />
            </div>
            <div className="md:col-span-2">
              <FormField label="Contenu complet" name="contenu" value={formData.contenu || ""} onChange={handleFormChange} textarea required />
            </div>
          </div>
        )
      },
      actualites: {
        title: isEdit ? "Modifier l'actualité" : "Nouvelle actualité",
        endpoint: "/api/actualites",
        fields: () => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Titre" name="titre" value={formData.titre || ""} onChange={handleFormChange} required />
            <FormField label="Auteur" name="auteur" value={formData.auteur || ""} onChange={handleFormChange} required />
            <FormField label="Catégorie" name="categorie" value={formData.categorie || ""} onChange={handleFormChange} />
            <FormField label="Image URL" name="image" value={formData.image || ""} onChange={handleFormChange} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="published" name="published" checked={formData.published || false} onChange={handleFormChange} className="w-4 h-4" />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">Publié</label>
            </div>
            <div className="md:col-span-2">
              <FormField label="Contenu" name="contenu" value={formData.contenu || ""} onChange={handleFormChange} textarea required />
            </div>
          </div>
        )
      },
      evenements: {
        title: isEdit ? "Modifier l'événement" : "Nouvel événement",
        endpoint: "/api/evenements",
        fields: () => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Titre" name="titre" value={formData.titre || ""} onChange={handleFormChange} required />
            <FormField label="Lieu" name="lieu" value={formData.lieu || ""} onChange={handleFormChange} required />
            <FormField label="Date" name="date" type="datetime-local" value={formData.date ? formData.date.slice(0, 16) : ""} onChange={handleFormChange} required />
            <FormField label="Lien (URL)" name="lien" value={formData.lien || ""} onChange={handleFormChange} />
            <FormField label="Image URL" name="image" value={formData.image || ""} onChange={handleFormChange} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="published" name="published" checked={formData.published || false} onChange={handleFormChange} className="w-4 h-4" />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">Publié</label>
            </div>
            <div className="md:col-span-2">
              <FormField label="Description" name="description" value={formData.description || ""} onChange={handleFormChange} textarea required />
            </div>
          </div>
        )
      },
      articles: {
        title: isEdit ? "Modifier l'article" : "Nouvel article",
        endpoint: "/api/articles",
        fields: () => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Titre" name="titre" value={formData.titre || ""} onChange={handleFormChange} required />
            <FormField label="Auteur" name="auteur" value={formData.auteur || ""} onChange={handleFormChange} required />
            <FormField label="Catégorie" name="categorie" value={formData.categorie || "publication"} onChange={handleFormChange} />
            <FormField label="Tags (séparés par des virgules)" name="tags" value={formData.tags || ""} onChange={handleFormChange} />
            <FormField label="Image URL" name="image" value={formData.image || ""} onChange={handleFormChange} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="published" name="published" checked={formData.published || false} onChange={handleFormChange} className="w-4 h-4" />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">Publié</label>
            </div>
            <div className="md:col-span-2">
              <FormField label="Résumé" name="resume" value={formData.resume || ""} onChange={handleFormChange} textarea required />
            </div>
            <div className="md:col-span-2">
              <FormField label="Contenu" name="contenu" value={formData.contenu || ""} onChange={handleFormChange} textarea required />
            </div>
          </div>
        )
      },
      projets: {
        title: isEdit ? "Modifier le projet" : "Nouveau projet",
        endpoint: "/api/projets",
        fields: () => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Titre" name="titre" value={formData.titre || ""} onChange={handleFormChange} required />
            <FormField label="Statut" name="statut" value={formData.statut || "en_cours"} onChange={handleFormChange} options={[
              { value: "planifie", label: "Planifié" }, { value: "en_cours", label: "En cours" }, { value: "termine", label: "Terminé" }
            ]} />
            <FormField label="Partenaires" name="partenaires" value={formData.partenaires || ""} onChange={handleFormChange} />
            <FormField label="Image URL" name="image" value={formData.image || ""} onChange={handleFormChange} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="published" name="published" checked={formData.published || false} onChange={handleFormChange} className="w-4 h-4" />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">Publié</label>
            </div>
            <div className="md:col-span-2">
              <FormField label="Description courte" name="description" value={formData.description || ""} onChange={handleFormChange} textarea required />
            </div>
            <div className="md:col-span-2">
              <FormField label="Contenu détaillé" name="contenu" value={formData.contenu || ""} onChange={handleFormChange} textarea required />
            </div>
          </div>
        )
      }
    };

    const config = modalConfigs[type];
    if (!config) return null;

    return (
      <Modal title={config.title} onClose={() => setModal(null)}>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(config.endpoint, isEdit ? "PUT" : "POST", isEdit ? modal.item.id : undefined); }} className="space-y-4">
          {config.fields()}
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Enregistrer" : "Créer"}
            </button>
            <button type="button" onClick={() => setModal(null)} className="px-6 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
          </div>
        </form>
      </Modal>
    );
  };

  // ---- SECTIONS ----
  const PublishedBadge = ({ published }: { published: boolean }) => (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
      {published ? <><Eye size={10} />Publié</> : <><EyeOff size={10} />Brouillon</>}
    </span>
  );

  function TableActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
    return (
      <div className="flex gap-2">
        <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={15} /></button>
        <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center text-gray-400 hover:text-blue-600 transition-colors text-sm">
                <ArrowLeft size={16} className="mr-1" />Retour
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Administration REAAGESS</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.prenom?.[0]}
              </div>
              <span className="text-sm text-gray-600">{user?.prenom} {user?.nom}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="container mx-auto px-4">
          <nav className="flex">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                    <div className={`${s.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                    <div className="text-sm text-gray-500">{s.title}</div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Dernières inscriptions en attente</h3>
                <div className="space-y-3">
                  {enrollments.filter(e => e.status === "pending").slice(0, 5).map(e => (
                    <div key={e.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{e.user.prenom} {e.user.nom}</p>
                        <p className="text-xs text-gray-500">{e.cours.titre}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEnrollmentStatus(e.id, "approved")} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"><Check size={14} /></button>
                        <button onClick={() => handleEnrollmentStatus(e.id, "rejected")} className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"><X size={14} /></button>
                      </div>
                    </div>
                  ))}
                  {enrollments.filter(e => e.status === "pending").length === 0 && (
                    <p className="text-sm text-gray-400">Aucune inscription en attente</p>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Accès rapides</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Ajouter un cours", action: () => { setActiveTab("cours"); openCreate("cours"); }, color: "bg-blue-50 text-blue-700" },
                    { label: "Nouvelle actualité", action: () => { setActiveTab("actualites"); openCreate("actualites"); }, color: "bg-green-50 text-green-700" },
                    { label: "Nouvel événement", action: () => { setActiveTab("evenements"); openCreate("evenements"); }, color: "bg-purple-50 text-purple-700" },
                    { label: "Nouveau projet", action: () => { setActiveTab("projets"); openCreate("projets"); }, color: "bg-orange-50 text-orange-700" },
                  ].map((a, i) => (
                    <button key={i} onClick={a.action} className={`${a.color} rounded-xl p-4 text-left text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2`}>
                      <PlusCircle size={16} />{a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COURS */}
        {activeTab === "cours" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-gray-900">Cours ({cours.length})</h2>
              <button onClick={() => openCreate("cours")} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                <PlusCircle size={16} />Nouveau cours
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Titre</th>
                    <th className="text-left p-4 font-medium text-gray-600">Instructeur</th>
                    <th className="text-left p-4 font-medium text-gray-600">Niveau</th>
                    <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                    <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cours.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{c.titre}</td>
                      <td className="p-4 text-gray-500">{c.instructeur}</td>
                      <td className="p-4"><span className="capitalize text-xs bg-gray-100 px-2 py-1 rounded">{c.niveau}</span></td>
                      <td className="p-4"><PublishedBadge published={c.published} /></td>
                      <td className="p-4"><TableActions onEdit={() => openEdit("cours", c)} onDelete={() => handleDelete("/api/cours", c.id)} /></td>
                    </tr>
                  ))}
                  {cours.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">Aucun cours</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ENROLLMENTS */}
        {activeTab === "enrollments" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <h2 className="font-bold text-gray-900">Inscriptions ({enrollments.length})</h2>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-yellow-600">En attente: {enrollments.filter(e => e.status === "pending").length}</span>
                <span className="text-green-600">Validées: {enrollments.filter(e => e.status === "approved").length}</span>
                <span className="text-red-600">Refusées: {enrollments.filter(e => e.status === "rejected").length}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Étudiant</th>
                    <th className="text-left p-4 font-medium text-gray-600">Cours</th>
                    <th className="text-left p-4 font-medium text-gray-600">Date</th>
                    <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                    <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enrollments.map(e => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{e.user.prenom} {e.user.nom}</div>
                        <div className="text-xs text-gray-400">{e.user.email}</div>
                      </td>
                      <td className="p-4 text-gray-600">{e.cours.titre}</td>
                      <td className="p-4 text-gray-400 text-xs">{new Date(e.createdAt).toLocaleDateString("fr-FR")}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          e.status === "approved" ? "bg-green-100 text-green-700" :
                          e.status === "rejected" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>{e.status === "approved" ? "Validé" : e.status === "rejected" ? "Refusé" : "En attente"}</span>
                      </td>
                      <td className="p-4">
                        {e.status === "pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => handleEnrollmentStatus(e.id, "approved")} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"><Check size={14} /></button>
                            <button onClick={() => handleEnrollmentStatus(e.id, "rejected")} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"><X size={14} /></button>
                          </div>
                        )}
                        {e.status !== "pending" && (
                          <button onClick={() => handleDelete("/api/enrollments", e.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {enrollments.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">Aucune inscription</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ACTUALITES */}
        {activeTab === "actualites" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-gray-900">Actualités ({actualites.length})</h2>
              <button onClick={() => openCreate("actualites")} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                <PlusCircle size={16} />Nouvelle actualité
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Titre</th>
                    <th className="text-left p-4 font-medium text-gray-600">Auteur</th>
                    <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                    <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {actualites.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{a.titre}</td>
                      <td className="p-4 text-gray-500">{a.auteur}</td>
                      <td className="p-4"><PublishedBadge published={a.published} /></td>
                      <td className="p-4"><TableActions onEdit={() => openEdit("actualites", a)} onDelete={() => handleDelete("/api/actualites", a.id)} /></td>
                    </tr>
                  ))}
                  {actualites.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-400">Aucune actualité</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EVENEMENTS */}
        {activeTab === "evenements" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-gray-900">Événements ({evenements.length})</h2>
              <button onClick={() => openCreate("evenements")} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                <PlusCircle size={16} />Nouvel événement
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Titre</th>
                    <th className="text-left p-4 font-medium text-gray-600">Date</th>
                    <th className="text-left p-4 font-medium text-gray-600">Lieu</th>
                    <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                    <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {evenements.map(e => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{e.titre}</td>
                      <td className="p-4 text-gray-500">{new Date(e.date).toLocaleDateString("fr-FR")}</td>
                      <td className="p-4 text-gray-500">{e.lieu}</td>
                      <td className="p-4"><PublishedBadge published={e.published} /></td>
                      <td className="p-4"><TableActions onEdit={() => openEdit("evenements", e)} onDelete={() => handleDelete("/api/evenements", e.id)} /></td>
                    </tr>
                  ))}
                  {evenements.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">Aucun événement</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ARTICLES */}
        {activeTab === "articles" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-gray-900">Articles / Publications ({articles.length})</h2>
              <button onClick={() => openCreate("articles")} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                <PlusCircle size={16} />Nouvel article
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Titre</th>
                    <th className="text-left p-4 font-medium text-gray-600">Auteur</th>
                    <th className="text-left p-4 font-medium text-gray-600">Catégorie</th>
                    <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                    <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {articles.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{a.titre}</td>
                      <td className="p-4 text-gray-500">{a.auteur}</td>
                      <td className="p-4 text-gray-500">{a.categorie}</td>
                      <td className="p-4"><PublishedBadge published={a.published} /></td>
                      <td className="p-4"><TableActions onEdit={() => openEdit("articles", a)} onDelete={() => handleDelete("/api/articles", a.id)} /></td>
                    </tr>
                  ))}
                  {articles.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">Aucun article</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROJETS */}
        {activeTab === "projets" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-gray-900">Projets ({projets.length})</h2>
              <button onClick={() => openCreate("projets")} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                <PlusCircle size={16} />Nouveau projet
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Titre</th>
                    <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                    <th className="text-left p-4 font-medium text-gray-600">Visibilité</th>
                    <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projets.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{p.titre}</td>
                      <td className="p-4"><span className={`text-xs px-2 py-1 rounded capitalize ${
                        p.statut === "termine" ? "bg-blue-100 text-blue-700" :
                        p.statut === "en_cours" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>{p.statut.replace("_", " ")}</span></td>
                      <td className="p-4"><PublishedBadge published={p.published} /></td>
                      <td className="p-4"><TableActions onEdit={() => openEdit("projets", p)} onDelete={() => handleDelete("/api/projets", p.id)} /></td>
                    </tr>
                  ))}
                  {projets.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-400">Aucun projet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <h2 className="font-bold text-gray-900">Utilisateurs ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Nom</th>
                    <th className="text-left p-4 font-medium text-gray-600">Email</th>
                    <th className="text-left p-4 font-medium text-gray-600">Pays</th>
                    <th className="text-left p-4 font-medium text-gray-600">Rôle</th>
                    <th className="text-left p-4 font-medium text-gray-600">Cours</th>
                    <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                    <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{u.prenom} {u.nom}</td>
                      <td className="p-4 text-gray-500">{u.email}</td>
                      <td className="p-4 text-gray-400">{u.pays}</td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleUserUpdate(u.id, { role: e.target.value, isActive: u.isActive })}
                          className="text-xs border border-gray-200 rounded px-2 py-1"
                        >
                          <option value="student">Étudiant</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">{u._count.enrollments}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleUserUpdate(u.id, { role: u.role, isActive: !u.isActive })}
                          className={`text-xs px-2 py-1 rounded-full ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {u.isActive ? "Actif" : "Inactif"}
                        </button>
                      </td>
                      <td className="p-4">
                        <button onClick={() => handleDelete("/api/users", u.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">Aucun utilisateur</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {renderModal()}
    </div>
  );
}
