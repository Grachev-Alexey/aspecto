import React from "react";
import { ShieldCheck } from "lucide-react";
import SiteLayout from "../components/SiteLayout";

export default function PrivacyPage() {
  return (
    <SiteLayout>
      <div className="bg-[#0e0e0e] text-white font-sans">
        <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#ff8562]/10 border border-[#ff8562]/30 rounded flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#ff8562]" />
              </div>
              <span className="text-[10px] font-mono text-[#ff8562] uppercase tracking-widest">Юридические документы</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-white mb-2">
              Политика конфиденциальности
            </h1>
            <p className="text-white/40 text-sm font-mono">Редакция от 01.06.2026</p>
          </div>

          <div className="prose prose-sm max-w-none space-y-8 text-white/75 leading-relaxed">

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">1. Общие положения</h2>
              <p>
                Настоящая Политика конфиденциальности (далее — «Политика») разработана в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных пользователей сайта <strong className="text-white">aspekto.ru</strong> (далее — «Сайт»).
              </p>
              <p className="mt-3">
                Оператором персональных данных является: ООО «Аспекто» (далее — «Оператор»), ИНН 7734500000, ОГРН 1187746000000, адрес: 142110, Московская область, г. Подольск, ул. Производственная, д. 29.
              </p>
              <p className="mt-3">
                Используя Сайт или заполняя формы обратной связи, вы подтверждаете своё согласие с условиями настоящей Политики.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">2. Состав персональных данных</h2>
              <p>Оператор обрабатывает следующие персональные данные, добровольно предоставленные пользователем:</p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-white/65">
                <li>Фамилия, имя, отчество (ФИО);</li>
                <li>Номер контактного телефона;</li>
                <li>Адрес электронной почты (если указан);</li>
                <li>Текст обращения, комментарии, пожелания к заказу;</li>
                <li>Техническая информация (IP-адрес, тип браузера, дата и время обращения) — собирается автоматически в целях аналитики.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">3. Цели обработки персональных данных</h2>
              <p>Персональные данные обрабатываются в следующих целях:</p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-white/65">
                <li>Обработка заявок на расчёт стоимости мебели;</li>
                <li>Запись на экскурсию на производство;</li>
                <li>Согласование замеров и консультаций;</li>
                <li>Информирование о статусе заказа;</li>
                <li>Улучшение качества обслуживания и работы сайта;</li>
                <li>Выполнение требований законодательства РФ.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">4. Правовые основания обработки</h2>
              <p>Обработка персональных данных осуществляется на следующих правовых основаниях:</p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-white/65">
                <li>Согласие субъекта персональных данных (ст. 6 ч. 1 п. 1 Закона № 152-ФЗ);</li>
                <li>Исполнение договора с субъектом персональных данных (ст. 6 ч. 1 п. 5 Закона № 152-ФЗ);</li>
                <li>Выполнение требований законодательства РФ (ст. 6 ч. 1 п. 2 Закона № 152-ФЗ).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">5. Порядок обработки и хранения</h2>
              <p>
                Обработка персональных данных осуществляется с использованием средств автоматизации. Данные хранятся на серверах, расположенных на территории Российской Федерации.
              </p>
              <p className="mt-3">
                Срок хранения персональных данных: 3 (три) года с момента последнего взаимодействия, либо до отзыва согласия субъектом данных. По истечении срока данные уничтожаются.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">6. Передача персональных данных третьим лицам</h2>
              <p>
                Оператор <strong className="text-white">не передаёт</strong> персональные данные третьим лицам без явного согласия субъекта, за исключением случаев, предусмотренных действующим законодательством РФ (исполнение судебных решений, запросы уполномоченных органов).
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">7. Права субъекта персональных данных</h2>
              <p>В соответствии со ст. 14–17 Закона № 152-ФЗ вы имеете право:</p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-white/65">
                <li>Получить доступ к своим персональным данным;</li>
                <li>Потребовать уточнения, блокировки или уничтожения данных;</li>
                <li>Отозвать согласие на обработку в любой момент;</li>
                <li>Обжаловать действия Оператора в Роскомнадзоре.</li>
              </ul>
              <p className="mt-3">
                Для реализации прав направьте письменный запрос на адрес: <span className="text-[#ff8562]">info@aspekto.ru</span> или по почте на адрес Оператора.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">8. Защита персональных данных</h2>
              <p>
                Оператор применяет технические и организационные меры защиты, соответствующие требованиям Постановления Правительства РФ № 1119 от 01.11.2012 и Приказа ФСТЭК России № 21 от 18.02.2013. Передача данных на сайте осуществляется по протоколу HTTPS.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">9. Cookies и аналитика</h2>
              <p>
                Сайт использует технологию cookie для корректной работы, а также аналитические инструменты (статистика посещаемости). Cookie не содержат персональных данных и не используются для идентификации личности. Вы можете отключить cookie в настройках браузера.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-serif font-medium mb-3">10. Изменения политики</h2>
              <p>
                Оператор вправе вносить изменения в настоящую Политику. Действующая редакция всегда размещена на данной странице. Дата последнего обновления указана в заголовке документа.
              </p>
            </section>

            <section className="border-t border-white/10 pt-6">
              <h2 className="text-white text-lg font-serif font-medium mb-3">11. Контактные данные</h2>
              <div className="space-y-1 text-sm">
                <p><span className="text-white/40">Оператор:</span> ООО «Аспекто»</p>
                <p><span className="text-white/40">Адрес:</span> 142110, Московская обл., г. Подольск, ул. Производственная, д. 29</p>
                <p><span className="text-white/40">Email:</span> <span className="text-[#ff8562]">info@aspekto.ru</span></p>
                <p><span className="text-white/40">Телефон:</span> <span className="text-[#ff8562]">8 (918) 915-78-79</span></p>
              </div>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
            <a href="/" className="text-xs font-mono text-white/30 hover:text-white transition-colors">← На главную</a>
            <a href="/terms" className="text-xs font-mono text-white/30 hover:text-white transition-colors">Пользовательское соглашение →</a>
          </div>

        </div>
      </div>
    </SiteLayout>
  );
}
