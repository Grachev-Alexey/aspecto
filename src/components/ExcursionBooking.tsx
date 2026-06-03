import React, { useState } from "react";
import { TEAM_CONSULTANTS } from "../data";
import { Calendar, Clock, User, ShieldCheck, Ticket, Download, AlertCircle } from "lucide-react";

interface ExcursionBookingProps {
  onNotify: (message: string, type: "success" | "info") => void;
  onAddLead?: (lead: any) => void;
}

export default function ExcursionBooking({ onNotify, onAddLead }: ExcursionBookingProps) {
  const [selectedConsultant, setSelectedConsultant] = useState(TEAM_CONSULTANTS[0]);
  const [date, setDate] = useState("2026-06-05");
  const [time, setTime] = useState("14:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedPass, setCompletedPass] = useState<{
    passId: string;
    name: string;
    consultant: string;
    datetime: string;
  } | null>(null);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date || !time) {
      onNotify("Пожалуйста, заполните необходимые поля для записи.", "info");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const formattedDateTime = `${date} в ${time}`;
      onNotify(`Вы успешно записались на персональную экскурсию по цеху на ${formattedDateTime}!`, "success");
      
      // Generate digital pass
      const simulatedPassId = "MS-" + Math.floor(100000 + Math.random() * 900000);
      setCompletedPass({
        passId: simulatedPassId,
        name: name.trim(),
        consultant: selectedConsultant.name,
        datetime: formattedDateTime
      });

      // Save lead tracking excursion
      if (onAddLead) {
        onAddLead({
          id: `lead-${Date.now()}`,
          name: name.trim(),
          phone: phone.trim(),
          category: "Экскурсия на производство",
          comments: `Запись на экскурсию в цех (г. Подольск). Спикер: ${selectedConsultant.name}, Специальность: ${selectedConsultant.specialty}. Планируемое время визита: ${formattedDateTime}. Пропуск: ${simulatedPassId}.`,
          showroomBooking: {
            date: date,
            time: time,
            consultant: selectedConsultant.name
          },
          createdAt: new Date().toLocaleString("ru-RU", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }),
          status: "pending"
        });
      }

      // Reset form
      setName("");
      setPhone("");
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <section id="benefits" className="py-24 bg-[#121212] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title row */}
        <div className="text-center mb-16">
          <p className="text-[#ff8562] font-mono text-xs uppercase tracking-[0.25em] mb-3">
            Визит на производство (г. Подольск)
          </p>
          <h2 className="text-headline-lg font-light text-white text-3xl md:text-5xl tracking-normal max-w-2xl mx-auto">
            Запишитесь на <span className="font-serif italic text-[#ff8562]">экскурсию по производству</span>
          </h2>
          <p className="text-white/60 text-sm max-w-xl mx-auto mt-4 font-sans">
            Мы покажем вам все технологические этапы: от калибровки ламелей до покрасочной камеры. Сделайте правильный выбор, понимая внутреннюю структуру ваших изделий.
          </p>
        </div>

        {/* Form and pass simulation splits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Booking specifications */}
          <div className="lg:col-span-7 bg-[#1c1c1c] border border-white/10 p-6 md:p-8 rounded-sm">
            <h3 className="text-xl font-medium text-white mb-6 font-serif flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#ff8562]" />
              Заполнить параметры визита
            </h3>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              
              {/* Consultant selections */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-3 font-mono">
                  1. Выберите вашего проводника-архитектора
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TEAM_CONSULTANTS.map((member) => (
                    <button
                      key={member.name}
                      type="button"
                      onClick={() => setSelectedConsultant(member)}
                      className={`p-3 text-left border rounded-xs transition-all flex flex-col justify-between h-40 focus:outline-none cursor-pointer ${
                        selectedConsultant.name === member.name
                          ? "border-[#ff8562] bg-[#ff8562]/5"
                          : "border-white/10 bg-black/20 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full border border-white/25 object-cover shrink-0"
                        />
                        <div>
                          <p className={`text-xs font-semibold leading-tight ${selectedConsultant.name === member.name ? "text-[#ff8562]" : "text-white/90"}`}>
                            {member.name.split(" ")[0]}
                          </p>
                          <p className="text-[10px] text-white/40">{member.role.split(",")[0]}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-white/50 font-sans leading-tight mt-auto">
                        Специфика: <span className="text-white/80">{member.specialty}</span>
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date / Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-2 font-mono">
                    2. Выберите дату посещения
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min="2026-06-01"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 text-white p-3 text-xs focus:ring-1 focus:ring-[#ff8562] focus:border-[#ff8562] focus:outline-none rounded-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-2 font-mono">
                    3. Желаемый час брони
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 text-white p-3 text-xs focus:ring-1 focus:ring-[#ff8562] focus:focus:border-[#ff8562] focus:outline-none rounded-none font-mono cursor-pointer"
                  >
                    <option value="10:00">10:00—12:00 (Утренняя сессия)</option>
                    <option value="12:00">12:00—14:00 (Комфортное время)</option>
                    <option value="14:00">14:00—16:00 (Дневной разбор)</option>
                    <option value="16:00">16:00—18:00 (Индивидуальный разбор)</option>
                    <option value="18:00">18:00—20:00 (Вечерний чай в цеху)</option>
                  </select>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-2 font-mono">
                    Фио гостя
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Александр Иванов"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 text-white p-3 text-xs focus:ring-1 focus:ring-[#ff8562] focus:border-[#ff8562] focus:outline-none rounded-none font-serif"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/40 mb-2 font-mono">
                    Номер телефона
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+7 (999) 000-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 text-white p-3 text-xs focus:ring-1 focus:ring-[#ff8562] focus:border-[#ff8562] focus:outline-none rounded-none font-mono"
                  />
                </div>
              </div>

              <div className="bg-black/20 p-3 rounded-xs border border-white/5 flex items-center gap-2 text-xs text-white/50">
                <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                <span>Мы обязуемся не передавать ваши контактные данные третьим лицам. Строгая конфиденциальность.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary font-serif select-none h-12 flex items-center justify-center gap-2 "
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-black rounded-full animate-spin"></span>
                ) : (
                  <span>Заказать пропуск на производство</span>
                )}
              </button>

            </form>
          </div>

          {/* RIGHT COLUMN: Digital Voucher / Pass (Real-time update) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {completedPass ? (
              <div className="bg-[#181818] border border-[#ff8562] p-6 text-center rounded-lg space-y-5 relative overflow-hidden" style={{ boxShadow: "rgba(255, 133, 98, 0.1) 0px 10px 40px" }}>
                {/* Decorative punched pass style */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#121212] border-r border-[#ff8562]/40"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#121212] border-l border-[#ff8562]/40"></div>

                <div className="bg-[#ff8562]/10 py-1 px-3 rounded-full text-[10px] text-[#ff8562] tracking-[0.2em] font-mono inline-block uppercase">
                  ✓ Электронный пропуск оформлен
                </div>

                <Ticket className="w-10 h-10 text-[#ff8562] mx-auto animate-bounce" />

                <h4 className="text-xl font-serif text-white uppercase tracking-wider">
                  Пропуск на фабрику
                </h4>

                <div className="border-t border-b border-white/10 py-4 text-left font-mono text-xs space-y-2.5 bg-black/20 px-4 rounded-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">Код приглашения:</span>
                    <span className="font-bold text-white">{completedPass.passId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Имя посетителя:</span>
                    <span className="text-white truncate max-w-[200px]">{completedPass.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Архитектор-консультант:</span>
                    <span className="text-[#ff8562]">{completedPass.consultant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Дата и время:</span>
                    <span className="text-green-400 font-bold">{completedPass.datetime}</span>
                  </div>
                </div>

                <p className="text-[10px] text-white/40 font-sans leading-relaxed">
                  Будет отправлено SMS с геолокацией и схемой заезда. Пожалуйста, сохраните этот пропуск на мобильном телефоне для предъявления охране на КПП.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onNotify("Электронный ваучер сохранен в PDF! (Имитация)", "success");
                    }}
                    className="flex-1 py-2.5 bg-white text-black text-xs font-serif font-semibold rounded-xs hover:bg-zinc-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Скачать PDF карту</span>
                  </button>
                  <button
                    onClick={() => setCompletedPass(null)}
                    className="px-3 py-2.5 bg-black/40 border border-white/10 text-white/60 text-xs font-sans rounded-xs hover:text-white transition-colors cursor-pointer"
                  >
                    Новая запись
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#181818] border border-white/10 p-6 sm:p-8 rounded-lg text-center space-y-4">
                <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center rounded-full mx-auto">
                  <Ticket className="w-6 h-6 text-[#ff8562]" />
                </div>
                <div>
                  <h4 className="text-lg font-serif text-white font-medium">Персональный билет при выезде</h4>
                  <p className="text-xs text-white/50 max-w-sm mx-auto mt-2 font-sans leading-relaxed">
                    После заполнения формы слева вы мгновенно получите цифровой ваучер на имя для въезда на охраняемую территорию производства мебели Аспекто.
                  </p>
                </div>
                <div className="border-t border-dashed border-white/10 pt-4 text-left font-mono text-[11px] text-white/40 space-y-2">
                  <p className="flex items-center gap-1.5">• Бесплатная охраняемая парковка у цеха</p>
                  <p className="flex items-center gap-1.5">• Горячий кофе, образцы фасадов в подарок</p>
                  <p className="flex items-center gap-1.5">• Прямая консультация с технологом по чертежам</p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
