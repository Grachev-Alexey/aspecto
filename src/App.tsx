/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Trees,
  Sliders,
  Play,
  Check,
  ChevronDown,
  Info,
  Calendar,
  X,
  Compass,
  MapPin,
  MessageSquare,
  Volume2,
  PhoneCall
} from "lucide-react";

// Sub-components import
import Header from "./components/Header";
import InteractiveBuilder from "./components/InteractiveBuilder";
import CatalogGrid from "./components/CatalogGrid";
import PortfolioSlider from "./components/PortfolioSlider";
import ExcursionBooking from "./components/ExcursionBooking";
import Footer from "./components/Footer";
import LeadInquiryModal from "./components/LeadInquiryModal";
import AdminPanel from "./components/AdminPanel";
import ContactsPage from "./components/ContactsPage";
import LegalPage from "./components/LegalPage";

// Data import
import { FURNITURE_CATALOG, MATERIAL_SAMPLES, FAQS } from "./data";
import { MaterialSample, FurnitureItem } from "./types";

// Initial seed for managing student-leads / studio operations
const INITIAL_LEADS = [
  {
    id: "lead-seed-1",
    name: "Дмитрий Назаров",
    phone: "+7 (916) 432-88-11",
    category: "Экскурсия на производство",
    comments: "Запись на субботу к Михаилу Гришину. Хочет посмотреть срез дикого дуба и обсудить угловую кухню.",
    createdAt: "01.06, 12:44",
    status: "completed"
  },
  {
    id: "lead-seed-2",
    name: "Екатерина П.",
    phone: "+7 (903) 124-55-90",
    category: "Расчет \"Кухонный гарнитур Аспекто Графит\"",
    comments: "Оформлена заявка на расчет индивидуальной кухни Аспекто Графит (ЖК 'Пресня'). Нужен замерщик с образцами.",
    createdAt: "01.06, 13:02",
    status: "pending"
  },
  {
    id: "lead-seed-3",
    name: "Артур (Королев Парк)",
    phone: "+7 (925) 789-33-44",
    category: "Конструктор стола из массива",
    comments: "Запрос на изготовление обеденного стола размером 2200х1000мм с прозрачной эпоксидной рекой. Массив: Кавказский Черный Орех.",
    selectedTable: {
      woodType: "Кавказский Черный Орех",
      resinColor: "Кристально-голубая река",
      tableSize: "2200x1000x750",
      legsStyle: "Патинированная шлифованная латунь",
      price: "от 240 000 ₽"
    },
    createdAt: "01.06, 14:15",
    status: "pending"
  }
];

export default function App() {
  // Page routing state
  const [currentPage, setCurrentPage] = useState<"home" | "builder" | "contacts" | "legal">("home");

  // Global state for notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Admin panel open/close state
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Database core states backed by Local Persistency
  const [products, setProducts] = useState<FurnitureItem[]>(() => {
    const local = localStorage.getItem("aspekto_products");
    return local ? JSON.parse(local) : FURNITURE_CATALOG;
  });

  const [materials, setMaterials] = useState<MaterialSample[]>(() => {
    const local = localStorage.getItem("aspekto_materials");
    return local ? JSON.parse(local) : MATERIAL_SAMPLES;
  });

  const [leads, setLeads] = useState<any[]>(() => {
    const local = localStorage.getItem("aspekto_leads");
    return local ? JSON.parse(local) : INITIAL_LEADS;
  });

  // General inquiry modal
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryCategory, setInquiryCategory] = useState<string | undefined>(undefined);

  // Booking modal launcher (triggers scrolling to Excursion section or opens model)
  const [activeMaterial, setActiveMaterial] = useState<MaterialSample | null>(materials[0] || MATERIAL_SAMPLES[0]);

  // Handle active Accordion FAQ index
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Notification triggers helper
  const triggerNotification = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
  };

  // Persistent DB setters
  const handleUpdateProducts = (updatedProds: FurnitureItem[]) => {
    setProducts(updatedProds);
    localStorage.setItem("aspekto_products", JSON.stringify(updatedProds));
  };

  const handleUpdateMaterials = (updatedMats: MaterialSample[]) => {
    setMaterials(updatedMats);
    localStorage.setItem("aspekto_materials", JSON.stringify(updatedMats));
    // Reset selected active swatch if it doesn't exist anymore
    if (activeMaterial && !updatedMats.some(m => m.id === activeMaterial.id)) {
      setActiveMaterial(updatedMats[0] || null);
    }
  };

  const handleUpdateLeads = (updatedLeads: any[]) => {
    setLeads(updatedLeads);
    localStorage.setItem("aspekto_leads", JSON.stringify(updatedLeads));
  };

  const handleAddLead = (newLead: any) => {
    const list = [newLead, ...leads];
    setLeads(list);
    localStorage.setItem("aspekto_leads", JSON.stringify(list));
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Periodically generate simulated client activity to make the page feel alive and high-status
  useEffect(() => {
    const activityMessages = [
      "Дмитрий только что забронировал экскурсию на субботу к Михаилу Гришину.",
      "Оформлена заявка на расчет индивидуальной кухни Nordic Shadow (ЖК 'Пресня').",
      "Юлия заказала доставку образца 'Кавказского Ореха' в г. Одинцово.",
      "Оформлен заказ на обеденный стол размером 2200х1000мм с прозрачной эпоксидной рекой."
    ];

    const interval = setInterval(() => {
      // 15% chance to post a casual activity indicator
      if (Math.random() < 0.25) {
        const randomMsg = activityMessages[Math.floor(Math.random() * activityMessages.length)];
        triggerNotification(randomMsg, "info");
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Helper function to scroll smoothly
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpenGeneralInquiry = (category?: string) => {
    setInquiryCategory(category);
    setInquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col font-sans text-white antialiased selection:bg-[#ff8562] selection:text-white relative">
      
      {/* 1. TOAST NOTIFICATION CONTAINER */}
      {toast && (
        <div 
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none"
          id="toast-notification"
        >
          <div 
            className={`pointer-events-auto p-4 rounded-xs border shadow-lg flex items-start gap-3 transition-all duration-300 translate-y-0 ${
              toast.type === "success" 
                ? "bg-[#181818] border-[#ff8562] text-white" 
                : "bg-[#1c1c1c] border-zinc-700 text-white/95"
            }`}
            style={{
              boxShadow: toast.type === "success" ? "rgba(255, 133, 98, 0.2) 0px 10px 30px" : "rgba(0,0,0,0.5) 0px 10px 25px"
            }}
          >
            <div className="w-5 h-5 rounded-full bg-[#ff8562]/10 border border-[#ff8562]/40 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3 text-[#ff8562]" />
            </div>
            <div className="flex-1 text-xs">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff8562] block mb-0.5">
                {toast.type === "success" ? "Успешное действие" : "Студийная активность"}
              </span>
              <p className="font-sans leading-relaxed text-white/90">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast(null)} 
              className="text-white/40 hover:text-white shrink-0 focus:outline-none"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. HEADER */}
      <Header 
        onOpenBooking={() => handleScrollToSection("benefits")} 
        onOpenInquiry={handleOpenGeneralInquiry}
        onScrollToSection={handleScrollToSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      {currentPage === "home" && (
        <>
          {/* 3. HERO SECTION (Breathtaking Luxury UI with centered elements) */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden border-b border-white/10 py-20">
        
        {/* Full content backdrops */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Minimal Living Room Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 filter brightness-50"
          />
          {/* Subtle vignette gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-neutral-950/20 to-[#121212]/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/40 via-transparent to-[#121212]/40"></div>
          
          {/* Faint ambient radial lights */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff8562] opacity-[0.04] rounded-full filter blur-3xl pointer-events-none"></div>
        </div>

        {/* Hero Content Space (Centered typography) */}
        <div className="max-w-5xl mx-auto px-4 z-10 text-center space-y-8 flex flex-col items-center">
          
          {/* Centered micro tagline badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:py-1.5 border border-white/15 bg-black/60 rounded-full text-[9px] sm:text-[10px] tracking-wider sm:tracking-[0.2em] uppercase text-white/80 font-mono max-w-[95%]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff8562] shrink-0 animate-pulse"></span>
            <span className="text-center leading-normal">
              <span className="inline sm:hidden">Ателье премиум мебели</span>
              <span className="hidden sm:inline">Авторское ателье мебели премиум сегмента</span>
            </span>
          </div>

          {/* Headline Display - Gilroy Centered */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans tracking-normal leading-[1.1] md:leading-[1.15] text-white">
            Чистая эргономика &amp;
            <br className="hidden sm:inline" />
            <span className="font-serif italic text-[#ff8562] font-normal">природная монументальность</span>
          </h1>

          {/* Subheading Centered */}
          <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto font-sans leading-relaxed">
            Проектируем минималистичные кухни, гардеробные системы и обеденные столы из цельного массива дикого дуба и американского ореха. Каждое изделие — бескомпромиссный баланс инженерии и ручного ремесла.
          </p>

          {/* Side by side primary actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full justify-center">
            <button 
              onClick={() => handleScrollToSection("catalog")}
              className="btn-primary w-full sm:w-auto px-8 min-h-[58px] text-base tracking-wide flex items-center justify-center gap-2 "
            >
              <span>Посмотреть каталог</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleScrollToSection("benefits")}
              className="btn-secondary w-full sm:w-auto px-8 min-h-[58px] text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Запись на замер или в цех</span>
            </button>
          </div>

          {/* Scroll indicators below the buttons */}
          <div className="pt-12 cursor-pointer flex flex-col items-center gap-1.5 text-white/30 hover:text-[#ff8562] transition-colors" onClick={() => handleScrollToSection("benefits-strip")}>
            <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Прокрутите вниз для знакомства</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>

        </div>

      </section>

      {/* 4. THREE COLUMN BENEFITS ROW (Feature strip) */}
      <section id="benefits-strip" className="py-16 bg-[#1a1a1a] border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
            
            {/* Benefit Col 1 */}
            <div className="flex items-start gap-4 pt-8 md:pt-0">
              <div className="w-12 h-12 rounded-sm border border-[#ff8562]/30 flex items-center justify-center bg-black/40 shrink-0">
                <Compass className="w-6 h-6 text-[#ff8562]" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white tracking-wide">
                  Индивидуально или по шаблону
                </h4>
                <p className="text-white/50 text-xs font-sans mt-1.5 leading-relaxed">
                  Мы работаем как над сложными индивидуальными эскизами под ключ, так и по готовым модульным шаблонам серийных коллекций, что ускоряет сдачу и снижает стоимость.
                </p>
              </div>
            </div>

            {/* Benefit Col 2 */}
            <div className="flex items-start gap-4 pt-8 md:pt-0 md:pl-8">
              <div className="w-12 h-12 rounded-sm border border-[#ff8562]/30 flex items-center justify-center bg-black/40 shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#ff8562]" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white tracking-wide">
                  Официальная гарантия 10 лет
                </h4>
                <p className="text-white/50 text-xs font-sans mt-1.5 leading-relaxed">
                  Предоставляем гарантию 10 лет на качество всей несущей конструкции шкафов, каркасов кухонь и столы-слэбы с бесплатным выездом нашего мастера.
                </p>
              </div>
            </div>

            {/* Benefit Col 3 */}
            <div className="flex items-start gap-4 pt-8 md:pt-0 md:pl-8">
              <div className="w-12 h-12 rounded-sm border border-[#ff8562]/30 flex items-center justify-center bg-black/40 shrink-0">
                <Trees className="w-6 h-6 text-[#ff8562]" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white tracking-wide">
                  Прочность и плотность дерева
                </h4>
                <p className="text-white/50 text-xs font-sans mt-1.5 leading-relaxed">
                  Используем плотную сибирскую древесину высших сортов и влагостойкий МДФ. Все поверхности защищены от царапин, влаги и температур итальянскими лаками Renner.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE CATALOG & SPEC SHOWCASE */}
      <CatalogGrid 
        onNotify={triggerNotification} 
        onOpenInquiry={handleOpenGeneralInquiry} 
        products={products}
        onAddLead={handleAddLead}
      />

      {/* 6. INTERACTIVE BUILDER CONFIGURATOR LINK */}
      <section className="py-20 bg-[#161616] border-y border-white/5 relative overflow-hidden text-center flex flex-col items-center justify-center">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-3xl mx-auto px-4 space-y-5 relative z-10">
          <span className="text-xs text-[#ff8562] tracking-[0.2em] font-mono uppercase bg-[#ff8562]/10 px-3 py-1 border border-[#ff8562]/20 inline-block">
            ОНЛАЙН CAD-ПРОЕКТИРОВАНИЕ
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
            Интерактивный конструктор <br />
            <span className="font-serif italic text-[#ff8562]">столов, кухонь и шкафов</span>
          </h2>
          <p className="text-white/60 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Выберите сорт сибирского дуба, планировку кухонных модулей или графитовое остекление дверей шкафа-купе. Наша система мгновенно рассчитает смету и сформирует спецификацию.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => {
                setCurrentPage("builder");
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 50);
              }}
              className="btn-primary px-8 min-h-[55px] font-sans text-xs tracking-widest font-semibold uppercase flex items-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-black" />
              <span>Открыть онлайн конструктор</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. PORTFOLIO SHOWCASE: BEFORE vs AFTER SLIDER */}
      <PortfolioSlider />

      {/* 8. PREMIUM WOOD & FABRIC MATERIAL GALLERY */}
      <section id="materials" className="py-24 bg-[#181818] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-16">
            <p className="text-[#ff8562] font-mono text-xs uppercase tracking-[0.25em] mb-3">
              Тактильный слой дизайна
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-normal">
              Библиотека <span className="font-serif italic text-[#ff8562]">наших эко-материалов</span>
            </h2>
            <p className="text-white/50 text-sm mt-3 font-sans max-w-xl">
              Прикоснитесь к качеству до начала производства. Каждая порода проходит строгий ультразвуковой дефектоскоп перед отправкой на фрезеровку.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left swatches picker list (Col-span 5) */}
            <div className="lg:col-span-5 space-y-3">
              {(materials || []).map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => setActiveMaterial(sample)}
                  className={`w-full p-4 border text-left rounded-lg transition-all flex items-center gap-4 focus:outline-none cursor-pointer ${
                    activeMaterial?.id === sample.id
                      ? "border-[#ff8562] bg-[#ff8562]/5"
                      : "border-white/5 bg-black/20 hover:border-white/10"
                  }`}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-zinc-800 border border-white/10 shrink-0">
                    <img
                      src={sample.image}
                      alt={sample.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block font-mono">
                      {sample.category === "wood" && "Ценный массив породы"}
                      {sample.category === "fabric" && "Натуральная обивка"}
                      {sample.category === "metal" && "Декоративный металл"}
                    </span>
                    <span className="font-semibold text-xs text-white truncate block">{sample.name}</span>
                    <span className="text-[10px] text-[#ff8562]/80 font-mono block mt-0.5">{sample.origin}</span>
                  </div>
                  {activeMaterial?.id === sample.id && (
                    <div className="w-2 h-2 rounded-full bg-[#ff8562]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Right expanded micro material inspector (Col-span 7) */}
            <div className="lg:col-span-7 bg-[#1c1c1c] border border-white/10 p-6 md:p-8 rounded-sm relative flex flex-col justify-between overflow-hidden">
              {activeMaterial && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Big picture preview */}
                    <div className="md:col-span-5">
                      <div className="aspect-square w-full rounded-md overflow-hidden border border-white/10">
                        <img
                          src={activeMaterial.image}
                          alt={activeMaterial.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Metadata Specs */}
                    <div className="md:col-span-7 flex flex-col justify-between h-full">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#ff8562] tracking-widest bg-black px-2 py-1 border border-white/5 inline-block rounded-xs">
                          {activeMaterial.category.toUpperCase()} SPECIFICATION
                        </span>
                        
                        <h4 className="text-xl font-serif text-white mt-3 mb-2">
                          {activeMaterial.name}
                        </h4>

                        <p className="text-white/70 text-xs font-sans leading-relaxed mb-4">
                          {activeMaterial.description}
                        </p>
                      </div>

                      {/* Technical specifications rows */}
                      <div className="space-y-2 text-xs font-mono border-t border-white/5 pt-4 bg-black/10 p-3 rounded-xs">
                        <div className="flex justify-between">
                          <span className="text-white/40">Место происхождения:</span>
                          <span className="text-white/95 font-sans">{activeMaterial.origin}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                          <span className="text-white/40">Тип финишной обработки:</span>
                          <span className="text-[#ff8562]">{activeMaterial.finishType}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Order sample button */}
                  <div className="border-t border-white/10 pt-5 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-[11px] text-white/50 font-sans max-w-sm">
                      Вы можете заказать бесплатный выезд дизайнера с коробкой образцов на замер к вашему объекту в любой точке Подмосковья.
                    </span>
                    <button
                      onClick={() => handleOpenGeneralInquiry(`Образец: ${activeMaterial.name}`)}
                      className="px-5 py-3 self-start sm:self-auto bg-white hover:bg-[#ff8562] hover:text-white text-black transition-all rounded-xs text-xs font-serif font-bold uppercase tracking-wider shrink-0 cursor-pointer"
                    >
                      Заказать замер с образцами
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 9. DETAILED BOOKING VISITS CALENDAR */}
      <ExcursionBooking onNotify={triggerNotification} onAddLead={handleAddLead} />

      {/* 10. STUDIO PHILOSOPHY / Moscow Manufacturing process with high-end images */}
      <section className="py-24 bg-[#121212] relative overflow-hidden">
        
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Texts overview */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[#ff8562] font-mono text-xs uppercase tracking-[0.25em] block">
                Стандарты ручной подгонки
              </span>
              <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
                Немецкие станки &amp; <br />
                <span className="font-serif italic text-[#ff8562]">ручная полировка</span> деталей
              </h2>
              <p className="text-white/60 text-sm font-sans leading-relaxed">
                В отличие от фабричного потока мебели массового экспорта, мы уделяем внимание стыковке кромок под углом 45 градусов, используем скрытые доводчики на раздвижных модулях и покрываем невидимые внутренности мебельных полок защитной дубовой ламелью.
              </p>

              {/* Specs parameters lists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-white/5 bg-[#181818] p-4 rounded-xs">
                  <span className="text-lg font-mono text-[#ff8562] font-bold block">1200 м²</span>
                  <span className="text-xs text-white/90 font-sans block mt-1">Площадь собственного цеха в г. Подольск</span>
                </div>
                <div className="border border-white/5 bg-[#181818] p-4 rounded-xs">
                  <span className="text-lg font-mono text-[#ff8562] font-bold">10 лет</span>
                  <span className="text-xs text-white/90 font-sans block mt-1 font-sans">Официальный юридический гарантийный срок</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => handleOpenGeneralInquiry("Консультация с главным инженером")}
                  className="btn-secondary rounded-none text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Запросить прайс-лист фурнитуры</span>
                  <ArrowRight className="w-4 h-4 text-[#ff8562]" />
                </button>
              </div>
            </div>

            {/* Right block: Beautiful mock workspace photos */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden bg-zinc-900 border border-white/15 rounded-md relative group">
                  <img
                    src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=400"
                    alt="Production process block 1"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <span className="absolute bottom-3 left-3 text-[10px] font-mono text-white/80">Окрасочный сектор</span>
                </div>
                <div className="aspect-video overflow-hidden bg-zinc-900 border border-white/15 rounded-md relative group">
                  <img
                    src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400"
                    alt="Production process block 2"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <span className="absolute bottom-3 left-3 text-[10px] font-mono text-white/80">Полировка латуни</span>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="aspect-video overflow-hidden bg-zinc-900 border border-white/15 rounded-md relative group">
                  <img
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400"
                    alt="Production process block 3"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <span className="absolute bottom-3 left-3 text-[10px] font-mono text-white/80">Склад слэбов</span>
                </div>
                <div className="aspect-square overflow-hidden bg-zinc-900 border border-white/15 rounded-md relative group">
                  <img
                    src="https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80&w=400"
                    alt="Production process block 4"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <span className="absolute bottom-3 left-3 text-[10px] font-mono text-white/80">Сборка столешниц</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* 11. MINIMAL FAQs ACCORDION LIST */}
      <section id="faq" className="py-24 bg-[#181818] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-[#ff8562] font-mono text-xs uppercase tracking-[0.25em] mb-3">
              Информационный блок
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-normal font-serif">
              Ответы на <span className="font-serif italic text-[#ff8562]">важные вопросы</span>
            </h2>
            <p className="text-white/50 text-xs font-sans mt-3 max-w-lg mx-auto">
              Разбираем особенности логистики, технические регламенты и порядок оформления беззаботной рассрочки на мебельные наборы АспекТО.
            </p>
          </div>

          {/* Accordion List */}
          <div className="border border-white/10 divide-y divide-white/10 rounded-sm bg-black/20 overflow-hidden">
            {FAQS.map((faq, index) => {
              const isOpen = expandedFaqIndex === index;
              return (
                <div key={index} className="transition-colors duration-300">
                  <button
                    onClick={() => setExpandedFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left text-white hover:text-[#ff8562] flex items-center justify-between focus:outline-none transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-semibold tracking-wide font-serif pr-4 leading-relaxed">
                      {faq.question}
                    </span>
                    <span className={`text-base font-bold transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-[#ff8562]" : "text-white/40"}`}>
                      ▼
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div className="p-5 border-t border-white/5 bg-white/[0.01]">
                      <p className="text-xs text-white/60 font-sans leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 12. MINIMAL LUXURIOUS CALL TO CTA */}
      <section className="py-24 bg-[#121212] flex flex-col items-center justify-center text-center wood-grain-overlay border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <span className="text-xs text-[#ff8562] tracking-[0.25em] font-mono uppercase">
            НАЧНИТЕ СВОЙ ПРОЕКТ С НАМИ
          </span>
          <h2 className="text-3xl md:text-5xl font-light font-sans text-white leading-tight">
            Оставьте замеры или <br />пригласите дизайнера на объект
          </h2>
          <p className="text-white/50 text-xs font-sans max-w-xl mx-auto leading-relaxed">
            Наш замерщик приедет со специальным высокоточным 3D-сканером проемов, снимет кривизну стен и подготовит технический проект под сборку в течение 48 часов.
          </p>
          <div className="pt-4">
            <button
              onClick={() => handleOpenGeneralInquiry("Общий выезд на замер")}
              className="btn-primary px-8 min-h-[55px] font-sans text-sm tracking-widest font-semibold uppercase flex items-center gap-2 "
            >
              <span>Запросить бесплатный замер</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </section>
        </>
      )}

      {currentPage === "builder" && (
        <InteractiveBuilder onNotify={triggerNotification} onAddLead={handleAddLead} />
      )}

      {currentPage === "contacts" && (
        <ContactsPage onNotify={triggerNotification} onAddLead={handleAddLead} />
      )}

      {currentPage === "legal" && (
        <LegalPage />
      )}

      {/* 13. FLOATING UNOBTRUSIVE CHAT / QUICK ACTIONS INDICATORS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5">
        
        {/* Callback fast trigger */}
        <button
          onClick={() => handleOpenGeneralInquiry("Быстрый обратный звонок")}
          className="w-11 h-11 rounded-full bg-white text-black hover:bg-[#ff8562] hover:text-white flex items-center justify-center shadow-lg transition-all border border-white/5 cursor-pointer hover:scale-105"
          title="Заказать обратный звонок"
        >
          <PhoneCall className="w-5 h-5" />
        </button>

        {/* Telegram chat floating bubble */}
        <a
          href="#telegram-external-link"
          onClick={(e) => {
            e.preventDefault();
            triggerNotification("Чат-поддержка Telegram запущена! (Имитация)", "success");
          }}
          className="w-11 h-11 rounded-full bg-[#181818] text-[#ff8562] hover:bg-[#ff8562] hover:text-white flex items-center justify-center shadow-lg transition-all border border-white/10 cursor-pointer hover:scale-105"
          title="Написать в Telegram мессенджер"
        >
          <MessageSquare className="w-5 h-5" />
        </a>
      </div>

      {/* 14. LEAD CAPTURE GENERAL MODAL DIALOG POPUP */}
      <LeadInquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        preFilledCategory={inquiryCategory}
        onNotify={triggerNotification}
        onAddLead={handleAddLead}
      />

      {/* 15. MODULAR FOOTER */}
      <Footer onScrollToSection={handleScrollToSection} onOpenAdmin={() => setIsAdminOpen(true)} onNavigate={setCurrentPage} />

      {/* 16. MODAL SYSTEM OVERLAY: ADMIN PANEL */}
      {isAdminOpen && (
        <AdminPanel
          products={products}
          onUpdateProducts={handleUpdateProducts}
          materials={materials}
          onUpdateMaterials={handleUpdateMaterials}
          leads={leads}
          onUpdateLeads={handleUpdateLeads}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

    </div>
  );
}
