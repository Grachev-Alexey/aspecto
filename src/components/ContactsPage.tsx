import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Calendar, ArrowRight, MessageSquare, Sliders } from "lucide-react";

interface ContactsPageProps {
  onNotify: (message: string, type: "success" | "info") => void;
}

export default function ContactsPage({ onNotify }: ContactsPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    visitType: "measure",
    preferredTime: "",
    comments: ""
  });
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      onNotify("Пожалуйста, заполните Имя и Номер телефона", "info");
      return;
    }
    if (!consent) {
      onNotify("Необходимо дать согласие на обработку персональных данных.", "info");
      return;
    }

    const leadCategory = formData.visitType === "measure"
      ? "Выезд замерщика с образцами"
      : "Визит на производство (Подольск)";

    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: `lead-contact-${Date.now()}`,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        category: leadCategory,
        comments: `Запрос контактов. Желаемое время: ${formData.preferredTime || "Не указано"}. Комментарий: ${formData.comments.trim() || "Без комментариев"}`,
        status: "pending"
      })
    }).catch(() => {});

    onNotify("Ваша заявка успешно принята! Менеджер свяжется с вами в течение 10 минут.", "success");
    setSubmitted(true);
    setFormData({ name: "", phone: "", visitType: "measure", preferredTime: "", comments: "" });
  };

  return (
    <div className="w-full bg-[#121212] py-10 sm:py-20 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title area */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <span className="text-xs font-mono text-[#ff8562] uppercase tracking-[0.25em] block">
            Свяжитесь с нами удобным способом
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-white font-medium tracking-tight">
            Контакты и <span className="font-serif italic text-[#ff8562]">Заказ</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/50 font-sans leading-relaxed">
            Мы работаем напрямую без наценок за выставочные залы. Вы можете вызвать нашего инженера-технолога с образцами материалов прямо к себе на объект или посетить наше производство в Подольске по предварительной записи.
          </p>
        </div>

        {/* Two main coordinate segments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          
          {/* Card 1: Home measurement and samples */}
          <div className="bg-[#181818] border border-white/10 p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden" id="card-home-visit">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff8562] opacity-[0.02] rounded-full filter blur-3xl pointer-events-none"></div>
            <div>
              <div className="inline-flex items-center px-2.5 py-1 rounded bg-[#ff8562]/10 border border-[#ff8562]/20 text-[10px] uppercase tracking-wider text-[#ff8562] font-mono mb-4 sm:mb-6">
                Выездной сервис по всей МО
              </div>
              <h2 className="text-xl sm:text-2xl font-serif text-white font-medium mb-3 sm:mb-4">Замер и образцы на дому</h2>
              <p className="text-xs sm:text-sm text-white/60 mb-5 sm:mb-6 font-sans leading-relaxed">
                Инженер-технолог приедет с чемоданом образцов: веера выкрасов эмали, раскладки шпона дуба/ясеня, образцы декоров ЛДСП Egger и Kronospan, фурнитура Blum и Hettich. На месте выполнит точный лазерный замер с учетом кривизны стен, розеток и труб, сразу спроектирует модули в чертежной программе.
              </p>

              <div className="space-y-3 sm:space-y-4 text-xs font-sans text-white/80 border-t border-white/5 pt-4 sm:pt-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#ff8562] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Зона обслуживания:</p>
                    <p className="text-white/60 mt-0.5">Вся Москва и Московская область (до 100 км от МКАД без доплат)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#ff8562] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Время выездов:</p>
                    <p className="text-white/60 mt-0.5">Ежедневно: с 09:00 до 21:00 (включая выходные и праздничные дни)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#ff8562] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Телефон для согласования дат:</p>
                    <p className="text-[#ff8562] font-semibold mt-0.5">8 (918) 915-78-79</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Styled Map Placeholder iframe to mimic real maps */}
            <div className="mt-6 sm:mt-8 border border-white/5 h-40 sm:h-48 bg-zinc-950 flex flex-col justify-center items-center p-4 relative text-center">
              <MapPin className="w-6 h-6 sm:w-8 h-8 text-[#ff8562] mb-1.5 saturate-150" />
              <p className="text-[11px] sm:text-xs font-mono text-white/60">Выезд замерщика</p>
              <p className="text-[9px] sm:text-[10px] text-white/40 mt-1">Доставка полных палитр материалов прямо к вам домой</p>
              <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600')] bg-cover mix-blend-overlay"></div>
            </div>
          </div>

          {/* Card 2: Production Workshop */}
          <div className="bg-[#181818] border border-white/10 p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden" id="card-production">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff8562] opacity-[0.02] rounded-full filter blur-3xl pointer-events-none"></div>
            <div>
              <div className="inline-flex items-center px-2.5 py-1 rounded bg-[#ff8562]/10 border border-[#ff8562]/20 text-[10px] uppercase tracking-wider text-[#ff8562] font-mono mb-4 sm:mb-6">
                Деревообрабатывающий цех и цех покраски
              </div>
              <h2 className="text-xl sm:text-2xl font-serif text-white font-medium mb-3 sm:mb-4">Производственный комплекс</h2>
              <p className="text-xs sm:text-sm text-white/60 mb-5 sm:mb-6 font-sans leading-relaxed">
                Собственное производство в Подольске площадью 1200 м². Мощные станки раскроя, покрасочно-сушильные боксы с гидрофильтрацией и зона сборки. Вы можете лично приехать к нам на производство, убедиться в качестве материалов, посмотреть раскрой плит, покраску и склейку шпона на прессах.
              </p>

              <div className="space-y-3 sm:space-y-4 text-xs font-sans text-white/80 border-t border-white/5 pt-4 sm:pt-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#ff8562] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Адрес цеха:</p>
                    <p className="text-white/60 mt-0.5">Московская область, г. Подольск, ул. Производственная, д. 29 (Пропускная система)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#ff8562] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Будни замерщиков и отгрузки:</p>
                    <p className="text-white/60 mt-0.5">Понедельник — Суббота: с 09:00 до 19:00 (Въезд бесплатный, только по паспорту/пропуску)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#ff8562] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Электронная почта инженеров:</p>
                    <p className="text-white/80 mt-0.5">info@aspekto.ru / sale@aspekto.ru</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Styled Map Placeholder iframe to mimic real maps */}
            <div className="mt-6 sm:mt-8 border border-white/5 h-40 sm:h-48 bg-zinc-950 flex flex-col justify-center items-center p-4 relative text-center">
              <MapPin className="w-6 h-6 sm:w-8 h-8 text-neutral-500 mb-1.5" />
              <p className="text-[11px] sm:text-xs font-mono text-white/60">Производственная площадка • Подольск</p>
              <p className="text-[9px] sm:text-[10px] text-white/40 mt-1">Визит возможен строго по предварительному согласованию</p>
              <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600')] bg-cover mix-blend-overlay"></div>
            </div>
          </div>

        </div>

        {/* Appointment scheduler with form */}
        <div className="bg-[#161616] border border-white/10 p-5 sm:p-12 relative overflow-hidden" id="contacts-form-box">
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#ff8562] opacity-[0.03] rounded-full filter blur-3xl pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left promo info panel */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              <span className="text-[10px] font-mono tracking-widest text-[#ff8562] uppercase block">
                Запланируйте встречу или выезд
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-medium leading-tight">
                Заявка на бесплатные замеры и расчет сметы
              </h2>
              <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-sans">
                Оставьте контакты для связи. Наш ведущий технолог свяжется в течение 10 минут, ответит на любые конструктивные вопросы, согласует удобное время выезда с образцами плит и профилей или оформит гостевой пропуск на фабрику.
              </p>
              
              <div className="space-y-3 font-sans text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#ff8562]/10 flex items-center justify-center text-[#ff8562] shrink-0 font-mono text-[9px] sm:text-[10px]">1</div>
                  <span className="text-white/75 text-[11px] sm:text-xs">Выезд инженера и подробная техническая консультация</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#ff8562]/10 flex items-center justify-center text-[#ff8562] shrink-0 font-mono text-[9px] sm:text-[10px]">2</div>
                  <span className="text-white/75 text-[11px] sm:text-xs">Работа по эскизам ИЛИ по готовым готовым модульным шаблонам</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#ff8562]/10 flex items-center justify-center text-[#ff8562] shrink-0 font-mono text-[9px] sm:text-[10px]">3</div>
                  <span className="text-white/75 text-[11px] sm:text-xs">Официальный договор, жесткая цена без скрытых комиссий</span>
                </div>
              </div>
            </div>

            {/* Right Form panel */}
            <div className="lg:col-span-7 bg-[#1c1c1c] p-4 sm:p-8 border border-white/5">
              {submitted ? (
                <div className="text-center py-6 sm:py-10 space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif text-white font-medium">Ваша заявка принята!</h3>
                  <p className="text-xs text-white/60 font-sans max-w-sm mx-auto">
                    Технолог свяжется с вами по указанному телефону в течение 10 минут для согласования точного времени и деталей.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  >
                    Отправить заново
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <h3 className="text-base sm:text-lg font-serif text-white font-medium border-b border-white/5 pb-2.5">Заполните форму заказа</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Ваше Имя *</label>
                      <input
                        type="text"
                        required
                        placeholder="Например, Александр"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff8562] font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Номер Телефона *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+7 (999) 000-00-00"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff8562] font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Что требуется сделать?</label>
                      <select
                        value={formData.visitType}
                        onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
                        className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff8562] font-sans"
                      >
                        <option value="measure">Пригласить технолога с каталогом на дом</option>
                        <option value="factory">Приехать на производство в Подольск</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Удобное время для звонка</label>
                      <input
                        type="text"
                        placeholder="Например, сегодня после 15:00"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff8562] font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-wider font-mono mb-1">Какие элементы мебели вас интересуют?</label>
                    <textarea
                      rows={3}
                      placeholder="Кухня со шкафами до потолка, встроенный трехстворчатый шкаф-купе, готовые шаблоны..."
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff8562] font-sans resize-none"
                    ></textarea>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5 shrink-0">
                      <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="sr-only" />
                      <div className={`w-4 h-4 border rounded-sm transition-all ${consent ? "bg-[#ff8562] border-[#ff8562]" : "border-white/20 bg-black/40 group-hover:border-white/40"}`}>
                        {consent && <svg className="w-3 h-3 text-white m-auto" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                    </div>
                    <span className="text-[10px] text-white/40 font-sans leading-relaxed">
                      Я согласен(-а) на обработку персональных данных в соответствии с{" "}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#ff8562] hover:underline">Политикой конфиденциальности</a>
                      {" "}согласно ФЗ № 152-ФЗ.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!consent}
                    className="w-full py-3 bg-white text-black hover:bg-[#ff8562] hover:text-white transition-colors text-xs font-mono font-bold uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Отправить запрос</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
