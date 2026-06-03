import React from "react";
import { Phone, MapPin, Mail, Clock, Hammer, ExternalLink } from "lucide-react";

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  onNavigate: (page: "home" | "builder" | "contacts" | "legal") => void;
}

export default function Footer({ onScrollToSection, onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b0b0b] border-t border-white/10 text-white/50 text-xs">
      
      {/* Upper footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Col 1: Brand details */}
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 border border-[#ff8562] flex items-center justify-center bg-[#121212]">
              <Hammer className="w-4 h-4 text-[#ff8562]" />
            </div>
            <div>
              <span className="font-serif text-lg tracking-[0.05em] text-white font-bold">
                АСПЕКТО
              </span>
            </div>
          </div>
          <p className="font-sans leading-relaxed text-white/40 pr-4">
            Проектирование и собственное производство корпусной мебели любой сложности и эксклюзивных столов по индивидуальным размерам с гарантией 10 лет.
          </p>
          <div className="mt-6 text-[10px] uppercase tracking-wider text-[#ff8562] font-mono">
            <span>© 2012–{currentYear} Аспекто</span>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5 font-mono">
            Навигация
          </h4>
          <ul className="space-y-3 font-sans text-white/70">
            <li>
              <button
                onClick={() => {
                  onNavigate("home");
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }, 50);
                }}
                className="hover:text-[#ff8562] transition-colors cursor-pointer text-left focus:outline-none"
              >
                Главная страница
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onNavigate("home");
                  setTimeout(() => onScrollToSection("catalog"), 100);
                }}
                className="hover:text-[#ff8562] transition-colors cursor-pointer text-left focus:outline-none"
              >
                Каталог продукции
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("builder")}
                className="hover:text-[#ff8562] transition-colors cursor-pointer text-left focus:outline-none"
              >
                CAD Конструктор мебели
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("contacts")}
                className="hover:text-[#ff8562] transition-colors cursor-pointer text-left focus:outline-none"
              >
                Наши Контакты и Офис
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("legal")}
                className="hover:text-[#ff8562] transition-colors cursor-pointer text-left focus:outline-none"
              >
                Юридические Реквизиты
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Coordinates */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5 font-mono">
            Контакты
          </h4>
          <ul className="space-y-3 text-white/70">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#ff8562] shrink-0 mt-0.5" />
              <span>Офис (для писем): г. Москва, ул. Космонавтов, д. 12А • Производство: г. Подольск, ул. Производственная, 29 (визиты по записи)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#ff8562] shrink-0" />
              <a href="tel:+79189157879" className="hover:text-white transition-colors">
                8 (918) 915-78-79
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#ff8562] shrink-0" />
              <a href="mailto:info@aspekto.ru" className="hover:text-white transition-colors">
                info@aspekto.ru
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Time of work */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-5 font-mono">
            Режим работы
          </h4>
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xs space-y-2 text-white/60">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#ff8562] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Будни:</p>
                <p>10:00 — 20:00</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 border-t border-white/5 pt-2 mt-2">
              <Clock className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
              <div>
                <p className="text-white/80">Суббота, Воскресенье:</p>
                <p>11:00 — 18:00 (Только по записи)</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Extreme Bottom Row */}
      <div className="border-t border-white/5 bg-black py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-white/40 font-mono">
          <div className="leading-relaxed">
            <span>ИП ЛЕВКИНА ЛЮДМИЛА АРСЕНТЬЕВНА • ИНН 500601550891 • ОГРН 325508100034456 • р/с 40802810800007761435 в АО «ТБанк» • БИК 044525974 • к/с 30101810145250000974</span>
          </div>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <span>•</span>
            <a href="#offer" className="hover:text-white transition-colors flex items-center gap-0.5">
              <span>Публичная оферта</span>
              <ExternalLink className="w-2.5 h-2.5 text-[#ff8562]" />
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}
