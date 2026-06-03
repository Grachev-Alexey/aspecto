import React, { useState, useEffect } from "react";
import { ArrowRight, SlidersHorizontal, X } from "lucide-react";
import SiteLayout from "../components/SiteLayout";
import { FurnitureItem, Category } from "../types";

interface CatalogPageProps {
  onOpenInquiry?: (category?: string) => void;
}

export default function CatalogPage({ onOpenInquiry }: CatalogPageProps) {
  const [products, setProducts] = useState<FurnitureItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<FurnitureItem | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/products").then(r => r.json()),
      fetch("/api/categories?type=product").then(r => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
    }).finally(() => setLoading(false));
  }, []);

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : id;
  };

  const filtered = activeCategory === "all"
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <SiteLayout>
      <div className="bg-[#0e0e0e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

          {/* Title */}
          <div className="mb-10">
            <p className="text-[#ff8562] font-mono text-xs uppercase tracking-[0.25em] mb-2">Мебель на заказ</p>
            <h1 className="text-3xl sm:text-5xl font-serif font-medium text-white tracking-tight">
              Каталог мебели <span className="font-serif italic text-[#ff8562]">Аспекто</span>
            </h1>
            <p className="text-white/50 text-sm mt-3 max-w-xl font-sans">
              Изготавливаем по индивидуальным проектам — каждое изделие создаётся под размеры и пожелания конкретного заказчика.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <div className="flex items-center gap-1.5 mr-2 text-white/40">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-xs font-mono uppercase tracking-wider">Фильтр:</span>
            </div>
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-1.5 text-xs rounded-full border transition-all font-mono cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#ff8562] border-[#ff8562] text-white"
                  : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              Все ({products.length})
            </button>
            {categories.map(cat => {
              const count = products.filter(p => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 text-xs rounded-full border transition-all font-mono cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-[#ff8562] border-[#ff8562] text-white"
                      : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Product grid */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <span className="w-8 h-8 border-2 border-[#ff8562]/30 border-t-[#ff8562] rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32 text-white/30">
              <p className="text-lg font-serif">Товары не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(product => (
                <article
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-[#181818] border border-white/10 hover:border-[#ff8562]/30 rounded-lg overflow-hidden cursor-pointer transition-all duration-300"
                >
                  <div className="relative h-52 overflow-hidden bg-zinc-900">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/70 backdrop-blur-sm text-white/70 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                        {getCategoryName(product.category)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="font-serif text-white text-base font-medium leading-snug group-hover:text-[#ff8562] transition-colors">
                      {product.title}
                    </h2>
                    <p className="text-white/50 text-xs mt-2 line-clamp-2 font-sans leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[#ff8562] font-mono text-sm font-semibold">{product.priceEstimate}</span>
                      <span className="text-white/30 text-xs font-mono">{product.specs?.leadTime || ""}</span>
                    </div>
                    {product.materials?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {product.materials.slice(0, 3).map((mat, i) => (
                          <span key={i} className="text-[9px] font-mono text-white/40 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                            {mat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 bg-[#181818] border border-white/10 rounded-lg p-8 text-center">
            <p className="text-[#ff8562] text-xs font-mono uppercase tracking-widest mb-3">Не нашли нужное?</p>
            <h3 className="text-2xl font-serif text-white font-medium mb-3">Изготовим по вашему проекту</h3>
            <p className="text-white/50 text-sm max-w-md mx-auto mb-6 font-sans">
              Каждое изделие создаётся под ваши размеры. Приезжайте на производство или закажите выезд замерщика бесплатно.
            </p>
            <button
              onClick={() => onOpenInquiry?.()}
              className="px-8 py-3 bg-[#ff8562] hover:bg-white hover:text-black text-white font-serif font-semibold rounded-sm transition-all text-sm cursor-pointer"
            >
              Оставить заявку на расчёт
            </button>
          </div>

        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-[#181818] border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-lg">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="bg-black/70 text-white/70 text-[10px] font-mono uppercase px-2.5 py-1 rounded border border-white/10">
                  {getCategoryName(selectedProduct.category)}
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-serif text-xl text-white font-medium">{selectedProduct.title}</h2>
                <span className="text-[#ff8562] font-mono font-bold shrink-0">{selectedProduct.priceEstimate}</span>
              </div>
              <p className="text-white/60 text-sm font-sans leading-relaxed">{selectedProduct.description}</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {selectedProduct.dimensions && (
                  <div className="bg-black/30 border border-white/5 rounded p-3">
                    <p className="text-white/30 font-mono uppercase tracking-wider mb-1">Габариты</p>
                    <p className="text-white/80">{selectedProduct.dimensions}</p>
                  </div>
                )}
                {selectedProduct.specs?.leadTime && (
                  <div className="bg-black/30 border border-white/5 rounded p-3">
                    <p className="text-white/30 font-mono uppercase tracking-wider mb-1">Срок</p>
                    <p className="text-white/80">{selectedProduct.specs.leadTime}</p>
                  </div>
                )}
                {selectedProduct.specs?.facade && (
                  <div className="bg-black/30 border border-white/5 rounded p-3">
                    <p className="text-white/30 font-mono uppercase tracking-wider mb-1">Фасад</p>
                    <p className="text-white/80">{selectedProduct.specs.facade}</p>
                  </div>
                )}
                {selectedProduct.specs?.hardware && (
                  <div className="bg-black/30 border border-white/5 rounded p-3">
                    <p className="text-white/30 font-mono uppercase tracking-wider mb-1">Фурнитура</p>
                    <p className="text-white/80">{selectedProduct.specs.hardware}</p>
                  </div>
                )}
              </div>
              {selectedProduct.materials?.length > 0 && (
                <div>
                  <p className="text-white/30 text-xs font-mono uppercase tracking-wider mb-2">Материалы</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.materials.map((mat, i) => (
                      <span key={i} className="text-xs font-mono text-[#ff8562] bg-[#ff8562]/10 border border-[#ff8562]/20 px-2.5 py-1 rounded">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => { setSelectedProduct(null); onOpenInquiry?.(selectedProduct.title); }}
                className="w-full py-3 bg-[#ff8562] hover:bg-white hover:text-black text-white font-serif font-semibold text-sm rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Запросить расчёт по этому изделию</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
