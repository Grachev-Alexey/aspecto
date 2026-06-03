import React, { useState, useEffect } from "react";
import { X, CheckCircle, FileText, Send, User, Phone, MessageSquare } from "lucide-react";

interface LeadInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preFilledCategory?: string;
  onNotify: (message: string, type: "success" | "info") => void;
  onAddLead?: (lead: any) => void;
}

const INTERESTS = [
  { id: "kitchen", label: "Кухня по индивидуальному проекту" },
  { id: "living", label: "Гостиные / Обеденные столы из слэба" },
  { id: "wardrobe", label: "Раздвижные и угловые гардеробные" },
  { id: "premium", label: "Консоли, комоды, дизайнерский шпон" },
  { id: "general", label: "Общая консультация / Выезд на замер" }
];

export default function LeadInquiryModal({ isOpen, onClose, preFilledCategory, onNotify, onAddLead }: LeadInquiryModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedInterest, setSelectedInterest] = useState(INTERESTS[0].label);
  const [comments, setComments] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Sync pre-filled category if passed down
  useEffect(() => {
    if (preFilledCategory) {
      const match = INTERESTS.find(item => item.label.toLowerCase().includes(preFilledCategory.toLowerCase()) || preFilledCategory.toLowerCase().includes(item.label.toLowerCase()));
      setSelectedInterest(match ? match.label : preFilledCategory);
    }
  }, [preFilledCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      onNotify("Заполните Ваше ФИО и контактный телефон.", "info");
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      onNotify(
        `Заявка по направлению "${selectedInterest}" успешно зарегистрирована! Персональный конструктор-дизайнер Аспекто свяжется с вами по номеру в течение 10 минут.`,
        "success"
      );

      // Save general lead in localStorage database
      if (onAddLead) {
        onAddLead({
          id: `lead-${Date.now()}`,
          name: name.trim(),
          phone: phone.trim(),
          category: selectedInterest,
          comments: comments.trim() || "Клиент запросил общую консультацию.",
          createdAt: new Date().toLocaleString("ru-RU", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }),
          status: "pending"
        });
      }

      setName("");
      setPhone("");
      setComments("");
      setIsSending(false);
      onClose(); // close modal
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div 
        className="bg-[#181818] border border-white/10 w-full max-w-lg rounded-none p-6 md:p-8 relative"
        style={{ boxShadow: "rgba(0,0,0,0.6) 0px 24px 64px" }}
      >
        {/* Close Button corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-10 h-10 border border-[#ff8562] flex items-center justify-center rounded-sm bg-black/40 mb-3">
            <FileText className="w-5 h-5 text-[#ff8562]" />
          </div>
          <h3 className="text-xl font-serif text-white uppercase tracking-wide">
            Оставить заявку на расчет
          </h3>
          <p className="text-white/50 text-xs font-sans mt-1">
            Заполните параметры, чтобы мы назначили профильного конструктора для вашего проекта.
          </p>
        </div>

        {/* Main interactive form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          
          {/* Category Dropdown Selection */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1.5 font-mono">
              Предмет интереса
            </label>
            <select
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
              className="w-full bg-black/40 border border-white/10 text-white p-3 text-xs focus:ring-1 focus:ring-[#ff8562] focus:border-[#ff8562] focus:outline-none rounded-none font-sans cursor-pointer"
            >
              {INTERESTS.map((item) => (
                <option key={item.id} value={item.label} className="bg-[#1c1c1c] text-white">
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1.5 font-mono">
              ФИО заказчика
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-white/30">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                placeholder="Михаил"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 text-white pl-10 pr-3 py-2.5 text-xs focus:ring-1 focus:ring-[#ff8562] focus:border-[#ff8562] focus:outline-none rounded-none font-serif"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1.5 font-mono">
              Номер телефона для связи в Telegram/WhatsApp
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-white/30 font-mono text-xs">+7</span>
              <input
                type="tel"
                required
                placeholder="(999) 000-00-00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-black/40 border border-white/10 text-white pl-10 pr-3 py-2.5 text-xs focus:ring-1 focus:ring-[#ff8562] focus:border-[#ff8562] focus:outline-none rounded-none font-mono"
              />
            </div>
          </div>

          {/* Remarks textarea */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1.5 font-mono">
              Комментарии или габариты (необязательно)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-white/30">
                <MessageSquare className="w-4 h-4" />
              </span>
              <textarea
                placeholder="Примерные размеры проема, пожелания по породе дерева или фурнитуре..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="w-full bg-black/40 border border-white/10 text-white pl-10 pr-3 py-2.5 text-xs focus:ring-1 focus:ring-[#ff8562] focus:border-[#ff8562] focus:outline-none rounded-none font-sans resize-none"
              />
            </div>
          </div>

          {/* Warning disclaimer */}
          <p className="text-[10px] text-white/30 font-sans leading-relaxed">
            Нажимая кнопку ниже, вы соглашаетесь с условиями хранения персональных сведений в соответствии со ст. 152-ФЗ РФ.
          </p>

          <button
            type="submit"
            disabled={isSending}
            className="w-full py-3 bg-[#ff8562] hover:bg-white hover:text-black text-white text-xs font-serif font-bold rounded-sm transition-all focus:outline-none uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {isSending ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-black rounded-full animate-spin"></span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Отправить заявку</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
