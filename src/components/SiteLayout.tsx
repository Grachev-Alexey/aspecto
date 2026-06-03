import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import LeadInquiryModal from "./LeadInquiryModal";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryCategory, setInquiryCategory] = useState<string | undefined>();
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const navigate = (page: "home" | "builder" | "contacts" | "legal") => {
    if (page === "home") window.location.href = "/";
    else if (page === "builder") window.location.href = "/#builder";
    else if (page === "contacts") window.location.href = "/#contacts";
    else if (page === "legal") window.location.href = "/#legal";
  };

  const scrollToSection = (id: string) => {
    window.location.href = `/#${id}`;
  };

  const showToast = (message: string, type: "success" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex flex-col">
      <Header
        onOpenBooking={() => { window.location.href = "/#benefits"; }}
        onOpenInquiry={(cat) => { setInquiryCategory(cat); setInquiryOpen(true); }}
        onScrollToSection={scrollToSection}
        currentPage="home"
        onNavigate={navigate}
      />

      <main className="flex-1">
        {children}
      </main>

      <Footer onScrollToSection={scrollToSection} onNavigate={navigate} />

      <LeadInquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        preFilledCategory={inquiryCategory}
        onNotify={showToast}
      />

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] max-w-sm px-5 py-4 rounded-lg shadow-2xl text-sm font-sans flex items-start gap-3 transition-all ${
          toast.type === "success"
            ? "bg-emerald-900/95 border border-emerald-500/40 text-white"
            : "bg-[#1c1c1c] border border-white/10 text-white/90"
        }`}>
          <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${toast.type === "success" ? "bg-emerald-400" : "bg-[#ff8562]"}`} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
