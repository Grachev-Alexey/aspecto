import React from "react";
import { ShieldAlert, FileText, CheckCircle2, Download, ExternalLink, HelpCircle } from "lucide-react";

export default function LegalPage() {
  const printPage = () => {
    window.print();
  };

  return (
    <div className="w-full bg-[#121212] py-16 sm:py-24 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Page header */}
        <div className="border-b border-white/10 pb-8 mb-10 text-center sm:text-left">
          <span className="text-[10px] font-mono text-[#ff8562] uppercase tracking-[0.3em] block mb-2">
            Официальные данные и прозрачность
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-white font-medium">
            Юридическая информация и <span className="font-serif italic text-[#ff8562]">Реквизиты</span>
          </h1>
          <p className="text-xs text-white/50 font-sans mt-3 max-w-xl leading-relaxed">
            Мы работаем в строгом соответствии с законодательством Российской Федерации. Каждый мебельный проект сопровождается официальным договором подряда со спецификацией, гарантией и кассовым чеком.
          </p>
        </div>

        {/* Legal Grid Card */}
        <div className="bg-[#181818] border border-white/10 p-6 sm:p-10 space-y-8 mb-10" id="legal-entity-card">
          
          <div>
            <h2 className="text-xl font-serif text-white font-medium mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff8562]"></span>
              Карточка предприятия
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs font-sans mt-4">
              <div className="border-b border-white/5 pb-2.5">
                <span className="text-white/40 block mb-0.5 font-mono uppercase text-[9px]">Наименование организации</span>
                <span className="text-white font-medium">Индивидуальный предприниматель ЛЕВКИНА ЛЮДМИЛА АРСЕНТЬЕВНА</span>
              </div>
              <div className="border-b border-white/5 pb-2.5">
                <span className="text-white/40 block mb-0.5 font-mono uppercase text-[9px]">Сокращенное наименование</span>
                <span className="text-white">ИП ЛЕВКИНА Л.А. (Студия Аспекто)</span>
              </div>
              <div className="border-b border-white/5 pb-2.5">
                <span className="text-white/40 block mb-0.5 font-mono uppercase text-[9px]">ИНН налогоплательщика</span>
                <span className="text-white font-mono">500601550891</span>
              </div>
              <div className="border-b border-white/5 pb-2.5">
                <span className="text-white/40 block mb-0.5 font-mono uppercase text-[9px]">ОГРНИП</span>
                <span className="text-white font-mono">325508100034456</span>
              </div>
              <div className="border-b border-white/5 pb-2.5">
                <span className="text-white/40 block mb-0.5 font-mono uppercase text-[9px]">Юридический адрес регистрации</span>
                <span className="text-white/80">143005, Московская область, г. Одинцово, ул. Маршала Бирюзова, д. 28</span>
              </div>
              <div className="border-b border-white/5 pb-2.5">
                <span className="text-white/40 block mb-0.5 font-mono uppercase text-[9px]">Почтовый адрес для писем</span>
                <span className="text-white/80">129301, г. Москва, ул. Космонавтов, д. 12А, офис 401</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-serif text-white font-medium mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff8562]"></span>
              Банковские реквизиты плательщика
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs font-sans mt-4">
              <div className="border-b border-white/5 pb-2.5">
                <span className="text-white/40 block mb-0.5 font-mono uppercase text-[9px]">Расчетный счет</span>
                <span className="text-white font-mono font-bold tracking-wide">40802810800007761435</span>
              </div>
              <div className="border-b border-white/5 pb-2.5">
                <span className="text-white/40 block mb-0.5 font-mono uppercase text-[9px]">Название банка</span>
                <span className="text-white">АО «ТБанк» (бывший Тинькофф Банк)</span>
              </div>
              <div className="border-b border-white/5 pb-2.5">
                <span className="text-white/40 block mb-0.5 font-mono uppercase text-[9px]">БИК</span>
                <span className="text-white font-mono">044525974</span>
              </div>
              <div className="border-b border-white/5 pb-2.5">
                <span className="text-white/40 block mb-0.5 font-mono uppercase text-[9px]">Корреспондентский счет</span>
                <span className="text-white font-mono">30101810145250000974</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-wrap gap-4 border-t border-white/5">
            <button
              onClick={printPage}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#ff8562]" />
              <span>Распечатать реквизиты</span>
            </button>
            <a 
              href="mailto:info@aspekto.ru?subject=Запрос реквизитов Аспекто"
              className="px-4 py-2 border border-white/10 hover:border-white/30 text-white/80 hover:text-white text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Скачать PDF (143 Кб)</span>
            </a>
          </div>

        </div>

        {/* Production Guarantees & Ecology certificates */}
        <div className="space-y-6">
          <h3 className="text-xl font-serif text-white font-medium border-b border-white/5 pb-3">
            Сертификация и безопасность материалов
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            
            <div className="p-5 border border-white/5 bg-white/[0.01] flex gap-3.5 items-start">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-1">Прочные влагостойкие плиты</h4>
                <p className="text-white/50 leading-relaxed">Все используемые мебельные плиты (ЛДСП Egger, австрийский Kronospan, МДФ) соответствуют строжайшим стандартам ГОСТ и европейским нормам прочности. Плиты защищены от разбухания и подходят для интенсивной эксплуатации на кухне и в жилых зонах.</p>
              </div>
            </div>

            <div className="p-5 border border-white/5 bg-white/[0.01] flex gap-3.5 items-start">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-1">Защитные лаки Renner и масла</h4>
                <p className="text-white/50 leading-relaxed">Деревянные слэбы столов и шпонированные фасады покрываются матовыми полиуретановыми лаками Renner и износостойкими масло-восковыми составами, которые надежно защищают дерево от пролитых жидкостей, кофе и горячих чашек.</p>
              </div>
            </div>

            <div className="p-5 border border-white/5 bg-white/[0.01] flex gap-3.5 items-start">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-1">Договор с фиксированной ценой</h4>
                <p className="text-white/50 leading-relaxed">Смета фиксируется в Спецификации при подписании договора в рублях. Окончательная стоимость вашей кухни или шкафа-купе не может измениться в процессе производства из-за колебаний цен сырья.</p>
              </div>
            </div>

            <div className="p-5 border border-white/5 bg-white/[0.01] flex gap-3.5 items-start">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-1">Срок гарантии 10 лет</h4>
                <p className="text-white/50 leading-relaxed">На все несущие каркасы шкафов, кухонь и столы-слэбы действует гарантия 10 лет (гарантийный талон выдается вместе с актом приемки). На оригинальные петли и доводчики Blum действует бессрочная заводская замена.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Public Offer Warning */}
        <div className="mt-12 p-4 bg-yellow-500/5 border border-yellow-500/10 text-[10px] text-white/40 leading-relaxed font-sans">
          <p className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-yellow-500 mb-1.5 font-mono text-[9px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            Важное примечание
          </p>
          Данный веб-ресурс и содержащаяся на нем информация (включая цены, фотографии моделей, размеры и скидки) носят исключительно информационно-ознакомительный характер и ни при каких условиях не являются публичной офертой, определяемой положениями Статьи 437 Гражданского кодекса РФ. Все расчетные данные и чертежи составляются по итогам точного замера лазерными нивелирами технологом Аспекто.
        </div>

      </div>
    </div>
  );
}
