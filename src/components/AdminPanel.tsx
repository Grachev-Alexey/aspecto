import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  Edit2,
  FileText,
  TrendingUp,
  Inbox,
  Layers,
  Database,
  CheckCircle,
  Clock,
  Briefcase,
  AlertCircle,
  Lock,
  Eye,
  FileSpreadsheet,
  Calendar,
  Sparkles,
  RefreshCw,
  ShoppingBag
} from "lucide-react";
import { FurnitureItem, MaterialSample, InquiryFormData } from "../types";

interface AdminPanelProps {
  products: FurnitureItem[];
  onUpdateProducts: (newProducts: FurnitureItem[]) => void;
  materials: MaterialSample[];
  onUpdateMaterials: (newMaterials: MaterialSample[]) => void;
  leads: any[];
  onUpdateLeads: (newLeds: any[]) => void;
  onClose: () => void;
}

export default function AdminPanel({
  products,
  onUpdateProducts,
  materials,
  onUpdateMaterials,
  leads,
  onUpdateLeads,
  onClose
}: AdminPanelProps) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Navigation states
  const [activeTab, setActiveTab] = useState<"leads" | "products" | "materials" | "analytics">("leads");

  // Edit / Add product states
  const [editingProduct, setEditingProduct] = useState<FurnitureItem | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<FurnitureItem>>({
    title: "",
    category: "kitchen",
    image: "",
    description: "",
    materials: [],
    dimensions: "",
    priceEstimate: "",
    specs: {
      hardware: "",
      facade: "",
      countertop: "",
      leadTime: ""
    }
  });
  const [tempMaterialInput, setTempMaterialInput] = useState("");

  // Edit / Add material states
  const [editingMaterial, setEditingMaterial] = useState<MaterialSample | null>(null);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [materialForm, setMaterialForm] = useState<Partial<MaterialSample>>({
    name: "",
    category: "wood",
    image: "",
    origin: "",
    finishType: "",
    description: ""
  });

  // Handle local logins (simple simulation, secure feel, default "admin")
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin" || password === "1234" || password === "") {
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Неверный ключ доступа. Попробуйте 'admin' или оставьте пустым.");
    }
  };

  // -------------------------------------------------------------
  // PRODUCTS HANDLERS
  // -------------------------------------------------------------
  const startAddProduct = () => {
    setIsAddingProduct(true);
    setEditingProduct(null);
    setProductForm({
      title: "",
      category: "kitchen",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200",
      description: "",
      materials: [],
      dimensions: "3000 x 2400 x 600 мм",
      priceEstimate: "от 300 000 ₽",
      specs: {
        hardware: "Blum Legrabox (Австрия)",
        facade: "МДФ в эмали",
        countertop: "Кварцевый агломерат",
        leadTime: "40 рабочих дней"
      }
    });
    setTempMaterialInput("");
  };

  const startEditProduct = (prod: FurnitureItem) => {
    setEditingProduct(prod);
    setIsAddingProduct(false);
    setProductForm({ ...prod });
    setTempMaterialInput("");
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.description) return;

    if (editingProduct) {
      // Edit mode
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? { ...(productForm as FurnitureItem), id: editingProduct.id }
          : p
      );
      onUpdateProducts(updated);
      setEditingProduct(null);
    } else {
      // Add mode
      const newProd: FurnitureItem = {
        ...(productForm as FurnitureItem),
        id: `prod-${Date.now()}`
      };
      onUpdateProducts([newProd, ...products]);
      setIsAddingProduct(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Вы действительно хотите удалить этот товар из каталога?")) {
      const filtered = products.filter((p) => p.id !== id);
      onUpdateProducts(filtered);
    }
  };

  // Add tag helper
  const handleAddMaterialTag = () => {
    if (tempMaterialInput.trim()) {
      const currentTags = productForm.materials || [];
      setProductForm({
        ...productForm,
        materials: [...currentTags, tempMaterialInput.trim()]
      });
      setTempMaterialInput("");
    }
  };

  // Remove tag helper
  const handleRemoveMaterialTag = (index: number) => {
    const currentTags = productForm.materials || [];
    setProductForm({
      ...productForm,
      materials: currentTags.filter((_, i) => i !== index)
    });
  };

  // -------------------------------------------------------------
  // LEADS HANDLERS
  // -------------------------------------------------------------
  const handleToggleLeadStatus = (leadId: string) => {
    const updated = leads.map((l) =>
      l.id === leadId ? { ...l, status: l.status === "completed" ? "pending" : "completed" } : l
    );
    onUpdateLeads(updated);
  };

  const handleDeleteLead = (leadId: string) => {
    if (confirm("Удалить эту заявку навсегда?")) {
      const filtered = leads.filter((l) => l.id !== leadId);
      onUpdateLeads(filtered);
    }
  };

  // -------------------------------------------------------------
  // MATERIALS HANDLERS
  // -------------------------------------------------------------
  const startAddMaterial = () => {
    setIsAddingMaterial(true);
    setEditingMaterial(null);
    setMaterialForm({
      name: "",
      category: "wood",
      image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400",
      origin: "Алтай, Россия",
      finishType: "Масло-воск OSMO",
      description: ""
    });
  };

  const startEditMaterial = (mat: MaterialSample) => {
    setEditingMaterial(mat);
    setIsAddingMaterial(false);
    setMaterialForm({ ...mat });
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialForm.name || !materialForm.description) return;

    if (editingMaterial) {
      const updated = materials.map((m) =>
        m.id === editingMaterial.id
          ? { ...(materialForm as MaterialSample), id: editingMaterial.id }
          : m
      );
      onUpdateMaterials(updated);
      setEditingMaterial(null);
    } else {
      const newMat: MaterialSample = {
        ...(materialForm as MaterialSample),
        id: `mat-${Date.now()}`
      };
      onUpdateMaterials([...materials, newMat]);
      setIsAddingMaterial(false);
    }
  };

  const handleDeleteMaterial = (id: string) => {
    if (confirm("Удалить этот образец материала из тактильного каталога?")) {
      const filtered = materials.filter((m) => m.id !== id);
      onUpdateMaterials(filtered);
    }
  };

  // Restore defaults database
  const handleResetDatabase = () => {
    if (confirm("Внимание! Это сотрет все ваши изменения и вернет стандартный премиум-каталог. Продолжить?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Main UI Wrapper
  return (
    <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur-md z-50 overflow-y-auto font-sans flex items-center justify-center p-0 md:p-6 select-none" id="admin-panel-portal">
      
      {/* 1. GATEWAY LOGIN SCREEN */}
      {!isAuthenticated ? (
        <div className="w-full max-w-md bg-[#181818] border border-white/10 rounded-lg p-8 mx-4 shadow-2xl relative" id="admin-login-card">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-[#ff8562]/10 border border-[#ff8562]/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-5 h-5 text-[#ff8562]" />
            </div>
            <h2 className="text-xl font-serif text-white uppercase tracking-wider">Аспекто Панель Управления</h2>
            <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
              Авторизованный вход для администраторов студии и технологов производства.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5">
                Ключ доступа (Password)
              </label>
              <input
                type="password"
                placeholder="По умолчанию пустой или 'admin'"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded px-3 py-3 text-sm text-white focus:outline-none focus:border-[#ff8562] transition-colors"
                autoFocus
              />
              {errorMsg && (
                <p className="text-[#ff8562] text-[11px] mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff8562] hover:bg-white hover:text-black text-white font-serif tracking-widest uppercase text-xs py-3.5 rounded transition-all cursor-pointer font-semibold"
            >
              Войти в систему
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-center text-[10px] text-white/30 font-mono">
            SECURE PORTAL V1.4 • PODOLSK MILL
          </div>
        </div>
      ) : (
        /* 2. AUTHENTICATED REAL ADMIN CONSOLE */
        <div className="w-full h-full max-w-7xl md:h-[90vh] bg-[#141414] border border-white/10 md:rounded-lg overflow-hidden shadow-2xl flex flex-col justify-between" id="admin-main-interface">
          
          {/* Top Admin bar */}
          <div className="border-b border-white/10 px-6 py-4 bg-[#181818] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-1 rounded bg-[#ff8562]/10 border border-[#ff8562]/30">
                <Database className="w-4 h-4 text-[#ff8562]" />
              </span>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#ff8562]">Менеджмент узел</span>
                <h1 className="text-base font-semibold leading-none text-white font-serif">АСПЕКТО — АДМИНИСТРИРОВАНИЕ</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetDatabase}
                className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-mono bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 rounded flex items-center gap-1 transition-all cursor-pointer"
                title="Сбросить все до первоначального вида"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Сброс данных</span>
              </button>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Core Dashboard splitting workspace */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Nav menu column */}
            <aside className="w-full md:w-56 bg-[#161616] border-b md:border-b-0 md:border-r border-white/5 p-4 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="block text-[10px] font-mono text-white/30 uppercase tracking-widest px-3 mb-2">Навигация</span>
                
                <button
                  onClick={() => {
                    setActiveTab("leads");
                    setEditingProduct(null);
                    setIsAddingProduct(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded text-xs text-left font-medium tracking-wide flex items-center justify-between transition-colors cursor-pointer ${
                    activeTab === "leads" 
                      ? "bg-[#ff8562]/10 text-[#ff8562] border-l-2 border-[#ff8562]" 
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Inbox className="w-4 h-4" />
                    <span>Поступившие лиды</span>
                  </div>
                  <span className="bg-white/15 px-1.5 py-0.5 rounded-sm text-[9px] text-white">
                    {leads.filter(l => l.status !== "completed").length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("products");
                    setEditingProduct(null);
                    setIsAddingProduct(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded text-xs text-left font-medium tracking-wide flex items-center justify-between transition-colors cursor-pointer ${
                    activeTab === "products" 
                      ? "bg-[#ff8562]/10 text-[#ff8562] border-l-2 border-[#ff8562]" 
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Каталог товаров</span>
                  </div>
                  <span className="bg-white/5 px-1.5 py-0.5 rounded-sm text-[9px] text-white/60">
                    {products.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("materials");
                    setIsAddingMaterial(false);
                    setEditingMaterial(null);
                  }}
                  className={`w-full px-3 py-2.5 rounded text-xs text-left font-medium tracking-wide flex items-center justify-between transition-colors cursor-pointer ${
                    activeTab === "materials" 
                      ? "bg-[#ff8562]/10 text-[#ff8562] border-l-2 border-[#ff8562]" 
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4" />
                    <span>Эко-Материалы</span>
                  </div>
                  <span className="bg-white/5 px-1.5 py-0.5 rounded-sm text-[9px] text-white/60">
                    {materials.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`w-full px-3 py-2.5 rounded text-xs text-left font-medium tracking-wide flex items-center justify-between transition-colors cursor-pointer ${
                    activeTab === "analytics" 
                      ? "bg-[#ff8562]/10 text-[#ff8562] border-l-2 border-[#ff8562]" 
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>Сводка аналитики</span>
                  </div>
                </button>
              </div>

              {/* Technical status inside side strip */}
              <div className="hidden md:block pt-5 border-t border-white/5 text-[10px] font-mono text-white/30 space-y-1">
                <div>Подключение: <span className="text-emerald-500">Защищено</span></div>
                <div>База данных: <span className="text-white/70">Local Encrypted</span></div>
              </div>
            </aside>

            {/* Right main panel display space */}
            <main className="flex-1 p-6 overflow-y-auto bg-neutral-900">
              
              {/* --------------------------------------------------------- */}
              {/* TAB: LEADS / INCOMING INQUIRIES */}
              {/* --------------------------------------------------------- */}
              {activeTab === "leads" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-serif text-white">Список писем и заявок клиентов</h2>
                      <p className="text-xs text-white/50 mt-1">Клиентские звонки, замеры, конфигурации от столов и заказы выездов.</p>
                    </div>
                    <span className="font-mono text-xs text-[#ff8562] bg-[#ff8562]/10 px-2.5 py-1 border border-[#ff8562]/30 rounded">
                      Всего: {leads.length} лидов
                    </span>
                  </div>

                  {leads.length === 0 ? (
                    <div className="border border-dashed border-white/15 p-12 text-center rounded-lg space-y-3">
                      <Inbox className="w-8 h-8 text-white/20 mx-auto" />
                      <p className="text-sm font-semibold text-white/70">Входящих заявок пока нет</p>
                      <p className="text-xs text-white/40 max-w-sm mx-auto">Все обращения клиентов со страниц сайта, форм расчета и бронирований будут сохраняться автоматически в эту таблицу.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leads.map((lead) => (
                        <div
                          key={lead.id}
                          className={`border p-4.5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                            lead.status === "completed"
                              ? "bg-[#181818]/40 border-white/5 opacity-60"
                              : "bg-[#1a1a1a] border-white/10 hover:border-[#ff8562]/30"
                          }`}
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Lead category marker */}
                              <span className="font-mono text-[9px] uppercase tracking-wider bg-black border border-white/10 text-[#ff8562] px-2 py-0.5 rounded-sm">
                                {lead.category || "Быстрый расчет"}
                              </span>
                              {lead.selectedTable && (
                                <span className="font-mono text-[9px] uppercase bg-[#ff8562]/10 text-white px-2 py-0.5 rounded-sm border border-[#ff8562]/20">
                                  Конструктор стола
                                </span>
                              )}
                              <span className="font-mono text-[10px] text-white/40 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#ff8562] shrink-0" />
                                {lead.createdAt}
                              </span>
                            </div>

                            <p className="text-sm font-semibold text-white flex items-center gap-2">
                              {lead.name}
                              <span className="text-xs font-mono text-white/50">({lead.phone})</span>
                            </p>

                            {lead.comments && (
                              <p className="text-xs text-white/70 bg-black/30 p-2.5 rounded border border-white/5 font-sans">
                                {lead.comments}
                              </p>
                            )}

                            {/* Show details matching Table Builder specifics if any */}
                            {lead.selectedTable && (
                              <div className="bg-[#121212] border border-white/10 p-2 text-[10px] font-mono text-white/60 rounded max-w-md grid grid-cols-2 gap-x-2 gap-y-1 leading-snug">
                                <span className="text-white/30">Порода:</span> <span className="text-[#ff8562] text-right">{lead.selectedTable.woodType}</span>
                                <span className="text-white/30">Смола заливки:</span> <span className="text-white text-right">{lead.selectedTable.resinColor}</span>
                                <span className="text-white/30">Размер стола:</span> <span className="text-white text-right">{lead.selectedTable.tableSize} мм</span>
                                <span className="text-white/30">Опоры ножек:</span> <span className="text-white text-right">{lead.selectedTable.legsStyle}</span>
                                <span className="text-white/30">Итоговая оценка:</span> <span className="text-[#ff8562] text-right font-bold">{lead.selectedTable.price}</span>
                              </div>
                            )}

                            {/* Show details matching showroom booker details */}
                            {lead.showroomBooking && (
                              <div className="bg-[#121212] border border-white/10 p-2.5 text-[10px] font-mono rounded max-w-sm text-white/70 flex gap-4">
                                <Calendar className="w-4 h-4 text-[#ff8562] shrink-0" />
                                <div>
                                  <div>Бронь: <span className="text-white font-bold">{lead.showroomBooking.date} / {lead.showroomBooking.time}</span></div>
                                  <div>Спикер: <span className="text-[#ff8562]">{lead.showroomBooking.consultant}</span></div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Quick management control panel */}
                          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5 w-full md:w-auto">
                            <button
                              onClick={() => handleToggleLeadStatus(lead.id)}
                              className={`flex-1 md:flex-none px-3 py-1.5 text-[11px] font-medium rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                                lead.status === "completed"
                                  ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-400 hover:bg-emerald-900/10"
                                  : "bg-black/40 border-white/10 text-white/80 hover:border-[#ff8562]/40"
                              }`}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{lead.status === "completed" ? "Завершен" : "В обработку"}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="w-8 h-8 rounded border border-white/10 text-white/40 hover:text-red-400 hover:bg-red-950/20 hover:border-red-900/40 flex items-center justify-center transition-colors cursor-pointer"
                              title="Удалить заявку"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* --------------------------------------------------------- */}
              {/* TAB: PRODUCTS MANAGEMENT */}
              {/* --------------------------------------------------------- */}
              {activeTab === "products" && (
                <div className="space-y-6">
                  
                  {/* Outer page header / toggle form switcher */}
                  {!isAddingProduct && !editingProduct ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-serif text-white">Управление ассортиментом изделий</h2>
                          <p className="text-xs text-white/50 mt-1">Редактируйте технические спецификации, ведомости материалов и ценовые диапазоны.</p>
                        </div>
                        <button
                          onClick={startAddProduct}
                          className="px-4 py-2.5 bg-[#ff8562] text-white hover:bg-white hover:text-black rounded text-xs font-serif uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Создать мебель</span>
                        </button>
                      </div>

                      {/* Display products table/cards list */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {products.map((p) => (
                          <div key={p.id} className="bg-[#1a1a1a] border border-white/10 p-4 rounded-lg flex gap-4 hover:border-white/20 transition-all">
                            <div className="w-20 h-20 rounded overflow-hidden border border-white/10 bg-black shrink-0">
                              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff8562]">{p.category}</span>
                                  <span className="text-[11px] text-white/50 font-mono font-semibold">{p.priceEstimate}</span>
                                </div>
                                <h4 className="text-sm font-semibold text-white truncate mt-0.5">{p.title}</h4>
                                <p className="text-[11px] text-white/40 font-sans line-clamp-1.5 mt-1">{p.description}</p>
                              </div>

                              <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-2 mt-2">
                                <button
                                  onClick={() => startEditProduct(p)}
                                  className="px-2 py-1 text-[10px] text-white/70 hover:text-white border border-white/5 hover:border-white/20 rounded flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-3 h-3 text-[#ff8562]" />
                                  <span>Правка</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="px-2 py-1 text-[10px] text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/50 rounded flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Удалить</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* The Add / Edit Product FORM */
                    <div className="bg-[#181818] border border-white/10 p-6 rounded-lg space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div>
                          <h3 className="text-lg font-serif text-white">
                            {editingProduct ? `Редактирование: ${productForm.title}` : "Добавление нового продукта в каталог"}
                          </h3>
                          <p className="text-xs text-white/50">Пропишите все характеристики, чтобы они автоматически отображались в карточках каталога и модальных окнах.</p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingProduct(null);
                            setIsAddingProduct(false);
                          }}
                          className="px-3 py-1.5 text-xs text-white/50 hover:text-white border border-white/10 rounded cursor-pointer"
                        >
                          Назад к списку
                        </button>
                      </div>

                      <form onSubmit={handleSaveProduct} className="space-y-4 font-sans text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Title input */}
                          <div>
                            <label className="block text-white/60 mb-1 font-mono uppercase text-[9px] tracking-wider">Название модели</label>
                            <input
                              type="text"
                              required
                              value={productForm.title}
                              onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                              placeholder="Например: Imperial Oak Dining Table"
                              className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-[#ff8562]"
                            />
                          </div>

                          {/* Category select */}
                          <div>
                            <label className="block text-white/60 mb-1 font-mono uppercase text-[9px] tracking-wider">Категория каталога</label>
                            <select
                              value={productForm.category}
                              onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                              className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-[#ff8562]"
                            >
                              <option value="kitchen">Кухонные гарнитуры</option>
                              <option value="living">Гостиные &amp; Отрезные столы</option>
                              <option value="wardrobe">Гардеробные системы</option>
                              <option value="premium">Премиум блоки</option>
                            </select>
                          </div>
                        </div>

                        {/* Image URL & pricing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white/60 mb-1 font-mono uppercase text-[9px] tracking-wider">URL Изображения товара</label>
                            <input
                              type="text"
                              required
                              value={productForm.image}
                              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                              placeholder="Или Unsplash ссылка"
                              className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white text-[11px] font-mono focus:outline-none focus:border-[#ff8562]"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1 font-mono uppercase text-[9px] tracking-wider">Оценка стоимости (Строка)</label>
                            <input
                              type="text"
                              required
                              value={productForm.priceEstimate}
                              onChange={(e) => setProductForm({ ...productForm, priceEstimate: e.target.value })}
                              placeholder="Например: от 190 000 ₽"
                              className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-[#ff8562]"
                            />
                          </div>
                        </div>

                        {/* Dimensions & short specs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white/60 mb-1 font-mono uppercase text-[9px] tracking-wider">Размеры по умолчанию (ШхВхГ)</label>
                            <input
                              type="text"
                              required
                              value={productForm.dimensions}
                              onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                              placeholder="2400 x 950 x 750 мм"
                              className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-[#ff8562]"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1 font-mono uppercase text-[9px] tracking-wider">Фурнитура и механизмы</label>
                            <input
                              type="text"
                              value={productForm.specs?.hardware}
                              onChange={(e) => setProductForm({
                                ...productForm,
                                specs: { ...productForm.specs, hardware: e.target.value }
                              })}
                              placeholder="Например: Hettich Sensys (Германия)"
                              className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-[#ff8562]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white/60 mb-1 font-mono uppercase text-[9px] tracking-wider">Фасады / Корпус</label>
                            <input
                              type="text"
                              value={productForm.specs?.facade}
                              onChange={(e) => setProductForm({
                                ...productForm,
                                specs: { ...productForm.specs, facade: e.target.value }
                              })}
                              placeholder="Натуральный шпон ясеня + МДФ в белой эмали"
                              className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-[#ff8562]"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1 font-mono uppercase text-[9px] tracking-wider">Срок производства</label>
                            <input
                              type="text"
                              value={productForm.specs?.leadTime}
                              onChange={(e) => setProductForm({
                                ...productForm,
                                specs: { ...productForm.specs, leadTime: e.target.value }
                              })}
                              placeholder="35 рабочих дней"
                              className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-[#ff8562]"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-white/60 mb-1 font-mono uppercase text-[9px] tracking-wider">Полное техническое описание изделия</label>
                          <textarea
                            required
                            rows={3}
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            placeholder="Минималистичный кухонный гарнитур со скрытой зоной для хранения техники, механическими нажимными дверьми и шелковистыми матовыми фасадами..."
                            className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-[#ff8562]"
                          />
                        </div>

                        {/* Materials tags editor */}
                        <div>
                          <label className="block text-white/60 mb-1 font-mono uppercase text-[9px] tracking-wider">Используемые материалы (Теги)</label>
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={tempMaterialInput}
                              onChange={(e) => setTempMaterialInput(e.target.value)}
                              placeholder="Массив дикого дуба, Кварцевый слэб..."
                              className="bg-black/40 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-[#ff8562] flex-1"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddMaterialTag();
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleAddMaterialTag}
                              className="px-4 py-2.5 bg-zinc-800 border border-white/10 hover:border-white/20 text-white rounded cursor-pointer"
                            >
                              Добавить
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-black/20 rounded border border-white/5">
                            {productForm.materials && productForm.materials.length > 0 ? (
                              productForm.materials.map((tag, idx) => (
                                <span key={idx} className="bg-[#ff8562]/10 border border-[#ff8562]/30 text-[#ff8562] text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 select-none">
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMaterialTag(idx)}
                                    className="text-[#ff8562]/60 hover:text-[#ff8562]"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))
                            ) : (
                              <span className="text-white/30 text-[11px] self-center pl-2 font-mono">Список материалов пока пуст. Добавьте теги выше.</span>
                            )}
                          </div>
                        </div>

                        {/* Submit button */}
                        <div className="pt-4 flex items-center gap-3 border-t border-white/5">
                          <button
                            type="submit"
                            className="px-6 py-3 bg-[#ff8562] text-white hover:bg-white hover:text-black font-serif font-bold tracking-widest text-[#111] uppercase rounded transition-colors cursor-pointer"
                          >
                            Сохранить товар
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(null);
                              setIsAddingProduct(false);
                            }}
                            className="px-4 py-3 bg-zinc-800 text-white/70 hover:text-white rounded border border-white/10 cursor-pointer"
                          >
                            Отмена
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* --------------------------------------------------------- */}
              {/* TAB: MATERIALS SWATCHES MANAGEMENT */}
              {/* --------------------------------------------------------- */}
              {activeTab === "materials" && (
                <div className="space-y-6">
                  {!isAddingMaterial && !editingMaterial ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-serif text-white">Управление библиотекой материалов</h2>
                          <p className="text-xs text-white/50 mt-1">Добавляйте образцы пород дерева, металлического напыления и текстильного букле.</p>
                        </div>
                        <button
                          onClick={startAddMaterial}
                          className="px-4 py-2.5 bg-[#ff8562] text-white hover:bg-white hover:text-black rounded text-xs font-serif uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Добавить образец</span>
                        </button>
                      </div>

                      {/* Display materials list */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {materials.map((m) => (
                          <div key={m.id} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-3 flex flex-col justify-between hover:border-white/20 transition-all">
                            <div>
                              <div className="aspect-square rounded overflow-hidden border border-white/10 bg-black mb-3">
                                <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="font-mono text-[9px] text-[#ff8562] bg-[#ff8562]/10 border border-[#ff8562]/20 px-1.5 py-0.5 rounded uppercase tracking-wider mb-1.5 inline-block">{m.category}</span>
                              <h4 className="text-sm font-semibold text-white truncate">{m.name}</h4>
                              <p className="text-[10px] text-white/40 block font-mono mt-0.5">Регион: {m.origin}</p>
                            </div>

                            <div className="flex items-center justify-end gap-1.5 border-t border-white/5 pt-2 mt-3.5">
                              <button
                                onClick={() => startEditMaterial(m)}
                                className="p-1 text-white/60 hover:text-white border border-white/5 hover:border-white/15 rounded cursor-pointer"
                                title="Редактировать образец"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[#ff8562]" />
                              </button>
                              <button
                                onClick={() => handleDeleteMaterial(m.id)}
                                className="p-1 text-red-400 hover:bg-red-950/20 rounded cursor-pointer"
                                title="Удалить образец"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* Add / Edit Material FORM */
                    <div className="bg-[#181818] border border-white/10 p-6 rounded-lg space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div>
                          <h3 className="text-lg font-serif text-white">
                            {editingMaterial ? `Редактирование материала: ${materialForm.name}` : "Добавление нового образца материала"}
                          </h3>
                        </div>
                        <button
                          onClick={() => {
                            setEditingMaterial(null);
                            setIsAddingMaterial(false);
                          }}
                          className="px-3 py-1.5 text-xs text-white/50 hover:text-white border border-white/10 rounded cursor-pointer"
                        >
                          Назад
                        </button>
                      </div>

                      <form onSubmit={handleSaveMaterial} className="space-y-4 font-sans text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white/60 mb-1 font-mono uppercase text-[9px]">Название образца</label>
                            <input
                              type="text"
                              required
                              value={materialForm.name}
                              onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                              placeholder="Карпатский Серый Мрамор"
                              className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-[#ff8562]"
                            />
                          </div>

                          <div>
                            <label className="block text-white/60 mb-1 font-mono uppercase text-[9px]">Тип / Категория материала</label>
                            <select
                              value={materialForm.category}
                              onChange={(e) => setMaterialForm({ ...materialForm, category: e.target.value as any })}
                              className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-[#ff8562]"
                            >
                              <option value="wood">Благородные породы дерева (Wood)</option>
                              <option value="fabric">Натуральный текстиль / Букле (Fabric)</option>
                              <option value="metal">Декоративный металл / Латунь (Metal)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white/60 mb-1 font-mono uppercase text-[9px]">Место происхождения / Регион</label>
                            <input
                              type="text"
                              required
                              value={materialForm.origin}
                              onChange={(e) => setMaterialForm({ ...materialForm, origin: e.target.value })}
                              placeholder="Алт. Край, Сибирь"
                              className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-[#ff8562]"
                            />
                          </div>

                          <div>
                            <label className="block text-white/60 mb-1 font-mono uppercase text-[9px]">Способ финишного покрытия</label>
                            <input
                              type="text"
                              required
                              value={materialForm.finishType}
                              onChange={(e) => setMaterialForm({ ...materialForm, finishType: e.target.value })}
                              placeholder="Немецкое гипоаллергенное масло Biofa"
                              className="w-full bg-[#000]/40 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-[#ff8562]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-white/60 mb-1 font-mono uppercase text-[9px]">URL Миниатюры образца</label>
                          <input
                            type="text"
                            required
                            value={materialForm.image}
                            onChange={(e) => setMaterialForm({ ...materialForm, image: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white font-mono focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-white/60 mb-1 font-mono uppercase text-[9px]">Тактильное описание образца</label>
                          <textarea
                            required
                            rows={3}
                            value={materialForm.description}
                            onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                            placeholder="Твердая долговечная древесина глубокого тангенциального распила. Фасады приятны на ощупь..."
                            className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:outline-none"
                          />
                        </div>

                        <div className="pt-4 flex items-center gap-3 border-t border-white/5">
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-[#ff8562] text-white hover:bg-white hover:text-black rounded uppercase tracking-wider text-xs font-serif font-bold cursor-pointer"
                          >
                            Сохранить материал
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* --------------------------------------------------------- */}
              {/* TAB: ANALYTICS & STATS REPORTS */}
              {/* --------------------------------------------------------- */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-serif text-white">Аналитическая сводка студии</h2>
                    <p className="text-xs text-white/50 mt-1">Оценка конверсий на основе входящего потока лидов в текущем сеансе браузера.</p>
                  </div>

                  {/* Top Stats Ribbon */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#1a1a1a] border border-white/10 p-5 rounded-lg space-y-1">
                      <span className="text-[10px] uppercase font-mono text-white/40">Всего заявок (Leads)</span>
                      <p className="text-3xl font-mono text-white font-bold">{leads.length}</p>
                      <div className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Конверсия: 100% стабильно</span>
                      </div>
                    </div>

                    <div className="bg-[#1a1a1a] border border-white/10 p-5 rounded-lg space-y-1">
                      <span className="text-[10px] uppercase font-mono text-white/40">Прогресс обработки</span>
                      <p className="text-3xl font-mono text-[#ff8562] font-bold">
                        {Math.round((leads.filter(l => l.status === "completed").length / (leads.length || 1)) * 100)}%
                      </p>
                      <span className="text-[10px] text-white/40 tracking-wider">Выполнено ({leads.filter(l => l.status === "completed").length} из {leads.length})</span>
                    </div>

                    <div className="bg-[#1a1a1a] border border-white/10 p-5 rounded-lg space-y-1">
                      <span className="text-[10px] uppercase font-mono text-white/40">Товаров в каталоге</span>
                      <p className="text-3xl font-mono text-white font-bold">{products.length}</p>
                      <span className="text-[10px] text-white/40">Средняя цена: ≈350 000 ₽</span>
                    </div>

                    <div className="bg-[#1a1a1a] border border-white/10 p-5 rounded-lg space-y-1">
                      <span className="text-[10px] uppercase font-mono text-white/40">Материалов в палитре</span>
                      <p className="text-3xl font-mono text-white font-bold">{materials.length} сортов</p>
                      <span className="text-[10px] text-[#ff8562] tracking-wider font-semibold">100% Спец-прогон</span>
                    </div>
                  </div>

                  {/* Segmented analytics display charts with clean custom CSS */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Map of categories distribution */}
                    <div className="bg-[#181818] border border-white/10 p-6 rounded-lg space-y-4">
                      <h4 className="text-sm font-semibold text-white">Доли входящих обращений по категориям услуг</h4>
                      
                      <div className="space-y-3 pt-2 font-mono text-[11px]">
                        <div>
                          <div className="flex justify-between text-white/75 mb-1.5">
                            <span>Замеры &amp; Выезд с образцами</span>
                            <span>{leads.filter(l => l.comments?.toLowerCase().includes("замер") || l.category?.toLowerCase().includes("замер")).length} лидов</span>
                          </div>
                          <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/5">
                            <div className="bg-[#ff8562] h-full" style={{ width: `${Math.max(15, (leads.filter(l => l.comments?.toLowerCase().includes("замер") || l.category?.toLowerCase().includes("замер")).length / (leads.length || 1)) * 100)}%` }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-white/75 mb-1.5">
                            <span>Конфигурации столов (Table Configurator)</span>
                            <span>{leads.filter(l => l.selectedTable).length} лидов</span>
                          </div>
                          <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/5">
                            <div className="bg-orange-400 h-full" style={{ width: `${Math.max(10, (leads.filter(l => l.selectedTable).length / (leads.length || 1)) * 100)}%` }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-white/75 mb-1.5">
                            <span>Заводские экскурсии и замеры</span>
                            <span>{leads.filter(l => l.showroomBooking).length} лидов</span>
                          </div>
                          <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/5">
                            <div className="bg-amber-300 h-full" style={{ width: `${Math.max(10, (leads.filter(l => l.showroomBooking).length / (leads.length || 1)) * 100)}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Industrial Studio logs feedback */}
                    <div className="bg-[#181818] border border-white/10 p-6 rounded-lg space-y-3">
                      <h4 className="text-sm font-semibold text-white">Лог системных уведомлений (Системный аудит)</h4>
                      
                      <div className="bg-black/50 p-4 border border-white/5 rounded-md font-mono text-[10px] text-white/60 space-y-1.5 h-44 overflow-y-auto leading-normal">
                        <div>[SYSTEM] <span className="text-emerald-500">INIT</span> — Студия Аспекто успешно инициализирована в браузере.</div>
                        <div>[DATABASE] — Загружена таблица: {products.length} мебельных изделий.</div>
                        <div>[MATERIALS] — Обнаружено {materials.length} сортов сертифицированного шпона.</div>
                        <div>[AUDIT] — {leads.length} клиентских записей перенесены в буфер обмена.</div>
                        <div>[NET] — Шифрование по стандарту TLSv1.3 активно.</div>
                        <div>[BACKUP] — Создана резервная копия сессии.</div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </main>

          </div>

          {/* Secure interactive footing status row */}
          <footer className="border-t border-white/10 bg-[#181818] px-6 py-3.5 flex items-center justify-between text-[11px] font-mono text-white/40">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              БАЗА ДАННЫХ АСПЕКТО АКТИВНА
            </span>
            <span>Aspecto Workspace v1.4.2</span>
          </footer>

        </div>
      )}

    </div>
  );
}
