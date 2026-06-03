import React, { useState } from "react";
import { FURNITURE_CATALOG } from "../data";
import { FurnitureItem } from "../types";
import { Info, X, Sliders, Check, Phone, ArrowUpRight, Award, Ruler } from "lucide-react";

interface CatalogGridProps {
  onNotify: (message: string, type: "success" | "info") => void;
  onOpenInquiry: (category?: string) => void;
  products: FurnitureItem[];
  onAddLead?: (lead: any) => void;
}

export default function CatalogGrid({ onNotify, onOpenInquiry, products, onAddLead }: CatalogGridProps) {
  const [activeTab, setActiveTab] = useState<"all" | "kitchen" | "living" | "wardrobe" | "premium">("all");
  const [selectedProduct, setSelectedProduct] = useState<FurnitureItem | null>(null);

  // Modal fast inquiry form states
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [modalInquirySubmitted, setModalInquirySubmitted] = useState(false);

  // Filter products based on selected catalog category
  const filteredProducts = (products || []).filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  const handleModalInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) {
      onNotify("Пожалуйста, заполните основные поля телефона и имени.", "info");
      return;
    }

    setModalInquirySubmitted(true);
    setTimeout(() => {
      onNotify(
        `Запрос на расчет модели "${selectedProduct?.title}" отправлен! Мы сделаем чертеж и перезвоним по номеру ${inquiryPhone} в ближайшее время.`,
        "success"
      );

      // Save lead to database
      if (onAddLead && selectedProduct) {
        onAddLead({
          id: `lead-${Date.now()}`,
          name: inquiryName.trim(),
          phone: inquiryPhone.trim(),
          category: `Расчет "${selectedProduct.title}"`,
          comments: `Потребитель запросил детальный сметный расчет модели "${selectedProduct.title}". Потребуются размеры: ${selectedProduct.dimensions}.`,
          createdAt: new Date().toLocaleString("ru-RU", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }),
          status: "pending"
        });
      }

      setInquiryName("");
      setInquiryPhone("");
      setModalInquirySubmitted(false);
      setSelectedProduct(null); // Close modal
    }, 1200);
  };

  return (
    <section id="catalog" className="py-24 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="text-[#ff8562] font-mono text-xs uppercase tracking-[0.25em] mb-3">
              Студийный Каталог
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight">
              Индивидуальные <span className="font-serif italic text-[#ff8562]">коллекции</span> мебели
            </h2>
            <p className="text-white/50 text-sm mt-3 font-sans">
              Каждое изделие адаптируется под размеры вашего помещения. Сборка осуществляется на собственном производстве, а изделия оснащаются надежной австрийской и немецкой фурнитурой.
            </p>
          </div>
          
          {/* Quick catalog request call */}
          <button
            onClick={() => onOpenInquiry("Общий каталог")}
            className="btn-secondary text-xs rounded-none h-12 uppercase tracking-wider flex items-center gap-1.5 self-start md:self-auto "
          >
            <span>Скачать PDF каталог</span>
            <ArrowUpRight className="w-4 h-4 text-[#ff8562]" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 pb-5 mb-10 overflow-x-auto scrollbar-none">
          {[
            { id: "all", label: "Все изделия" },
            { id: "kitchen", label: "Кухни" },
            { id: "living", label: "Гостиные" },
            { id: "wardrobe", label: "Гардеробные" },
            { id: "premium", label: "Премиум блоки" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 text-xs font-sans tracking-wide rounded-none border transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#ff8562] text-white border-[#ff8562] font-medium"
                  : "bg-black/10 text-white/60 border-white/5 hover:border-white/10 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-[#181818] border border-white/10 rounded-lg p-4 flex flex-col justify-between transition-all duration-300 hover:border-white/20 select-none"
              style={{ boxShadow: "none" }}
            >
              <div>
                {/* Visual block */}
                <div className="relative aspect-video w-full overflow-hidden mb-5 bg-[#121212] rounded-sm">
                  <img
                    src={product.image}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-xs px-2.5 py-1 text-[9px] uppercase tracking-wider text-white font-mono rounded-xs border border-white/10">
                    {product.category === "kitchen" && "Кухня"}
                    {product.category === "living" && "Гостиная"}
                    {product.category === "wardrobe" && "Гардеробная"}
                    {product.category === "premium" && "Премиум блок"}
                  </div>
                </div>

                {/* Info Text */}
                <span className="text-[10px] uppercase tracking-widest text-[#ff8562] font-mono block mb-1">
                  Ателье Аспекто
                </span>
                <h3 className="text-xl font-medium tracking-tight text-white mb-2 leading-tight">
                  {product.title}
                </h3>
                <p className="text-white/60 text-xs font-sans line-clamp-3 leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* Short core traits checklist */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {product.materials.slice(0, 2).map((material, idx) => (
                    <span
                      key={idx}
                      className="bg-black/20 border border-white/5 text-[9px] text-white/50 px-2 py-0.5 rounded-xs"
                    >
                      • {material}
                    </span>
                  ))}
                  <span className="bg-black/20 border border-white/5 text-[9px] text-white/50 px-2 py-0.5 rounded-xs">
                    📐 {product.dimensions.split("x")[0].trim()}...
                  </span>
                </div>
              </div>

              {/* Lower Actions Block */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[9px] text-white/40 block font-mono">ОЦЕНКА СТОИМОСТИ</span>
                  <span className="text-base font-semibold text-white font-mono block">
                    {product.priceEstimate}
                  </span>
                </div>
                
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="px-3.5 py-2 text-[11px] font-sans bg-white/5 border border-white/15 text-white hover:bg-white hover:text-black transition-all rounded-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Подробнее</span>
                  <Info className="w-3.5 h-3.5 text-[#ff8562]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Detail Modal Panel */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
            <div className="bg-[#181818] border border-white/10 w-full max-w-3xl rounded-none p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
              {/* Close corner */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Two Column details inside modal */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mt-2">
                
                {/* 1. Large Image and basic metadata in left col */}
                <div className="md:col-span-5 space-y-4">
                  <div className="aspect-video w-full overflow-hidden bg-black border border-white/5 rounded-xs">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Visual checklist */}
                  <div className="bg-black/20 p-4 border border-white/5 space-y-2.5 rounded-xs">
                    <div className="flex items-start gap-2.5 text-xs text-white/70">
                      <Award className="w-4 h-4 text-[#ff8562] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-white">Прочность и долговечность</span>
                        Качественная влагостойкая кромка и надежная защита торцов деталей.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-white/70 border-t border-white/5 pt-2.5">
                      <Ruler className="w-4 h-4 text-[#ff8562] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-white">Под ваши размеры</span>
                        Вырез кабельных каналов и технологических зазоров.
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Specs details and fast submission form on right */}
                <div className="md:col-span-7 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#ff8562] font-mono block">
                      Коллекционное издание • {selectedProduct.category.toUpperCase()}
                    </span>
                    <h3 className="text-2xl font-serif text-white mt-1 mb-3">
                      {selectedProduct.title}
                    </h3>
                    <p className="text-white/70 text-xs font-sans leading-relaxed mb-5">
                      {selectedProduct.description}
                    </p>

                    {/* Detailed Specifications table */}
                    <div className="space-y-2 mb-6">
                      <h4 className="text-xs uppercase tracking-wider text-white/40 font-mono mb-2">
                        Техническая ведомость комплектации
                      </h4>
                      <div className="border border-white/10 text-xs text-white/80 font-mono divide-y divide-white/5 rounded-xs bg-black/10">
                        <div className="p-2.5 flex justify-between">
                          <span className="text-white/40">Размеры (ШxВxГ):</span>
                          <span>{selectedProduct.dimensions}</span>
                        </div>
                        {selectedProduct.specs.hardware && (
                          <div className="p-2.5 flex justify-between">
                            <span className="text-white/40">Фурнитура:</span>
                            <span>{selectedProduct.specs.hardware}</span>
                          </div>
                        )}
                        {selectedProduct.specs.facade && (
                          <div className="p-2.5 flex justify-between">
                            <span className="text-white/40">Отделка фасадов:</span>
                            <span>{selectedProduct.specs.facade}</span>
                          </div>
                        )}
                        {selectedProduct.specs.countertop && selectedProduct.specs.countertop !== "Нет" && (
                          <div className="p-2.5 flex justify-between">
                            <span className="text-white/40">Столешница / Полки:</span>
                            <span>{selectedProduct.specs.countertop}</span>
                          </div>
                        )}
                        <div className="p-2.5 flex justify-between">
                          <span className="text-white/40">Срок сборки в цеху:</span>
                          <span className="text-[#ff8562] font-bold">{selectedProduct.specs.leadTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and request quote */}
                  <div className="border-t border-white/10 pt-5 mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[10px] text-white/40 font-mono block">Базовая цена под ключ</span>
                        <span className="text-xl font-bold font-mono text-white">
                          {selectedProduct.priceEstimate}
                        </span>
                      </div>
                      <div className="text-right text-[11px] text-white/50">
                        Гарантия: <span className="text-white font-medium">10 лет</span>
                      </div>
                    </div>

                    {/* Fast fast form inside popup */}
                    <form onSubmit={handleModalInquirySubmit} className="bg-black/30 p-3.5 border border-white/5 space-y-2.5 rounded-xs">
                      <span className="block text-[11px] text-white/80 font-semibold font-serif">
                        Заказать точный расчет под размеры помещения:
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Имя"
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          className="bg-[#121212] border border-white/10 text-white p-2.5 text-xs focus:ring-1 focus:ring-[#ff8562] focus:border-[#ff8562] focus:outline-none rounded-xs flex-1"
                        />
                        <input
                          type="tel"
                          placeholder="Ваш телефон"
                          required
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          className="bg-[#121212] border border-white/10 text-white p-2.5 text-xs focus:ring-1 focus:ring-[#ff8562] focus:border-[#ff8562] focus:outline-none rounded-xs flex-1 font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={modalInquirySubmitted}
                        className="w-full text-center py-2.5 text-xs font-serif bg-[#ff8562] text-white hover:bg-white hover:text-black transition-all uppercase tracking-wide font-medium rounded-xs cursor-pointer flex items-center justify-center"
                      >
                        {modalInquirySubmitted ? "Отправка..." : "Отправить запрос технологу"}
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
