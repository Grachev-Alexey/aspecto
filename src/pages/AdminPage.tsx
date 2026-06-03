import React, { useState, useEffect, useRef } from "react";
import {
  X, Plus, Trash2, Edit2, FileText, TrendingUp, Inbox, Layers,
  Database, CheckCircle, Clock, AlertCircle, Lock, RefreshCw,
  ShoppingBag, Calendar, Upload, ImageIcon, Tag
} from "lucide-react";
import { FurnitureItem, MaterialSample, Category } from "../types";

type Tab = "leads" | "products" | "materials" | "categories" | "analytics";

function api(path: string, options?: RequestInit) {
  return fetch(path, {
    ...options,
    headers: options?.body instanceof FormData
      ? { ...(options?.headers || {}) }
      : { "Content-Type": "application/json", ...(options?.headers || {}) },
  }).then(r => r.json());
}

function ImageUploader({
  currentUrl,
  onUploaded,
  size = 1200
}: {
  currentUrl: string;
  onUploaded: (url: string) => void;
  size?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [mode, setMode] = useState<"url" | "upload">("upload");

  useEffect(() => { setUrlInput(currentUrl); }, [currentUrl]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const r = await fetch(`/api/upload?size=${size}`, { method: "POST", body: fd });
      const data = await r.json();
      if (data.url) { onUploaded(data.url); setUrlInput(data.url); }
      else alert("Ошибка загрузки: " + (data.error || "неизвестная ошибка"));
    } catch { alert("Ошибка соединения при загрузке фото"); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ""; }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 mb-2">
        <button type="button" onClick={() => setMode("upload")}
          className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded border cursor-pointer transition-all ${mode === "upload" ? "bg-[#ff8562]/10 border-[#ff8562]/40 text-[#ff8562]" : "border-white/10 text-white/40 hover:text-white"}`}>
          <Upload className="w-3 h-3 inline mr-1" />Загрузить файл
        </button>
        <button type="button" onClick={() => setMode("url")}
          className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded border cursor-pointer transition-all ${mode === "url" ? "bg-[#ff8562]/10 border-[#ff8562]/40 text-[#ff8562]" : "border-white/10 text-white/40 hover:text-white"}`}>
          <ImageIcon className="w-3 h-3 inline mr-1" />URL ссылка
        </button>
      </div>

      {mode === "upload" ? (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg transition-all cursor-pointer ${uploading ? "border-[#ff8562]/40 bg-[#ff8562]/5" : "border-white/10 hover:border-[#ff8562]/40 hover:bg-white/2"}`}
        >
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="sr-only" />
          {currentUrl ? (
            <div className="flex items-center gap-3 p-3">
              <img src={currentUrl} alt="" className="w-20 h-14 object-cover rounded border border-white/10 shrink-0" />
              <div className="text-left">
                <p className="text-xs text-white/70 font-mono truncate max-w-[180px]">{currentUrl.split("/").pop()}</p>
                <p className="text-[10px] text-[#ff8562] mt-1">{uploading ? "Загрузка и оптимизация..." : "Нажмите для замены фото"}</p>
                <p className="text-[10px] text-white/30 mt-0.5">WebP, макс. {size}px, авто-оптимизация</p>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              {uploading ? (
                <span className="w-6 h-6 border-2 border-[#ff8562]/30 border-t-[#ff8562] rounded-full animate-spin inline-block" />
              ) : (
                <Upload className="w-6 h-6 text-white/20 mx-auto mb-2" />
              )}
              <p className="text-xs text-white/40 mt-1">{uploading ? "Оптимизируем изображение..." : "Перетащите или нажмите для выбора"}</p>
              <p className="text-[10px] text-white/20 mt-1">WebP, макс. {size}px · авто-оптимизация</p>
            </div>
          )}
        </div>
      ) : (
        <input
          value={urlInput}
          onChange={e => { setUrlInput(e.target.value); onUploaded(e.target.value); }}
          className="w-full bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm focus:border-[#ff8562] focus:outline-none rounded font-mono text-xs"
          placeholder="https://..."
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem("aspekto_admin_token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("leads");

  const [products, setProducts] = useState<FurnitureItem[]>([]);
  const [materials, setMaterials] = useState<MaterialSample[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const [editingProduct, setEditingProduct] = useState<FurnitureItem | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<FurnitureItem>>({
    title: "", category: "kitchen", image: "", description: "",
    materials: [], dimensions: "", priceEstimate: "",
    specs: { hardware: "", facade: "", countertop: "", leadTime: "" }
  });
  const [tempMaterialInput, setTempMaterialInput] = useState("");

  const [editingMaterial, setEditingMaterial] = useState<MaterialSample | null>(null);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [materialForm, setMaterialForm] = useState<Partial<MaterialSample>>({
    name: "", category: "wood", image: "", origin: "", finishType: "", description: ""
  });

  const [newCategoryForm, setNewCategoryForm] = useState({ id: "", name: "", type: "product" });
  const [categoryError, setCategoryError] = useState("");

  const productCategories = categories.filter(c => c.type === "product");
  const materialCategories = categories.filter(c => c.type === "material");

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : id;
  };

  useEffect(() => {
    if (token) {
      api("/api/admin/verify", { method: "POST", body: JSON.stringify({ token }) }).then(r => {
        if (r.ok) setIsAuthenticated(true);
        else { setToken(""); sessionStorage.removeItem("aspekto_admin_token"); }
      });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadAll();
  }, [isAuthenticated]);

  const loadAll = async () => {
    setDataLoading(true);
    const [p, m, l, c] = await Promise.all([
      api("/api/products"), api("/api/materials"), api("/api/leads"), api("/api/categories")
    ]);
    setProducts(Array.isArray(p) ? p : []);
    setMaterials(Array.isArray(m) ? m : []);
    setLeads(Array.isArray(l) ? l : []);
    setCategories(Array.isArray(c) ? c : []);
    setDataLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setAuthError("");
    const r = await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
    setLoading(false);
    if (r.ok) {
      sessionStorage.setItem("aspekto_admin_token", r.token);
      setToken(r.token);
      setIsAuthenticated(true);
    } else {
      setAuthError(r.message || "Неверный пароль");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("aspekto_admin_token");
    setToken(""); setIsAuthenticated(false); setPassword("");
  };

  // ── PRODUCTS ──────────────────────────────────────────────────────────────

  const defaultCategory = productCategories[0]?.id || "kitchen";

  const startAddProduct = () => {
    setIsAddingProduct(true); setEditingProduct(null);
    setProductForm({
      title: "", category: defaultCategory, image: "", description: "",
      materials: [], dimensions: "3000 x 2400 x 600 мм", priceEstimate: "от 300 000 ₽",
      specs: { hardware: "Blum Legrabox (Австрия)", facade: "МДФ в эмали", countertop: "Кварцевый агломерат", leadTime: "40 рабочих дней" }
    });
    setTempMaterialInput("");
  };

  const startEditProduct = (p: FurnitureItem) => {
    setEditingProduct(p); setIsAddingProduct(false);
    setProductForm({ ...p }); setTempMaterialInput("");
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.description) return;
    if (editingProduct) {
      const updated = await api(`/api/products/${editingProduct.id}`, {
        method: "PUT", body: JSON.stringify(productForm)
      });
      setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
      setEditingProduct(null);
    } else {
      const newProd = await api("/api/products", {
        method: "POST",
        body: JSON.stringify({ ...productForm, id: `prod-${Date.now()}` })
      });
      setProducts([newProd, ...products]);
      setIsAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Удалить товар из каталога?")) return;
    await api(`/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAddMaterialTag = () => {
    if (tempMaterialInput.trim()) {
      setProductForm({ ...productForm, materials: [...(productForm.materials || []), tempMaterialInput.trim()] });
      setTempMaterialInput("");
    }
  };

  // ── MATERIALS ─────────────────────────────────────────────────────────────

  const startAddMaterial = () => {
    setIsAddingMaterial(true); setEditingMaterial(null);
    setMaterialForm({
      name: "", category: materialCategories[0]?.id || "wood",
      image: "", origin: "Алтай, Россия", finishType: "Масло-воск OSMO", description: ""
    });
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialForm.name || !materialForm.description) return;
    if (editingMaterial) {
      const updated = await api(`/api/materials/${editingMaterial.id}`, {
        method: "PUT", body: JSON.stringify(materialForm)
      });
      setMaterials(materials.map(m => m.id === editingMaterial.id ? updated : m));
      setEditingMaterial(null);
    } else {
      const newMat = await api("/api/materials", {
        method: "POST",
        body: JSON.stringify({ ...materialForm, id: `mat-${Date.now()}` })
      });
      setMaterials([...materials, newMat]);
      setIsAddingMaterial(false);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm("Удалить образец материала?")) return;
    await api(`/api/materials/${id}`, { method: "DELETE" });
    setMaterials(materials.filter(m => m.id !== id));
  };

  // ── CATEGORIES ─────────────────────────────────────────────────────────────

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError("");
    const id = newCategoryForm.id.trim().toLowerCase().replace(/\s+/g, "-");
    if (!id || !newCategoryForm.name.trim()) { setCategoryError("Заполните ID и название"); return; }
    if (categories.find(c => c.id === id)) { setCategoryError("Категория с таким ID уже существует"); return; }
    const r = await api("/api/categories", {
      method: "POST",
      body: JSON.stringify({ id, name: newCategoryForm.name.trim(), type: newCategoryForm.type, sort_order: 99 })
    });
    if (r.error) { setCategoryError(r.error); return; }
    setCategories([...categories, r]);
    setNewCategoryForm({ id: "", name: "", type: "product" });
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm(`Удалить категорию «${getCategoryName(id)}»? Товары в этой категории останутся, но потеряют связь.`)) return;
    const r = await api(`/api/categories/${id}`, { method: "DELETE" });
    if (r.error) { alert(r.error); return; }
    setCategories(categories.filter(c => c.id !== id));
  };

  // ── LEADS ─────────────────────────────────────────────────────────────────

  const handleToggleLeadStatus = async (leadId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    const updated = await api(`/api/leads/${leadId}`, {
      method: "PUT", body: JSON.stringify({ status: newStatus })
    });
    setLeads(leads.map(l => l.id === leadId ? updated : l));
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Удалить эту заявку навсегда?")) return;
    await api(`/api/leads/${leadId}`, { method: "DELETE" });
    setLeads(leads.filter(l => l.id !== leadId));
  };

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#181818] border border-white/10 rounded-lg p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#ff8562]/10 border border-[#ff8562]/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-[#ff8562]" />
            </div>
            <h1 className="text-xl font-serif text-white uppercase tracking-widest">Аспекто</h1>
            <p className="text-xs text-white/40 mt-1 font-mono uppercase tracking-widest">Панель управления</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Пароль администратора</label>
              <input type="password" placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff8562] transition-colors" autoFocus />
              {authError && (
                <p className="text-[#ff8562] text-xs mt-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />{authError}
                </p>
              )}
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#ff8562] hover:bg-white hover:text-black text-white font-serif tracking-widest uppercase text-xs py-3.5 rounded transition-all cursor-pointer font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Войти"}
            </button>
          </form>
          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <a href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors font-mono">← Вернуться на сайт</a>
          </div>
        </div>
      </div>
    );
  }

  // ── ADMIN CONSOLE ─────────────────────────────────────────────────────────

  const pendingLeads = leads.filter(l => l.status !== "completed").length;

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex flex-col font-sans text-white">

      <header className="border-b border-white/10 bg-[#181818] px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded bg-[#ff8562]/10 border border-[#ff8562]/20">
            <Database className="w-4 h-4 text-[#ff8562]" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#ff8562]">Менеджмент-узел</p>
            <h1 className="text-sm font-semibold text-white font-serif leading-none">АСПЕКТО — АДМИНИСТРИРОВАНИЕ</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadAll}
            className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-mono bg-white/5 hover:bg-white/10 text-white/60 border border-white/10 rounded flex items-center gap-1.5 transition-all cursor-pointer">
            <RefreshCw className="w-3 h-3" /><span className="hidden sm:inline">Обновить</span>
          </button>
          <button onClick={handleLogout}
            className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-mono bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 rounded flex items-center gap-1.5 transition-all cursor-pointer">
            <X className="w-3 h-3" /><span className="hidden sm:inline">Выйти</span>
          </button>
          <a href="/" className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-mono text-white/40 hover:text-white border border-white/10 rounded transition-all">← Сайт</a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <aside className="w-56 bg-[#161616] border-r border-white/5 p-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-1.5">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest px-3 mb-3">Навигация</p>
            {([
              { id: "leads", icon: Inbox, label: "Заявки клиентов", badge: pendingLeads },
              { id: "products", icon: ShoppingBag, label: "Каталог товаров", badge: products.length },
              { id: "materials", icon: Layers, label: "Материалы", badge: materials.length },
              { id: "categories", icon: Tag, label: "Категории", badge: categories.length },
              { id: "analytics", icon: TrendingUp, label: "Аналитика", badge: null },
            ] as const).map(tab => (
              <button key={tab.id}
                onClick={() => { setActiveTab(tab.id); setEditingProduct(null); setIsAddingProduct(false); setEditingMaterial(null); setIsAddingMaterial(false); }}
                className={`w-full px-3 py-2.5 rounded text-xs text-left font-medium tracking-wide flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#ff8562]/10 text-[#ff8562] border-l-2 border-[#ff8562]"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}>
                <div className="flex items-center gap-2.5">
                  <tab.icon className="w-4 h-4" /><span>{tab.label}</span>
                </div>
                {tab.badge !== null && (
                  <span className={`px-1.5 py-0.5 rounded-sm text-[9px] ${tab.id === "leads" ? "bg-[#ff8562]/20 text-[#ff8562]" : "bg-white/5 text-white/50"}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="pt-4 border-t border-white/5 text-[10px] font-mono text-white/30 space-y-1">
            <div>База данных: <span className="text-emerald-400">PostgreSQL</span></div>
            <div>Соединение: <span className="text-emerald-400">Активно</span></div>
          </div>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto bg-[#111111]">

          {dataLoading && (
            <div className="flex items-center justify-center py-20">
              <span className="w-8 h-8 border-2 border-[#ff8562]/30 border-t-[#ff8562] rounded-full animate-spin" />
            </div>
          )}

          {!dataLoading && (
            <>
              {/* ── LEADS ── */}
              {activeTab === "leads" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-serif text-white">Список заявок клиентов</h2>
                      <p className="text-xs text-white/50 mt-1">Все обращения с сайта — звонки, замеры, конфигурации, экскурсии.</p>
                    </div>
                    <span className="font-mono text-xs text-[#ff8562] bg-[#ff8562]/10 px-3 py-1 border border-[#ff8562]/30 rounded">
                      {leads.length} лидов
                    </span>
                  </div>

                  {leads.length === 0 ? (
                    <div className="border border-dashed border-white/10 p-16 text-center rounded-lg space-y-3">
                      <Inbox className="w-8 h-8 text-white/20 mx-auto" />
                      <p className="text-sm text-white/50">Заявок пока нет</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leads.map(lead => (
                        <div key={lead.id}
                          className={`border p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                            lead.status === "completed"
                              ? "bg-[#181818]/40 border-white/5 opacity-60"
                              : "bg-[#1a1a1a] border-white/10 hover:border-[#ff8562]/20"
                          }`}>
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-[9px] uppercase tracking-wider bg-black border border-white/10 text-[#ff8562] px-2 py-0.5 rounded-sm">
                                {lead.category || "Общая заявка"}
                              </span>
                              {lead.selectedTable && (
                                <span className="font-mono text-[9px] uppercase bg-[#ff8562]/10 text-white px-2 py-0.5 rounded-sm border border-[#ff8562]/20">
                                  Конструктор стола
                                </span>
                              )}
                              <span className="font-mono text-[10px] text-white/40 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#ff8562]" />{lead.createdAt}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-white flex items-center gap-2">
                              {lead.name}
                              <span className="text-xs font-mono text-white/50">{lead.phone}</span>
                            </p>
                            {lead.comments && (
                              <p className="text-xs text-white/70 bg-black/30 p-2.5 rounded border border-white/5">{lead.comments}</p>
                            )}
                            {lead.selectedTable && (
                              <div className="bg-[#121212] border border-white/10 p-2 text-[10px] font-mono text-white/60 rounded max-w-md grid grid-cols-2 gap-x-2 gap-y-1">
                                <span className="text-white/30">Порода:</span><span className="text-[#ff8562] text-right">{lead.selectedTable.woodType}</span>
                                <span className="text-white/30">Смола:</span><span className="text-white text-right">{lead.selectedTable.resinColor}</span>
                                <span className="text-white/30">Размер:</span><span className="text-white text-right">{lead.selectedTable.tableSize} мм</span>
                                <span className="text-white/30">Опоры:</span><span className="text-white text-right">{lead.selectedTable.legsStyle}</span>
                                <span className="text-white/30">Цена:</span><span className="text-[#ff8562] text-right font-bold">{lead.selectedTable.price}</span>
                              </div>
                            )}
                            {lead.showroomBooking && (
                              <div className="bg-[#121212] border border-white/10 p-2.5 text-[10px] font-mono rounded max-w-sm text-white/70 flex gap-3">
                                <Calendar className="w-4 h-4 text-[#ff8562] shrink-0" />
                                <div>
                                  <div>Бронь: <span className="text-white font-bold">{lead.showroomBooking.date} / {lead.showroomBooking.time}</span></div>
                                  <div>Спикер: <span className="text-[#ff8562]">{lead.showroomBooking.consultant}</span></div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => handleToggleLeadStatus(lead.id, lead.status)}
                              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                                lead.status === "completed"
                                  ? "border-white/10 text-white/40 hover:text-white hover:border-white/30"
                                  : "border-emerald-700/50 text-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/40"
                              }`}>
                              <CheckCircle className="w-3 h-3" />
                              {lead.status === "completed" ? "Переоткрыть" : "Завершить"}
                            </button>
                            <button onClick={() => handleDeleteLead(lead.id)}
                              className="p-2 text-white/30 hover:text-red-400 border border-white/5 hover:border-red-900/50 rounded transition-all cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── PRODUCTS ── */}
              {activeTab === "products" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-serif text-white">Каталог товаров</h2>
                      <p className="text-xs text-white/50 mt-1">Управление позициями каталога мебели.</p>
                    </div>
                    {!isAddingProduct && !editingProduct && (
                      <button onClick={startAddProduct}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#ff8562] hover:bg-white hover:text-black text-white rounded flex items-center gap-2 transition-all cursor-pointer">
                        <Plus className="w-3.5 h-3.5" />Добавить товар
                      </button>
                    )}
                  </div>

                  {(isAddingProduct || editingProduct) && (
                    <form onSubmit={handleSaveProduct} className="bg-[#181818] border border-white/10 rounded-lg p-6 space-y-4">
                      <h3 className="text-base font-serif text-white">{editingProduct ? "Редактировать товар" : "Новый товар"}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Название товара</label>
                          <input value={productForm.title || ""} onChange={e => setProductForm({ ...productForm, title: e.target.value })} required
                            className="w-full bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm focus:border-[#ff8562] focus:outline-none rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Категория</label>
                          <select value={productForm.category || ""} onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm focus:border-[#ff8562] focus:outline-none rounded cursor-pointer">
                            {productCategories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Цена</label>
                          <input value={productForm.priceEstimate || ""} onChange={e => setProductForm({ ...productForm, priceEstimate: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm focus:border-[#ff8562] focus:outline-none rounded" placeholder="от 300 000 ₽" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Фотография товара</label>
                          <ImageUploader
                            currentUrl={productForm.image || ""}
                            onUploaded={url => setProductForm({ ...productForm, image: url })}
                            size={1200}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Описание</label>
                          <textarea value={productForm.description || ""} onChange={e => setProductForm({ ...productForm, description: e.target.value })} required rows={3}
                            className="w-full bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm focus:border-[#ff8562] focus:outline-none rounded resize-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Габариты</label>
                          <input value={productForm.dimensions || ""} onChange={e => setProductForm({ ...productForm, dimensions: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm focus:border-[#ff8562] focus:outline-none rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Срок производства</label>
                          <input value={productForm.specs?.leadTime || ""} onChange={e => setProductForm({ ...productForm, specs: { ...productForm.specs, leadTime: e.target.value } })}
                            className="w-full bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm focus:border-[#ff8562] focus:outline-none rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Фурнитура</label>
                          <input value={productForm.specs?.hardware || ""} onChange={e => setProductForm({ ...productForm, specs: { ...productForm.specs, hardware: e.target.value } })}
                            className="w-full bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm focus:border-[#ff8562] focus:outline-none rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Фасад</label>
                          <input value={productForm.specs?.facade || ""} onChange={e => setProductForm({ ...productForm, specs: { ...productForm.specs, facade: e.target.value } })}
                            className="w-full bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm focus:border-[#ff8562] focus:outline-none rounded" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Материалы (теги)</label>
                          <div className="flex gap-2 mb-2">
                            <input value={tempMaterialInput} onChange={e => setTempMaterialInput(e.target.value)}
                              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddMaterialTag())}
                              className="flex-1 bg-black/40 border border-white/10 text-white px-3 py-2 text-sm focus:border-[#ff8562] focus:outline-none rounded"
                              placeholder="Массив дуба, МДФ..." />
                            <button type="button" onClick={handleAddMaterialTag}
                              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors cursor-pointer">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(productForm.materials || []).map((mat, i) => (
                              <span key={i} className="flex items-center gap-1.5 bg-[#ff8562]/10 border border-[#ff8562]/20 text-[#ff8562] text-[10px] font-mono px-2 py-1 rounded">
                                {mat}
                                <button type="button" onClick={() => setProductForm({ ...productForm, materials: (productForm.materials || []).filter((_, idx) => idx !== i) })}
                                  className="text-[#ff8562]/60 hover:text-[#ff8562] cursor-pointer"><X className="w-3 h-3" /></button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit"
                          className="px-6 py-2.5 bg-[#ff8562] hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-wider rounded transition-all cursor-pointer">
                          Сохранить
                        </button>
                        <button type="button" onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
                          className="px-6 py-2.5 border border-white/10 text-white/60 hover:text-white text-xs font-mono uppercase tracking-wider rounded transition-all cursor-pointer">
                          Отмена
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {products.map(p => (
                      <div key={p.id} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 flex items-center gap-4">
                        <img src={p.image} alt={p.title} className="w-16 h-12 object-cover rounded border border-white/10 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{p.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono text-[#ff8562]/70 bg-[#ff8562]/5 border border-[#ff8562]/10 px-2 py-0.5 rounded-full">{getCategoryName(p.category)}</span>
                            <span className="text-[10px] text-[#ff8562] font-mono">{p.priceEstimate}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => startEditProduct(p)}
                            className="p-2 text-white/40 hover:text-[#ff8562] border border-white/5 hover:border-[#ff8562]/30 rounded transition-all cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 text-white/40 hover:text-red-400 border border-white/5 hover:border-red-900/50 rounded transition-all cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── MATERIALS ── */}
              {activeTab === "materials" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-serif text-white">Библиотека материалов</h2>
                      <p className="text-xs text-white/50 mt-1">Образцы материалов, доступные в студии.</p>
                    </div>
                    {!isAddingMaterial && !editingMaterial && (
                      <button onClick={startAddMaterial}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#ff8562] hover:bg-white hover:text-black text-white rounded flex items-center gap-2 transition-all cursor-pointer">
                        <Plus className="w-3.5 h-3.5" />Добавить материал
                      </button>
                    )}
                  </div>

                  {(isAddingMaterial || editingMaterial) && (
                    <form onSubmit={handleSaveMaterial} className="bg-[#181818] border border-white/10 rounded-lg p-6 space-y-4">
                      <h3 className="text-base font-serif text-white">{editingMaterial ? "Редактировать материал" : "Новый материал"}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Название</label>
                          <input value={materialForm.name || ""} onChange={e => setMaterialForm({ ...materialForm, name: e.target.value })} required
                            className="w-full bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm focus:border-[#ff8562] focus:outline-none rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Категория</label>
                          <select value={materialForm.category || ""} onChange={e => setMaterialForm({ ...materialForm, category: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm focus:border-[#ff8562] focus:outline-none rounded cursor-pointer">
                            {materialCategories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Фотография материала</label>
                          <ImageUploader
                            currentUrl={materialForm.image || ""}
                            onUploaded={url => setMaterialForm({ ...materialForm, image: url })}
                            size={800}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Происхождение</label>
                          <input value={materialForm.origin || ""} onChange={e => setMaterialForm({ ...materialForm, origin: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm focus:border-[#ff8562] focus:outline-none rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Покрытие/Финиш</label>
                          <input value={materialForm.finishType || ""} onChange={e => setMaterialForm({ ...materialForm, finishType: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm focus:border-[#ff8562] focus:outline-none rounded" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Описание</label>
                          <textarea value={materialForm.description || ""} onChange={e => setMaterialForm({ ...materialForm, description: e.target.value })} required rows={3}
                            className="w-full bg-black/40 border border-white/10 text-white px-3 py-2.5 text-sm focus:border-[#ff8562] focus:outline-none rounded resize-none" />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit"
                          className="px-6 py-2.5 bg-[#ff8562] hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-wider rounded transition-all cursor-pointer">
                          Сохранить
                        </button>
                        <button type="button" onClick={() => { setIsAddingMaterial(false); setEditingMaterial(null); }}
                          className="px-6 py-2.5 border border-white/10 text-white/60 hover:text-white text-xs font-mono uppercase tracking-wider rounded transition-all cursor-pointer">
                          Отмена
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {materials.map(m => (
                      <div key={m.id} className="bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden">
                        <div className="h-32 overflow-hidden">
                          <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold text-white">{m.name}</p>
                              <p className="text-[10px] text-[#ff8562] font-mono mt-0.5">{getCategoryName(m.category)}</p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button onClick={() => { setEditingMaterial(m); setIsAddingMaterial(false); setMaterialForm({ ...m }); }}
                                className="p-1.5 text-white/40 hover:text-[#ff8562] border border-white/5 hover:border-[#ff8562]/30 rounded transition-all cursor-pointer">
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button onClick={() => handleDeleteMaterial(m.id)}
                                className="p-1.5 text-white/40 hover:text-red-400 border border-white/5 hover:border-red-900/50 rounded transition-all cursor-pointer">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[10px] text-white/50 mt-2 line-clamp-2">{m.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── CATEGORIES ── */}
              {activeTab === "categories" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-serif text-white">Управление категориями</h2>
                    <p className="text-xs text-white/50 mt-1">Категории для товаров и материалов. Отображаются на сайте на русском языке.</p>
                  </div>

                  {/* Add category form */}
                  <form onSubmit={handleAddCategory} className="bg-[#181818] border border-white/10 rounded-lg p-5 space-y-4">
                    <h3 className="text-sm font-serif text-white">Добавить новую категорию</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">ID (латиница, без пробелов)</label>
                        <input
                          value={newCategoryForm.id}
                          onChange={e => setNewCategoryForm({ ...newCategoryForm, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                          placeholder="bedroom"
                          className="w-full bg-black/40 border border-white/10 text-white px-3 py-2 text-sm focus:border-[#ff8562] focus:outline-none rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Название (по-русски)</label>
                        <input
                          value={newCategoryForm.name}
                          onChange={e => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
                          placeholder="Спальни"
                          className="w-full bg-black/40 border border-white/10 text-white px-3 py-2 text-sm focus:border-[#ff8562] focus:outline-none rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Тип</label>
                        <select value={newCategoryForm.type} onChange={e => setNewCategoryForm({ ...newCategoryForm, type: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 text-white px-3 py-2 text-sm focus:border-[#ff8562] focus:outline-none rounded cursor-pointer">
                          <option value="product">Категория товаров</option>
                          <option value="material">Категория материалов</option>
                        </select>
                      </div>
                    </div>
                    {categoryError && <p className="text-[#ff8562] text-xs flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{categoryError}</p>}
                    <button type="submit"
                      className="px-5 py-2 bg-[#ff8562] hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-2">
                      <Plus className="w-3.5 h-3.5" />Добавить категорию
                    </button>
                  </form>

                  {/* Product categories */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#ff8562]" />Категории товаров
                    </h3>
                    <div className="space-y-2">
                      {productCategories.map(cat => (
                        <div key={cat.id} className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] bg-black/40 border border-white/10 text-white/50 px-2 py-0.5 rounded">{cat.id}</span>
                            <span className="text-sm text-white font-medium">{cat.name}</span>
                            <span className="text-[10px] text-white/30 font-mono">
                              {products.filter(p => p.category === cat.id).length} товаров
                            </span>
                          </div>
                          <button onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 text-white/30 hover:text-red-400 border border-white/5 hover:border-red-900/50 rounded transition-all cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Material categories */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#ff8562]" />Категории материалов
                    </h3>
                    <div className="space-y-2">
                      {materialCategories.map(cat => (
                        <div key={cat.id} className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] bg-black/40 border border-white/10 text-white/50 px-2 py-0.5 rounded">{cat.id}</span>
                            <span className="text-sm text-white font-medium">{cat.name}</span>
                            <span className="text-[10px] text-white/30 font-mono">
                              {materials.filter(m => m.category === cat.id).length} позиций
                            </span>
                          </div>
                          <button onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 text-white/30 hover:text-red-400 border border-white/5 hover:border-red-900/50 rounded transition-all cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── ANALYTICS ── */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-serif text-white">Сводка аналитики</h2>
                    <p className="text-xs text-white/50 mt-1">Обзор данных студии в реальном времени.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Всего заявок", value: leads.length, color: "text-[#ff8562]" },
                      { label: "Ожидают", value: leads.filter(l => l.status !== "completed").length, color: "text-amber-400" },
                      { label: "Завершено", value: leads.filter(l => l.status === "completed").length, color: "text-emerald-400" },
                      { label: "Товаров в каталоге", value: products.length, color: "text-blue-400" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-[#181818] border border-white/10 rounded-lg p-5 text-center">
                        <p className={`text-3xl font-bold font-serif ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-white/40 mt-1 font-mono uppercase tracking-wider">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#181818] border border-white/10 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-white mb-4 font-serif">Последние заявки</h3>
                    <div className="space-y-2">
                      {leads.slice(0, 5).map(l => (
                        <div key={l.id} className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${l.status === "completed" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
                            <span className="text-white font-semibold">{l.name}</span>
                            <span className="text-white/40 font-mono text-[10px]">{l.category}</span>
                          </div>
                          <span className="text-white/30 font-mono text-[10px]">{l.createdAt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#181818] border border-white/10 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-white mb-3 font-serif">Товары по категориям</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {productCategories.map(cat => (
                        <div key={cat.id} className="text-center p-3 bg-black/20 rounded border border-white/5">
                          <p className="text-xl font-bold text-[#ff8562]">{products.filter(p => p.category === cat.id).length}</p>
                          <p className="text-[10px] font-mono text-white/40 uppercase mt-1">{cat.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
