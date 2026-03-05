"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Users, FileText, BookOpen, Calendar, PlusCircle, Edit2, Trash2,
  Check, X, Eye, EyeOff, Loader2, ArrowLeft, Shield, Globe,
  TrendingUp, Bell, LayoutDashboard,
  Save, AlertCircle, CheckCircle2
} from "lucide-react";

type ContentType = "cours" | "actualites" | "evenements" | "articles" | "projets";
interface Cours      { id: string; titre: string; instructeur: string; niveau: string; categorie: string; published: boolean; duree: string; description: string; contenu: string; prix: number; image?: string; }
interface Enrollment { id: string; status: string; createdAt: string; user: { id: string; nom: string; prenom: string; email: string }; cours: { id: string; titre: string }; }
interface AppUser    { id: string; nom: string; prenom: string; email: string; pays: string; role: string; isActive: boolean; createdAt: string; _count?: { enrollments?: number }; }
interface Actualite  { id: string; titre: string; auteur: string; categorie: string; published: boolean; date: string; contenu: string; image?: string; }
interface Evenement  { id: string; titre: string; lieu: string; date: string; published: boolean; description: string; lien?: string; image?: string; }
interface Article    { id: string; titre: string; auteur: string; categorie: string; published: boolean; resume: string; contenu: string; image?: string; tags?: string; }
interface Projet     { id: string; titre: string; statut: string; published: boolean; description: string; contenu: string; partenaires: string; image?: string; }

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium ${type === "success" ? "bg-green-600" : "bg-red-600"}`}>
      {type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      {msg}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, required = false, rows = 1, options, placeholder }: {
  label: string; name: string; type?: string; value: string | number | boolean;
  onChange: (e: React.ChangeEvent<any>) => void; required?: boolean;
  rows?: number; options?: { value: string; label: string }[]; placeholder?: string;
}) {
  const base = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  if (type === "checkbox") return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <div className={`w-10 h-6 rounded-full transition-colors relative ${value ? "bg-blue-600" : "bg-gray-300"}`}>
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${value ? "translate-x-5" : "translate-x-1"}`} />
      </div>
      <input type="checkbox" name={name} checked={value as boolean} onChange={onChange} className="sr-only" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {options ? (
        <select name={name} value={value as string} onChange={onChange} className={base} required={required}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : rows > 1 ? (
        <textarea name={name} value={value as string} onChange={onChange} rows={rows} placeholder={placeholder} className={`${base} resize-y`} required={required} />
      ) : (
        <input name={name} type={type} value={value as string} onChange={onChange} placeholder={placeholder} className={base} required={required} />
      )}
    </div>
  );
}

const defaultValues: Record<ContentType, any> = {
  cours:     { titre: "", description: "", contenu: "", instructeur: "", duree: "", niveau: "debutant", categorie: "", prix: 0, image: "", published: false },
  actualites:{ titre: "", contenu: "", auteur: "", categorie: "actualite", image: "", published: false },
  evenements:{ titre: "", description: "", date: "", lieu: "", lien: "", image: "", published: false },
  articles:  { titre: "", resume: "", contenu: "", auteur: "", categorie: "publication", tags: "", image: "", published: false },
  projets:   { titre: "", description: "", contenu: "", statut: "en_cours", partenaires: "", image: "", published: false },
};

function ContentForm({ type, data, onChange }: { type: ContentType; data: any; onChange: (e: React.ChangeEvent<any>) => void }) {
  const niveaux = [{ value: "debutant", label: "Débutant" }, { value: "intermediaire", label: "Intermédiaire" }, { value: "avance", label: "Avancé" }];
  const statuts = [{ value: "planifie", label: "Planifié" }, { value: "en_cours", label: "En cours" }, { value: "termine", label: "Terminé" }];
  if (type === "cours") return <div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="md:col-span-2"><Field label="Titre du cours" name="titre" value={data.titre} onChange={onChange} required placeholder="ex: Introduction à la télédétection" /></div><Field label="Instructeur" name="instructeur" value={data.instructeur} onChange={onChange} required placeholder="Nom de l'instructeur" /><Field label="Catégorie" name="categorie" value={data.categorie} onChange={onChange} required placeholder="ex: SIG, Télédétection..." /><Field label="Durée" name="duree" value={data.duree} onChange={onChange} required placeholder="ex: 40 heures..." /><Field label="Niveau" name="niveau" value={data.niveau} onChange={onChange} options={niveaux} /><Field label="Prix (FCFA, 0 = gratuit)" name="prix" type="number" value={data.prix} onChange={onChange} /><Field label="Image URL (optionnel)" name="image" value={data.image || ""} onChange={onChange} placeholder="https://..." /><div className="md:col-span-2"><Field label="Publié" name="published" type="checkbox" value={data.published} onChange={onChange} /></div></div><Field label="Description" name="description" value={data.description} onChange={onChange} required rows={3} placeholder="Brève présentation..." /><Field label="Contenu / Programme" name="contenu" value={data.contenu} onChange={onChange} required rows={6} placeholder="Programme détaillé..." /></div>;
  if (type === "actualites") return <div className="space-y-4"><Field label="Titre" name="titre" value={data.titre} onChange={onChange} required /><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="Auteur" name="auteur" value={data.auteur} onChange={onChange} required /><Field label="Catégorie" name="categorie" value={data.categorie} onChange={onChange} /><Field label="Image URL" name="image" value={data.image || ""} onChange={onChange} placeholder="https://..." /><Field label="Publié" name="published" type="checkbox" value={data.published} onChange={onChange} /></div><Field label="Contenu" name="contenu" value={data.contenu} onChange={onChange} required rows={8} /></div>;
  if (type === "evenements") return <div className="space-y-4"><Field label="Titre" name="titre" value={data.titre} onChange={onChange} required /><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="Date" name="date" type="datetime-local" value={data.date ? data.date.slice(0, 16) : ""} onChange={onChange} required /><Field label="Lieu" name="lieu" value={data.lieu} onChange={onChange} required /><Field label="Lien (optionnel)" name="lien" value={data.lien || ""} onChange={onChange} /><Field label="Image URL" name="image" value={data.image || ""} onChange={onChange} /><div className="md:col-span-2"><Field label="Publié" name="published" type="checkbox" value={data.published} onChange={onChange} /></div></div><Field label="Description" name="description" value={data.description} onChange={onChange} required rows={6} /></div>;
  if (type === "articles") return <div className="space-y-4"><Field label="Titre" name="titre" value={data.titre} onChange={onChange} required /><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="Auteur" name="auteur" value={data.auteur} onChange={onChange} required /><Field label="Catégorie" name="categorie" value={data.categorie} onChange={onChange} /><Field label="Tags" name="tags" value={data.tags || ""} onChange={onChange} /><Field label="Image URL" name="image" value={data.image || ""} onChange={onChange} /><div className="md:col-span-2"><Field label="Publié" name="published" type="checkbox" value={data.published} onChange={onChange} /></div></div><Field label="Résumé" name="resume" value={data.resume} onChange={onChange} required rows={3} /><Field label="Contenu complet" name="contenu" value={data.contenu} onChange={onChange} required rows={8} /></div>;
  if (type === "projets") return <div className="space-y-4"><Field label="Titre" name="titre" value={data.titre} onChange={onChange} required /><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="Statut" name="statut" value={data.statut} onChange={onChange} options={statuts} /><Field label="Partenaires" name="partenaires" value={data.partenaires} onChange={onChange} /><Field label="Image URL" name="image" value={data.image || ""} onChange={onChange} /><Field label="Publié" name="published" type="checkbox" value={data.published} onChange={onChange} /></div><Field label="Description" name="description" value={data.description} onChange={onChange} required rows={3} /><Field label="Contenu détaillé" name="contenu" value={data.contenu} onChange={onChange} required rows={6} /></div>;
  return null;
}

function StatusBadge({ published }: { published: boolean }) {
  return <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{published ? <><Eye size={10} />Publié</> : <><EyeOff size={10} />Brouillon</>}</span>;
}

export default function AdminPage() {
  const { user, isAuthenticated, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [cours, setCours] = useState<Cours[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; type: ContentType | null; isEdit: boolean; id: string | null; data: any }>({ open: false, type: null, isEdit: false, id: null, data: {} });
  const [saving, setSaving] = useState(false);
  const [userModal, setUserModal] = useState<{ open: boolean; data: any }>({ open: false, data: {} });
  const [savingUser, setSavingUser] = useState(false);

  useEffect(() => { if (!authLoading && (!isAuthenticated || !isAdmin)) router.push("/login"); }, [authLoading, isAuthenticated, isAdmin, router]);
  useEffect(() => { if (isAdmin) fetchAll(); }, [isAdmin]);

  function showToast(msg: string, type: "success" | "error") { setToast({ msg, type }); }

  async function fetchAll() {
    setFetching(true);
    try {
      const [c, e, u, a, ev, ar, p] = await Promise.all([
        fetch("/api/cours?all=true").then(r => r.json()).catch(() => ({})),
        fetch("/api/enrollments?all=true").then(r => r.json()).catch(() => ({})),
        fetch("/api/users").then(r => r.json()).catch(() => ({})),
        fetch("/api/actualites?all=true").then(r => r.json()).catch(() => ({})),
        fetch("/api/evenements?all=true").then(r => r.json()).catch(() => ({})),
        fetch("/api/articles?all=true").then(r => r.json()).catch(() => ({})),
        fetch("/api/projets?all=true").then(r => r.json()).catch(() => ({})),
      ]);
      setCours(c.cours || c.data || []);
      setEnrollments(e.enrollments || e.data || []);
      setAppUsers(u.users || u.data || []);
      setActualites(a.actualites || a.data || []);
      setEvenements(ev.evenements || ev.data || []);
      setArticles(ar.articles || ar.data || []);
      setProjets(p.projets || p.data || []);
    } catch { showToast("Erreur de chargement", "error"); }
    setFetching(false);
  }

  function openCreate(type: ContentType) { setModal({ open: true, type, isEdit: false, id: null, data: { ...defaultValues[type] } }); }
  function openEdit(type: ContentType, item: any) { setModal({ open: true, type, isEdit: true, id: item.id, data: { ...item } }); }
  function handleChange(e: React.ChangeEvent<any>) {
    const { name, type, value } = e.target;
    const val = type === "checkbox" ? e.target.checked : value;
    setModal(prev => ({ ...prev, data: { ...prev.data, [name]: val } }));
  }

  async function handleSave() {
    if (!modal.type) return;
    setSaving(true);
    try {
      const map: Record<ContentType, string> = { cours: "/api/cours", actualites: "/api/actualites", evenements: "/api/evenements", articles: "/api/articles", projets: "/api/projets" };
      const url = modal.isEdit ? `${map[modal.type]}/${modal.id}` : map[modal.type];
      const res = await fetch(url, { method: modal.isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(modal.data) });
      const json = await res.json();
      if (res.ok) { showToast(modal.isEdit ? "Mis à jour ✓" : "Créé ✓", "success"); setModal(prev => ({ ...prev, open: false })); await fetchAll(); }
      else showToast(json.error || "Erreur", "error");
    } catch { showToast("Erreur réseau", "error"); }
    setSaving(false);
  }

  async function handleDelete(endpoint: string, id: string, label: string) {
    if (!confirm(`Supprimer "${label}" ?`)) return;
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (res.ok) { showToast("Supprimé ✓", "success"); await fetchAll(); }
      else showToast("Erreur", "error");
    } catch { showToast("Erreur réseau", "error"); }
  }

  async function handleEnrollmentStatus(id: string, status: "approved" | "rejected") {
    const res = await fetch(`/api/enrollments/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (res.ok) { showToast(status === "approved" ? "Validée ✓" : "Refusée", status === "approved" ? "success" : "error"); await fetchAll(); }
  }

  async function handleUserUpdate(id: string, updates: any) {
    const res = await fetch(`/api/users/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates) });
    if (res.ok) { showToast("Mis à jour ✓", "success"); await fetchAll(); }
  }

  async function handleCreateUser() {
    setSavingUser(true);
    try {
      const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(userModal.data) });
      const json = await res.json();
      if (res.ok) { showToast("Utilisateur créé ✓", "success"); setUserModal({ open: false, data: {} }); await fetchAll(); }
      else showToast(json.error || "Erreur", "error");
    } catch { showToast("Erreur réseau", "error"); }
    setSavingUser(false);
  }

  async function togglePublished(type: ContentType, id: string, current: boolean) {
    const map: Record<ContentType, string> = { cours: "/api/cours", actualites: "/api/actualites", evenements: "/api/evenements", articles: "/api/articles", projets: "/api/projets" };
    const res = await fetch(`${map[type]}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !current }) });
    if (res.ok) { showToast(!current ? "Publié ✓" : "Brouillon", "success"); await fetchAll(); }
  }

  if (authLoading || !isAdmin) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  const stats = [
    { title: "Utilisateurs", value: appUsers.length, color: "bg-blue-500", Icon: Users },
    { title: "Cours", value: cours.length, color: "bg-emerald-500", Icon: BookOpen },
    { title: "Inscriptions", value: enrollments.length, color: "bg-violet-500", Icon: TrendingUp },
    { title: "En attente", value: enrollments.filter(e => e.status === "pending").length, color: "bg-orange-500", Icon: Bell },
  ];
  const typeLabels: Record<ContentType, string> = { cours: "Cours", actualites: "Actualité", evenements: "Événement", articles: "Article", projets: "Projet" };
  const tabs = [
    { id: "overview", label: "Dashboard", Icon: LayoutDashboard },
    { id: "cours", label: "Cours", Icon: BookOpen },
    { id: "enrollments", label: "Inscriptions", Icon: Users },
    { id: "actualites", label: "Actualités", Icon: FileText },
    { id: "evenements", label: "Événements", Icon: Calendar },
    { id: "articles", label: "Publications", Icon: Globe },
    { id: "projets", label: "Projets", Icon: TrendingUp },
    { id: "users", label: "Utilisateurs", Icon: Shield },
  ];

  function RowActions({ onEdit, onDelete, type, id, published }: { onEdit: () => void; onDelete: () => void; type: ContentType; id: string; published: boolean }) {
    return (
      <div className="flex items-center gap-1">
        <button onClick={() => togglePublished(type, id, published)} className={`p-1.5 rounded-lg transition-colors ${published ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}>{published ? <Eye size={15} /> : <EyeOff size={15} />}</button>
        <button onClick={onEdit} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 size={15} /></button>
        <button onClick={onDelete} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
      </div>
    );
  }

  function SectionHeader({ title, count, type }: { title: string; count: number; type: ContentType }) {
    return (
      <div className="flex items-center justify-between p-5 border-b bg-gray-50">
        <div><h2 className="font-bold text-gray-900 text-lg">{title}</h2><p className="text-sm text-gray-400">{count} élément(s)</p></div>
        <button onClick={() => openCreate(type)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"><PlusCircle size={16} />Ajouter</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {modal.open && modal.type && (
        <Modal title={`${modal.isEdit ? "Modifier" : "Créer"} — ${typeLabels[modal.type]}`} onClose={() => setModal(prev => ({ ...prev, open: false }))}>
          <ContentForm type={modal.type} data={modal.data} onChange={handleChange} />
          <div className="flex gap-3 pt-6 mt-2 border-t">
            <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{saving ? "Enregistrement..." : modal.isEdit ? "Enregistrer" : "Créer"}
            </button>
            <button onClick={() => setModal(prev => ({ ...prev, open: false }))} className="px-6 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium text-gray-700">Annuler</button>
          </div>
        </Modal>
      )}

      {userModal.open && (
        <Modal title="Créer un utilisateur" onClose={() => setUserModal({ open: false, data: {} })}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Prénom" name="prenom" value={userModal.data.prenom || ""} onChange={e => setUserModal(p => ({ ...p, data: { ...p.data, prenom: e.target.value } }))} required />
              <Field label="Nom" name="nom" value={userModal.data.nom || ""} onChange={e => setUserModal(p => ({ ...p, data: { ...p.data, nom: e.target.value } }))} required />
              <Field label="Email" name="email" type="email" value={userModal.data.email || ""} onChange={e => setUserModal(p => ({ ...p, data: { ...p.data, email: e.target.value } }))} required />
              <Field label="Mot de passe" name="password" type="password" value={userModal.data.password || ""} onChange={e => setUserModal(p => ({ ...p, data: { ...p.data, password: e.target.value } }))} required />
              <Field label="Pays" name="pays" value={userModal.data.pays || ""} onChange={e => setUserModal(p => ({ ...p, data: { ...p.data, pays: e.target.value } }))} />
              <Field label="Rôle" name="role" value={userModal.data.role || "member"} onChange={e => setUserModal(p => ({ ...p, data: { ...p.data, role: e.target.value } }))} options={[{ value: "member", label: "Membre" }, { value: "admin", label: "Admin" }]} />
            </div>
          </div>
          <div className="flex gap-3 pt-6 mt-2 border-t">
            <button onClick={handleCreateUser} disabled={savingUser} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium">
              {savingUser ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}{savingUser ? "Création..." : "Créer"}
            </button>
            <button onClick={() => setUserModal({ open: false, data: {} })} className="px-6 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium text-gray-700">Annuler</button>
          </div>
        </Modal>
      )}

      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 text-sm"><ArrowLeft size={16} /> Retour au site</Link>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-2"><div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Shield size={15} className="text-white" /></div><span className="font-bold text-gray-900">Administration</span></div>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{user?.prenom?.[0]}</div>
            <span className="text-sm font-medium text-gray-700">{user?.prenom} {user?.nom}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">ADMIN</span>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b overflow-x-auto">
        <div className="container mx-auto px-4 flex">
          {tabs.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              <Icon size={15} />{label}
            </button>
          ))}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {fetching && <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" /><p className="text-gray-400 text-sm">Chargement...</p></div>}
        {!fetching && (
          <>
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map(({ title, value, color, Icon }, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
                      <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center`}><Icon size={22} className="text-white" /></div>
                      <div><div className="text-2xl font-bold text-gray-900">{value}</div><div className="text-xs text-gray-400">{title}</div></div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-gray-900">Inscriptions en attente</h3><span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full">{enrollments.filter(e => e.status === "pending").length}</span></div>
                    <div className="space-y-3">
                      {enrollments.filter(e => e.status === "pending").slice(0, 6).map(e => (
                        <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="min-w-0 flex-1"><p className="font-medium text-gray-900 text-sm truncate">{e.user.prenom} {e.user.nom}</p><p className="text-xs text-gray-400 truncate">{e.cours.titre}</p></div>
                          <div className="flex gap-2 ml-3">
                            <button onClick={() => handleEnrollmentStatus(e.id, "approved")} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"><Check size={14} /></button>
                            <button onClick={() => handleEnrollmentStatus(e.id, "rejected")} className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"><X size={14} /></button>
                          </div>
                        </div>
                      ))}
                      {enrollments.filter(e => e.status === "pending").length === 0 && <p className="text-center py-6 text-gray-400 text-sm">Aucune inscription en attente</p>}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-5">
                    <h3 className="font-bold text-gray-900 mb-4">Créer du contenu</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { type: "cours" as ContentType, label: "Nouveau cours", Icon: BookOpen, color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
                        { type: "actualites" as ContentType, label: "Actualité", Icon: FileText, color: "bg-green-50 text-green-700 hover:bg-green-100" },
                        { type: "evenements" as ContentType, label: "Événement", Icon: Calendar, color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
                        { type: "articles" as ContentType, label: "Article", Icon: Globe, color: "bg-orange-50 text-orange-700 hover:bg-orange-100" },
                        { type: "projets" as ContentType, label: "Projet", Icon: TrendingUp, color: "bg-pink-50 text-pink-700 hover:bg-pink-100" },
                      ].map(({ type, label, Icon: Ico, color }) => (
                        <button key={type} onClick={() => { setActiveTab(type); openCreate(type); }} className={`${color} rounded-xl p-4 text-left text-sm font-medium transition-colors flex items-center gap-2`}>
                          <PlusCircle size={15} />{label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: "Cours", total: cours.length, pub: cours.filter(c => c.published).length, type: "cours" },
                    { label: "Actualités", total: actualites.length, pub: actualites.filter(a => a.published).length, type: "actualites" },
                    { label: "Événements", total: evenements.length, pub: evenements.filter(e => e.published).length, type: "evenements" },
                    { label: "Articles", total: articles.length, pub: articles.filter(a => a.published).length, type: "articles" },
                    { label: "Projets", total: projets.length, pub: projets.filter(p => p.published).length, type: "projets" },
                  ].map(s => (
                    <button key={s.type} onClick={() => setActiveTab(s.type)} className="bg-white rounded-xl shadow-sm p-4 text-left hover:shadow-md transition-shadow">
                      <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{s.total}</p>
                      <p className="text-xs text-green-600">{s.pub} publiés</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "cours" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <SectionHeader title="Gestion des Cours" count={cours.length} type="cours" />
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase text-gray-400 font-semibold bg-gray-50 border-b"><th className="px-5 py-3">Titre</th><th className="px-5 py-3">Instructeur</th><th className="px-5 py-3">Niveau</th><th className="px-5 py-3">Prix</th><th className="px-5 py-3">Statut</th><th className="px-5 py-3">Actions</th></tr></thead>
                  <tbody className="divide-y divide-gray-50">{cours.map(c => (<tr key={c.id} className="hover:bg-gray-50"><td className="px-5 py-4 font-medium max-w-[220px] truncate">{c.titre}</td><td className="px-5 py-4 text-gray-500">{c.instructeur}</td><td className="px-5 py-4"><span className="capitalize text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{c.niveau}</span></td><td className="px-5 py-4 text-gray-500">{c.prix === 0 ? "Gratuit" : `${c.prix.toLocaleString()} F`}</td><td className="px-5 py-4"><StatusBadge published={c.published} /></td><td className="px-5 py-4"><RowActions onEdit={() => openEdit("cours", c)} onDelete={() => handleDelete("/api/cours", c.id, c.titre)} type="cours" id={c.id} published={c.published} /></td></tr>))}{cours.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-gray-400">Aucun cours</td></tr>}</tbody>
                </table></div>
              </div>
            )}

            {activeTab === "enrollments" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b bg-gray-50"><h2 className="font-bold text-gray-900 text-lg">Inscriptions</h2><div className="flex gap-4 mt-1 text-sm"><span className="text-yellow-600">⏳ {enrollments.filter(e => e.status === "pending").length} en attente</span><span className="text-green-600">✓ {enrollments.filter(e => e.status === "approved").length} validées</span><span className="text-red-600">✗ {enrollments.filter(e => e.status === "rejected").length} refusées</span></div></div>
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase text-gray-400 font-semibold bg-gray-50 border-b"><th className="px-5 py-3">Étudiant</th><th className="px-5 py-3">Cours</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Statut</th><th className="px-5 py-3">Actions</th></tr></thead>
                  <tbody className="divide-y divide-gray-50">{enrollments.map(e => (<tr key={e.id} className="hover:bg-gray-50"><td className="px-5 py-4"><div className="font-medium text-gray-900">{e.user.prenom} {e.user.nom}</div><div className="text-xs text-gray-400">{e.user.email}</div></td><td className="px-5 py-4 text-gray-600 max-w-[180px] truncate">{e.cours.titre}</td><td className="px-5 py-4 text-gray-400 text-xs">{new Date(e.createdAt).toLocaleDateString("fr-FR")}</td><td className="px-5 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${e.status === "approved" ? "bg-green-100 text-green-700" : e.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{e.status === "approved" ? "Validé" : e.status === "rejected" ? "Refusé" : "En attente"}</span></td><td className="px-5 py-4">{e.status === "pending" ? <div className="flex gap-2"><button onClick={() => handleEnrollmentStatus(e.id, "approved")} className="p-1.5 bg-green-100 text-green-700 rounded-lg"><Check size={14} /></button><button onClick={() => handleEnrollmentStatus(e.id, "rejected")} className="p-1.5 bg-red-100 text-red-700 rounded-lg"><X size={14} /></button></div> : <button onClick={() => handleDelete("/api/enrollments", e.id, "cette inscription")} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"><Trash2 size={14} /></button>}</td></tr>))}{enrollments.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">Aucune inscription</td></tr>}</tbody>
                </table></div>
              </div>
            )}

            {activeTab === "actualites" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <SectionHeader title="Actualités" count={actualites.length} type="actualites" />
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase text-gray-400 font-semibold bg-gray-50 border-b"><th className="px-5 py-3">Titre</th><th className="px-5 py-3">Auteur</th><th className="px-5 py-3">Catégorie</th><th className="px-5 py-3">Statut</th><th className="px-5 py-3">Actions</th></tr></thead>
                  <tbody className="divide-y divide-gray-50">{actualites.map(a => (<tr key={a.id} className="hover:bg-gray-50"><td className="px-5 py-4 font-medium max-w-[250px] truncate">{a.titre}</td><td className="px-5 py-4 text-gray-500">{a.auteur}</td><td className="px-5 py-4 text-xs"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{a.categorie}</span></td><td className="px-5 py-4"><StatusBadge published={a.published} /></td><td className="px-5 py-4"><RowActions onEdit={() => openEdit("actualites", a)} onDelete={() => handleDelete("/api/actualites", a.id, a.titre)} type="actualites" id={a.id} published={a.published} /></td></tr>))}{actualites.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">Aucune actualité</td></tr>}</tbody>
                </table></div>
              </div>
            )}

            {activeTab === "evenements" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <SectionHeader title="Événements" count={evenements.length} type="evenements" />
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase text-gray-400 font-semibold bg-gray-50 border-b"><th className="px-5 py-3">Titre</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Lieu</th><th className="px-5 py-3">Statut</th><th className="px-5 py-3">Actions</th></tr></thead>
                  <tbody className="divide-y divide-gray-50">{evenements.map(e => (<tr key={e.id} className="hover:bg-gray-50"><td className="px-5 py-4 font-medium max-w-[220px] truncate">{e.titre}</td><td className="px-5 py-4 text-gray-500 text-xs">{new Date(e.date).toLocaleDateString("fr-FR")}</td><td className="px-5 py-4 text-gray-500">{e.lieu}</td><td className="px-5 py-4"><StatusBadge published={e.published} /></td><td className="px-5 py-4"><RowActions onEdit={() => openEdit("evenements", e)} onDelete={() => handleDelete("/api/evenements", e.id, e.titre)} type="evenements" id={e.id} published={e.published} /></td></tr>))}{evenements.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">Aucun événement</td></tr>}</tbody>
                </table></div>
              </div>
            )}

            {activeTab === "articles" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <SectionHeader title="Articles & Publications" count={articles.length} type="articles" />
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase text-gray-400 font-semibold bg-gray-50 border-b"><th className="px-5 py-3">Titre</th><th className="px-5 py-3">Auteur</th><th className="px-5 py-3">Catégorie</th><th className="px-5 py-3">Statut</th><th className="px-5 py-3">Actions</th></tr></thead>
                  <tbody className="divide-y divide-gray-50">{articles.map(a => (<tr key={a.id} className="hover:bg-gray-50"><td className="px-5 py-4 font-medium max-w-[250px] truncate">{a.titre}</td><td className="px-5 py-4 text-gray-500">{a.auteur}</td><td className="px-5 py-4 text-xs"><span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full">{a.categorie}</span></td><td className="px-5 py-4"><StatusBadge published={a.published} /></td><td className="px-5 py-4"><RowActions onEdit={() => openEdit("articles", a)} onDelete={() => handleDelete("/api/articles", a.id, a.titre)} type="articles" id={a.id} published={a.published} /></td></tr>))}{articles.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">Aucun article</td></tr>}</tbody>
                </table></div>
              </div>
            )}

            {activeTab === "projets" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <SectionHeader title="Projets" count={projets.length} type="projets" />
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase text-gray-400 font-semibold bg-gray-50 border-b"><th className="px-5 py-3">Titre</th><th className="px-5 py-3">Statut</th><th className="px-5 py-3">Partenaires</th><th className="px-5 py-3">Visibilité</th><th className="px-5 py-3">Actions</th></tr></thead>
                  <tbody className="divide-y divide-gray-50">{projets.map(p => (<tr key={p.id} className="hover:bg-gray-50"><td className="px-5 py-4 font-medium max-w-[220px] truncate">{p.titre}</td><td className="px-5 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.statut === "termine" ? "bg-blue-100 text-blue-700" : p.statut === "en_cours" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{p.statut.replace("_", " ")}</span></td><td className="px-5 py-4 text-gray-400 text-xs max-w-[150px] truncate">{p.partenaires || "—"}</td><td className="px-5 py-4"><StatusBadge published={p.published} /></td><td className="px-5 py-4"><RowActions onEdit={() => openEdit("projets", p)} onDelete={() => handleDelete("/api/projets", p.id, p.titre)} type="projets" id={p.id} published={p.published} /></td></tr>))}{projets.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">Aucun projet</td></tr>}</tbody>
                </table></div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b bg-gray-50">
                  <div><h2 className="font-bold text-gray-900 text-lg">Utilisateurs</h2><p className="text-sm text-gray-400">{appUsers.length} inscrits</p></div>
                  <button onClick={() => setUserModal({ open: true, data: { prenom: "", nom: "", email: "", password: "", pays: "", role: "member" } })} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium"><PlusCircle size={16} />Créer</button>
                </div>
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase text-gray-400 font-semibold bg-gray-50 border-b"><th className="px-5 py-3">Utilisateur</th><th className="px-5 py-3">Pays</th><th className="px-5 py-3">Rôle</th><th className="px-5 py-3">Inscriptions</th><th className="px-5 py-3">Compte</th><th className="px-5 py-3">Actions</th></tr></thead>
                  <tbody className="divide-y divide-gray-50">{appUsers.map(u => (<tr key={u.id} className="hover:bg-gray-50"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{u.prenom?.[0]}{u.nom?.[0]}</div><div><div className="font-medium text-gray-900">{u.prenom} {u.nom}</div><div className="text-xs text-gray-400">{u.email}</div></div></div></td><td className="px-5 py-4 text-gray-500">{u.pays}</td><td className="px-5 py-4"><select value={u.role} onChange={e => handleUserUpdate(u.id, { role: e.target.value, isActive: u.isActive })} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="student">Étudiant</option><option value="admin">Admin</option></select></td><td className="px-5 py-4 text-center"><span className="font-bold text-gray-700">{u._count?.enrollments ?? 0}</span></td><td className="px-5 py-4"><button onClick={() => handleUserUpdate(u.id, { role: u.role, isActive: !u.isActive })} className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${u.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}>{u.isActive ? "✓ Actif" : "✗ Inactif"}</button></td><td className="px-5 py-4"><button onClick={() => handleDelete("/api/users", u.id, `${u.prenom} ${u.nom}`)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button></td></tr>))}{appUsers.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-gray-400">Aucun utilisateur</td></tr>}</tbody>
                </table></div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
