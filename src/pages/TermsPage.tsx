import React from "react";
import { FileText } from "lucide-react";
import SiteLayout from "../components/SiteLayout";

export default function TermsPage() {
  return (
    <SiteLayout>
      <div className="bg-[#0e0e0e] text-white font-sans">
        <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#ff8562]/10 border border-[#ff8562]/30 rounded flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#ff8562]" />
              </div>
              <span className="text-[10px] font-mono text-[#ff8562] uppercase tracking-widest">Юридические документы</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-white mb-2">
              Пользовательское соглашение
            </h1>
            <p className="text-white/40 text-sm font-mono">Редакция от 01.06.2026</p>
          </div>

          <div className="prose prose-sm max-w-none space-y-8 text-white/75 leading-relaxed">

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">1. Предмет соглашения</h2>
              <p>
                Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между ООО «Аспекто» (далее — «Исполнитель») и любым физическим лицом (далее — «Пользователь»), использующим сайт <strong className="text-white">aspekto.ru</strong> (далее — «Сайт»).
              </p>
              <p className="mt-3">
                Использование Сайта означает безоговорочное принятие Пользователем настоящего Соглашения в полном объёме. Если вы не согласны с условиями, пожалуйста, прекратите использование Сайта.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">2. Описание услуг</h2>
              <p>Сайт является информационным ресурсом, предоставляющим сведения об услугах Исполнителя по проектированию и изготовлению мебели на заказ. Сайт позволяет:</p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-white/65">
                <li>Ознакомиться с каталогом мебели и материалов;</li>
                <li>Воспользоваться онлайн-конструктором стола;</li>
                <li>Оставить заявку на расчёт стоимости и замер;</li>
                <li>Записаться на экскурсию по производству;</li>
                <li>Связаться с консультантом Исполнителя.</li>
              </ul>
              <p className="mt-3">
                Сайт не является публичной офертой. Заявка через сайт не является заключением договора. Договор заключается в письменной форме после согласования всех условий.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">3. Правила использования сайта</h2>
              <p>Пользователь обязуется:</p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-white/65">
                <li>Предоставлять достоверные сведения при заполнении форм;</li>
                <li>Не использовать сайт в незаконных целях;</li>
                <li>Не осуществлять действия, нарушающие работу сайта;</li>
                <li>Не копировать и не распространять контент сайта без разрешения Исполнителя;</li>
                <li>Соблюдать нормы действующего законодательства РФ.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">4. Интеллектуальная собственность</h2>
              <p>
                Все материалы Сайта (тексты, изображения, логотипы, дизайн, программный код) являются объектами интеллектуальной собственности ООО «Аспекто» и охраняются законодательством РФ об авторском праве. Любое использование без письменного разрешения Исполнителя запрещено.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">5. Ограничение ответственности</h2>
              <p>Исполнитель не несёт ответственности за:</p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-white/65">
                <li>Временную недоступность Сайта по техническим причинам;</li>
                <li>Ущерб, возникший в результате использования или невозможности использования Сайта;</li>
                <li>Действия третьих лиц, получивших доступ к учётным данным Пользователя;</li>
                <li>Несоответствие визуализации товаров реальному виду (цвет, текстура могут отличаться в зависимости от настроек экрана).</li>
              </ul>
              <p className="mt-3">
                Совокупная ответственность Исполнителя ограничена стоимостью услуг, фактически оказанных Пользователю.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">6. Обработка персональных данных</h2>
              <p>
                Оставляя заявку через Сайт, Пользователь даёт согласие на обработку своих персональных данных в соответствии с{" "}
                <a href="/privacy" className="text-[#ff8562] hover:underline">Политикой конфиденциальности</a>
                {" "}и Федеральным законом № 152-ФЗ «О персональных данных».
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">7. Порядок расчётов и заказа</h2>
              <p>
                Стоимость изделий, указанная на Сайте, носит ориентировочный характер («от...») и уточняется после замеров и согласования всех параметров. Окончательная цена фиксируется в договоре. Исполнитель вправе изменять цены без предварительного уведомления при условии их публичного обновления на Сайте.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">8. Гарантии</h2>
              <p>
                Гарантийный срок на изготовленную мебель составляет <strong className="text-white">10 (десять) лет</strong> с даты монтажа. Гарантия распространяется на конструктивные дефекты, возникшие по вине Исполнителя. Гарантия не распространяется на повреждения, вызванные ненадлежащей эксплуатацией, воздействием влаги, механическими повреждениями.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">9. Применимое право и споры</h2>
              <p>
                Настоящее Соглашение регулируется законодательством Российской Федерации. Все споры подлежат разрешению в досудебном порядке в течение 30 дней. При недостижении согласия — в суде общей юрисдикции по месту нахождения Исполнителя.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">10. Изменения соглашения</h2>
              <p>
                Исполнитель вправе вносить изменения в Соглашение без предварительного уведомления. Актуальная редакция всегда опубликована на данной странице. Продолжение использования Сайта после внесения изменений означает согласие с ними.
              </p>
            </section>

            <section className="border-t border-white/10 pt-6">
              <h2 className="text-white text-lg font-serif font-medium mb-3">11. Реквизиты исполнителя</h2>
              <div className="space-y-1 text-sm">
                <p><span className="text-white/40">Юридическое лицо:</span> Общество с ограниченной ответственностью «Аспекто»</p>
                <p><span className="text-white/40">ИНН:</span> 7734500000</p>
                <p><span className="text-white/40">ОГРН:</span> 1187746000000</p>
                <p><span className="text-white/40">Адрес:</span> 142110, Московская обл., г. Подольск, ул. Производственная, д. 29</p>
                <p><span className="text-white/40">Email:</span> <span className="text-[#ff8562]">info@aspekto.ru</span></p>
                <p><span className="text-white/40">Телефон:</span> <span className="text-[#ff8562]">8 (918) 915-78-79</span></p>
              </div>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
            <a href="/" className="text-xs font-mono text-white/30 hover:text-white transition-colors">← На главную</a>
            <a href="/privacy" className="text-xs font-mono text-white/30 hover:text-white transition-colors">Политика конфиденциальности →</a>
          </div>

        </div>
      </div>
    </SiteLayout>
  );
}
