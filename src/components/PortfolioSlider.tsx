import React, { useState } from "react";
import { PORTFOLIO_PROJECTS } from "../data";
import { Hammer, Trees, Clock, Layers, Sparkles, ChevronRight, Check } from "lucide-react";

export default function PortfolioSlider() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [showFinished, setShowFinished] = useState(true);

  const currentProject = PORTFOLIO_PROJECTS[activeProjectIndex];

  return (
    <section id="portfolio" className="py-24 bg-[#121212] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[#ff8562] font-mono text-xs uppercase tracking-[0.25em] mb-3">
              Реализованные проекты
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-normal">
              Архив <span className="font-serif italic text-[#ff8562]">наших работ</span> премиум класса
            </h2>
            <p className="text-white/50 text-sm mt-3 font-sans">
              Посмотрите сравнительное преображение объектов: от пустой бетонной заготовки новостройки до готовой дизайнерской меблировки с установленной бытовой техникой.
            </p>
          </div>
          
          {/* Quick tab switcher for projects list */}
          <div className="flex justify-center lg:justify-start gap-2 overflow-x-auto scrollbar-none py-1">
            {PORTFOLIO_PROJECTS.map((project, idx) => (
              <button
                key={project.id}
                onClick={() => {
                  setActiveProjectIndex(idx);
                  setShowFinished(true);
                }}
                className={`px-4 py-2 text-xs font-sans tracking-wide rounded-none transition-all cursor-pointer whitespace-nowrap ${
                  idx === activeProjectIndex
                    ? "bg-white text-black font-semibold"
                    : "bg-[#181818] border border-white/10 text-white/60 hover:text-white"
                }`}
              >
                {project.title}
              </button>
            ))}
          </div>
        </div>

        {/* Major Showcase Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Visual Interactive Before/After Frame (Interactive State Swap) */}
          <div className="lg:col-span-7 bg-[#1c1c1c] border border-white/10 p-3 rounded-none relative flex flex-col justify-between overflow-hidden min-h-[380px] lg:min-h-[460px]">
            
            {/* Top labels */}
            <div className="absolute sm:top-6 sm:left-6 top-3 left-3 z-20 flex flex-wrap gap-1.5 max-w-[85%]">
              <button
                onClick={() => setShowFinished(false)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase transition-all rounded-xs focus:outline-none cursor-pointer ${
                  !showFinished
                    ? "bg-[#ff8562] text-white font-bold"
                    : "bg-black/80 text-white/60 border border-white/10 hover:text-white"
                }`}
              >
                Черновой объект
              </button>
              <button
                onClick={() => setShowFinished(true)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase transition-all rounded-xs focus:outline-none cursor-pointer ${
                  showFinished
                    ? "bg-white text-black font-bold"
                    : "bg-black/80 text-white/60 border border-white/10 hover:text-white"
                }`}
              >
                Результат меблировки
              </button>
            </div>

            {/* Bottom active state comparison cue */}
            <div className="absolute sm:bottom-6 sm:left-6 bottom-3 left-3 z-20 bg-black/75 backdrop-blur-xs px-2.5 py-1.5 sm:px-3 sm:py-2 text-[8px] sm:text-[10px] font-mono text-white/80 rounded-xs border border-white/10 max-w-[80%] truncate">
              Показ: <span className="text-[#ff8562] font-semibold">{showFinished ? "ГОТОВАЯ СТУДИЙНАЯ МЕБЕЛЬ" : "БЕТОННЫЙ СКАФОЛД"}</span>
            </div>

            {/* Simulated interactive Slider bar guide lines */}
            <div className="absolute top-1/2 -translate-y-1/2 sm:right-6 right-2.5 z-20 flex flex-col items-center gap-1">
              <div className="w-[1px] h-12 bg-white/30"></div>
              <button
                onClick={() => setShowFinished(!showFinished)}
                className="w-8 h-8 rounded-full border border-white/20 bg-black text-white hover:border-[#ff8562] hover:text-[#ff8562] flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                title="Переключить режим ДО/ПОСЛЕ"
              >
                ⇄
              </button>
              <div className="w-[1px] h-12 bg-white/30"></div>
            </div>

            {/* Main Picture Frame */}
            <div className="flex-1 w-full h-full overflow-hidden bg-black relative rounded-xs aspect-video">
              <img
                src={showFinished ? currentProject.imageAfter : currentProject.imageBefore}
                alt={currentProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
            </div>

          </div>

          {/* RIGHT: Technical Project Report Card & Client Info */}
          <div className="lg:col-span-5 bg-[#181818] border border-white/10 p-6 md:p-8 flex flex-col justify-between rounded-sm">
            
            <div>
              <span className="text-xs font-mono text-[#ff8562] uppercase tracking-widest block">
                Дело №0{activeProjectIndex + 1} • Сдача под ключ
              </span>
              <h3 className="text-2xl font-serif text-white mt-1.5 mb-4">
                {currentProject.title}
              </h3>
              
              <p className="text-white/70 text-xs font-sans leading-relaxed mb-6">
                {currentProject.description}
              </p>

              {/* Specs parameters */}
              <div className="space-y-4 border-t border-white/5 pt-5 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/25 p-3 rounded-xs border border-white/5">
                    <span className="block text-[9px] text-[#ff8562] uppercase tracking-wider font-mono">Адрес объекта</span>
                    <span className="text-xs font-sans text-white/95 mt-1 block truncate" title={currentProject.location}>
                      {currentProject.location}
                    </span>
                  </div>
                  <div className="bg-black/25 p-3 rounded-xs border border-white/5">
                    <span className="block text-[9px] text-[#ff8562] uppercase tracking-wider font-mono">Параметры площади</span>
                    <span className="text-xs font-mono text-white/95 mt-0.5 block font-bold">
                      {currentProject.area}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/25 p-3 rounded-xs border border-white/5">
                    <span className="block text-[9px] text-white/40 uppercase tracking-wider font-mono">Срок изготовления</span>
                    <span className="text-xs font-sans text-white/95 mt-1 block flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#ff8562]" />
                      <strong>{currentProject.duration}</strong>
                    </span>
                  </div>
                  <div className="bg-black/25 p-3 rounded-xs border border-white/5">
                    <span className="block text-[9px] text-white/40 uppercase tracking-wider font-mono">Фактурный слой</span>
                    <span className="text-xs font-sans text-white/95 mt-1 block flex items-center gap-1.5">
                      <Trees className="w-3.5 h-3.5 text-[#ff8562]" />
                      <span>Ценные породы</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Core materials badge lists */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono text-white/40 block">Использованные материалы:</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentProject.materialsUsed.map((material, index) => (
                    <span
                      key={index}
                      className="text-[11px] font-sans bg-white/5 border border-white/10 text-white/90 px-2.5 py-1 rounded-none hover:border-[#ff8562]"
                    >
                      # {material}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Next projects preview indicators */}
            <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-white/40 font-mono">
                Всего сдано проектов в Москве: <strong className="text-white">142</strong>
              </span>
              <button
                onClick={() => {
                  setActiveProjectIndex((activeProjectIndex + 1) % PORTFOLIO_PROJECTS.length);
                  setShowFinished(true);
                }}
                className="text-xs font-sans text-[#ff8562] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Следующий проект</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
