import React, { useState } from "react";
import { Phone, MapPin, Instagram, MessageSquare, ArrowUpRight, Hammer } from "lucide-react";

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenInquiry: (category?: string) => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenAdmin?: () => void;
  currentPage: "home" | "builder" | "contacts" | "legal";
  onNavigate: (page: "home" | "builder" | "contacts" | "legal") => void;
}

export default function Header({ 
  onOpenBooking, 
  onOpenInquiry, 
  onScrollToSection, 
  onOpenAdmin,
  currentPage,
  onNavigate
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#121212]/95 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
      {/* Top Utility Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between border-b border-white/5 text-xs text-white/60">
        {/* Left: Social Media Icons & Admin toggle */}
        <div className="flex items-center gap-4">
          <a
            href="#instagram"
            className="hover:text-[#ff8562] transition-colors flex items-center gap-1"
            title="Instagram"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">aspekto.ru</span>
          </a>
          <a
            href="#telegram"
            className="hover:text-[#ff8562] transition-colors flex items-center gap-1"
            title="Telegram"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">aspekto_mebel</span>
          </a>

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="hover:text-white hover:border-white/30 text-[#ff8562] transition-all flex items-center gap-1.5 border border-[#ff8562]/30 rounded px-2 py-0.5 bg-[#ff8562]/5 cursor-pointer text-[10px] font-mono"
              title="Панель администратора"
            >
              <Hammer className="w-3 h-3 animate-pulse" />
              <span className="hidden sm:inline">Панель управления</span>
              <span className="sm:hidden">Админ</span>
            </button>
          )}
        </div>

        {/* Center: Small tagline or current status */}
        <div className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#ff8562]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff8562] animate-pulse"></span>
          Собственное производство в г. Подольск • Гарантия 10 лет
        </div>

        {/* Right: City and Phone */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-1.5 ">
            <MapPin className="w-3.5 h-3.5 text-[#ff8562]" />
            <span>Цех: г. Подольск, ул. Производственная, 29</span>
          </div>
          <a
            href="tel:+79189157879"
            className="font-medium hover:text-white transition-colors flex items-center gap-1.5 text-white/90"
          >
            <Phone className="w-3.5 h-3.5 text-[#ff8562]" />
            <span>8 (918) 915-78-79</span>
          </a>
        </div>
      </div>

      {/* Main Luxury Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left Elements: Hamburger for small screens, or spacer */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white/80 hover:text-[#ff8562] focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>

        {/* Logo / Brand Centered (Using premium elegant type pairings) */}
        <div
          className="flex-1 lg:flex-none flex justify-center lg:justify-start cursor-pointer"
          onClick={() => {
            onNavigate("home");
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }, 50);
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#ff8562] flex items-center justify-center rounded-sm bg-[#181818]">
              <Hammer className="w-5 h-5 text-[#ff8562]" />
            </div>
            <div>
              <span className="font-serif text-2xl tracking-[0.1em] text-white font-bold uppercase">
                АСПЕКТО
              </span>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 -mt-1 font-sans">
                Авторская мебель на заказ
              </p>
            </div>
          </div>
        </div>

        {/* Center Navigation Links (Evenly spaced links) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm text-white/70 font-sans">
          <button
            onClick={() => {
              onNavigate("home");
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }, 50);
            }}
            className={`hover:text-white transition-all cursor-pointer ${
              currentPage === "home" ? "text-[#ff8562] font-semibold" : ""
            }`}
          >
            Главная
          </button>
          <button
            onClick={() => {
              if (currentPage !== "home") {
                onNavigate("home");
                setTimeout(() => onScrollToSection("catalog"), 100);
              } else {
                onScrollToSection("catalog");
              }
            }}
            className="hover:text-white transition-all cursor-pointer"
          >
            Каталог
          </button>
          <button
            onClick={() => onNavigate("builder")}
            className={`hover:text-white transition-all cursor-pointer ${
              currentPage === "builder" ? "text-[#ff8562] font-semibold" : ""
            }`}
          >
            Конструктор мебели
          </button>
          <button
            onClick={() => {
              if (currentPage !== "home") {
                onNavigate("home");
                setTimeout(() => onScrollToSection("portfolio"), 100);
              } else {
                onScrollToSection("portfolio");
              }
            }}
            className="hover:text-white transition-all cursor-pointer"
          >
            Портфолио
          </button>
          <button
            onClick={() => onNavigate("contacts")}
            className={`hover:text-white transition-all cursor-pointer ${
              currentPage === "contacts" ? "text-[#ff8562] font-semibold" : ""
            }`}
          >
            Контакты
          </button>
          <button
            onClick={() => onNavigate("legal")}
            className={`hover:text-white transition-all cursor-pointer ${
              currentPage === "legal" ? "text-[#ff8562] font-semibold" : ""
            }`}
          >
            Реквизиты
          </button>
        </nav>

        {/* Right Conversion Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="hidden sm:inline-flex px-4 py-2 text-xs font-sans tracking-wide border border-white/25 hover:border-[#ff8562] text-white hover:text-[#ff8562] rounded-none transition-all cursor-pointer"
          >
            Запись на экскурсию
          </button>
          <button
            onClick={() => onOpenInquiry()}
            className="hidden sm:inline-flex px-4 py-2 text-xs font-serif bg-white text-black hover:bg-[#ff8562] hover:text-white font-medium rounded-sm transition-all shadow-none cursor-pointer items-center gap-1"
          >
            <span>Оставить заявку</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          {/* Mobile-only spacer to balance the left hamburger icon and center the logo perfectly */}
          <div className="w-10 h-10 lg:hidden pointer-events-none" />
        </div>
      </div>

      {/* Mobile Sliding Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#181818] border-b border-white/10 px-4 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm font-sans text-white/80">
            <button
              onClick={() => {
                onNavigate("home");
                setMobileMenuOpen(false);
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 50);
              }}
              className="text-left hover:text-[#ff8562] transition-colors border-b border-white/5 py-3 focus:outline-none"
            >
              Главная
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentPage !== "home") {
                  onNavigate("home");
                  setTimeout(() => onScrollToSection("catalog"), 150);
                } else {
                  onScrollToSection("catalog");
                }
              }}
              className="text-left hover:text-[#ff8562] transition-colors border-b border-white/5 py-3 focus:outline-none"
            >
              Каталог
            </button>
            <button
              onClick={() => {
                onNavigate("builder");
                setMobileMenuOpen(false);
              }}
              className="text-left hover:text-[#ff8562] transition-colors border-b border-white/5 py-3 focus:outline-none"
            >
              Конструктор
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentPage !== "home") {
                  onNavigate("home");
                  setTimeout(() => onScrollToSection("portfolio"), 150);
                } else {
                  onScrollToSection("portfolio");
                }
              }}
              className="text-left hover:text-[#ff8562] transition-colors border-b border-white/5 py-3 focus:outline-none"
            >
              Портфолио
            </button>
            <button
              onClick={() => {
                onNavigate("contacts");
                setMobileMenuOpen(false);
              }}
              className="text-left hover:text-[#ff8562] transition-colors border-b border-white/5 py-3 focus:outline-none"
            >
              Контакты
            </button>
            <button
              onClick={() => {
                onNavigate("legal");
                setMobileMenuOpen(false);
              }}
              className="text-left hover:text-[#ff8562] transition-colors border-b border-white/5 py-3 focus:outline-none"
            >
              Реквизиты
            </button>
          </div>
          <div className="pt-4 flex flex-col gap-2.5 border-t border-white/5">
            <button
              onClick={() => {
                onOpenInquiry();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 text-center text-xs bg-white text-black font-semibold hover:bg-[#ff8562] hover:text-white transition-colors"
            >
              Оставить заявку на расчет
            </button>
            <button
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 text-center text-xs border border-white/20 text-white rounded-none hover:border-[#ff8562] hover:text-[#ff8562] transition-colors"
            >
              Запись на экскурсию в цех
            </button>
            <div className="flex items-center justify-between text-xs text-white/50 px-1 pt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#ff8562]" /> Москва
              </span>
              <a href="tel:+79189157879" className="text-white font-medium hover:text-[#ff8562]">
                8 (918) 915-78-79
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
