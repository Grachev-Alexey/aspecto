import React, { useState, useMemo } from "react";
import { Sliders, HelpCircle, Check, Sparkles, AlertCircle, FileText, Layers, Archive, Table } from "lucide-react";

interface InteractiveBuilderProps {
  onNotify: (message: string, type: "success" | "info") => void;
  onAddLead?: (lead: any) => void;
}

const WOOD_OPTIONS = [
  {
    id: "oak",
    name: "Горный Алтайский Дуб",
    multiplier: 1.0,
    color: "#c29e6b",
    desc: "Плотный, износостойкий массив с выразительной текстурой."
  },
  {
    id: "walnut",
    name: "Кавказский Черный Орех",
    multiplier: 1.4,
    color: "#6c4d36",
    desc: "Элитный глубоко-кофейный оттенок с изысканными темными узорами."
  },
  {
    id: "ash",
    name: "Мореный Угольный Ясень",
    multiplier: 1.15,
    color: "#282a2d",
    desc: "Благородный бархатный асфальтовый оттенок со стальным отливом."
  }
];

const LEG_DESIGNS = [
  { id: "loop", name: "Трапеция Loft (Черный матовый металл)", price: 15000, desc: "Прочная опора из горячекатаного стального швеллера." },
  { id: "hairpin", name: "Патинированная шлифованная латунь", price: 28000, desc: "Роскошный легкий силуэт с тонкими опорами ручного золочения." },
  { id: "monolith", name: "Монолитный деревянный блок", price: 22000, desc: "Массивные сдвоенные пилоны из того же сорта древесины." }
];

// Kitchen configurations
const KITCHEN_LAYOUTS = [
  { id: "straight", name: "Прямая кухня", multiplier: 1.0, desc: "Расположение вдоль одной стены. Самый лаконичный вариант." },
  { id: "l-shape", name: "Угловая L-образная", multiplier: 1.35, desc: "Классическое распределение рабочих центров для удобного треугольника." },
  { id: "island", name: "Островная премиальная", multiplier: 1.7, desc: "План со свободно стоящей многофункциональной тумбой по центру." }
];

const KITCHEN_FACADES = [
  { id: "matte-enamel", name: "Шелковисто-матовая эмаль МДФ", price: 25000, color: "#4f4f4f", desc: "Ультрастойкая итальянская эмаль с выбором 500+ цветов по RAL." },
  { id: "natural-veneer", name: "Шпон ясеня/дуба со сквозной текстурой", price: 45000, color: "#8B5A2B", desc: "Природный глубокий рисунок дерева под двухкомпонентным лаком." },
  { id: "fenix-nanotech", name: "Нано-пластик Fenix (Сверхматовый)", price: 60000, color: "#1C1C1C", desc: "Суперматериал с термическим самовосстановлением микроцарапин." }
];

// Wardrobe configurations
const WARDROBE_MATERIALS = [
  { id: "glass", name: "Тонированное закаленное стекло Stopsol", price: 40000, color: "#3A3A3C", desc: "Изысканный полуглянцевый фасад с бронзовым или серым оттенком." },
  { id: "mirror", name: "Зеркало графит утолщенное антивандальное", price: 25000, color: "#6C6C6E", desc: "Визуально расширяет помещение, не дает цветных искажений." },
  { id: "veneer-wood", name: "Матовый кавказский орех МДФ", price: 38000, color: "#543D2B", desc: "Строгие классические фасады со скрытыми врезными ручками." }
];

const PROFILE_COLORS = [
  { id: "black-anodized", name: "Черный анодированный алюминий" },
  { id: "gold-patina", name: "Патинированная шлифованная бронза" },
  { id: "chrome-satin", name: "Сатинированный матовый хром" }
];

export default function InteractiveBuilder({ onNotify, onAddLead }: InteractiveBuilderProps) {
  // Current active builder type: 'table' | 'kitchen' | 'wardrobe'
  const [activeTab, setActiveTab] = useState<"table" | "kitchen" | "wardrobe">("table");

  // Config state - Tables
  const [selectedWood, setSelectedWood] = useState(WOOD_OPTIONS[0]);
  const [tableLength, setTableLength] = useState<number>(180); // 120 - 240
  const [tableWidth, setTableWidth] = useState<number>(90); // 60 - 120
  const [tableHeight, setTableHeight] = useState<number>(75);
  const [selectedLeg, setSelectedLeg] = useState(LEG_DESIGNS[0]);
  const [withEpoxy, setWithEpoxy] = useState<boolean>(true);

  // Config state - Kitchens
  const [selectedLayout, setSelectedLayout] = useState(KITCHEN_LAYOUTS[0]);
  const [selectedFacade, setSelectedFacade] = useState(KITCHEN_FACADES[0]);
  const [kitchenWidth, setKitchenWidth] = useState<number>(360); // 200 - 500
  const [needAppliances, setNeedAppliances] = useState<boolean>(false); // С встраиваемой техникой

  // Config state - Wardrobes
  const [selectedWardrobeMat, setSelectedWardrobeMat] = useState(WARDROBE_MATERIALS[0]);
  const [selectedProfileColor, setSelectedProfileColor] = useState(PROFILE_COLORS[0]);
  const [wardrobeWidth, setWardrobeWidth] = useState<number>(240); // 150 - 400
  const [withLed, setWithLed] = useState<boolean>(true); // Подсветка полок

  // Form states
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);

  // Dynamic price calculation
  const totalCost = useMemo(() => {
    if (activeTab === "table") {
      const areaFactor = (tableLength * tableWidth) / 10000;
      const baseWoodCost = 18000;
      const epoxyPremium = withEpoxy ? 25000 : 0;
      return Math.round((baseWoodCost * areaFactor * selectedWood.multiplier) + selectedLeg.price + epoxyPremium);
    } else if (activeTab === "kitchen") {
      const runningMeterCost = 90000; // за погонный метр
      const widthInMeters = kitchenWidth / 100;
      let cost = runningMeterCost * widthInMeters * selectedLayout.multiplier + selectedFacade.price;
      if (needAppliances) cost += 120000; // Набор техники под ключ (духовой шкаф, варка, вытяжка)
      return Math.round(cost);
    } else {
      // wardrobe
      const meterCost = 55000; // за шкаф в сборе
      const widthInMeters = wardrobeWidth / 100;
      let cost = meterCost * widthInMeters + selectedWardrobeMat.price;
      if (withLed) cost += 18000; // Светодиодная система подсветки по датчикам движения
      return Math.round(cost);
    }
  }, [activeTab, selectedWood, tableLength, tableWidth, selectedLeg, withEpoxy, selectedLayout, selectedFacade, kitchenWidth, needAppliances, selectedWardrobeMat, wardrobeWidth, withLed]);

  // Lead Submission
  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      onNotify("Пожалуйста, заполните Имя и номер Телефона для отправки спецификации.", "info");
      return;
    }

    setFormIsSubmitting(true);

    const typeLabels = {
      table: "Обеденный стол из слэба",
      kitchen: "Индивидуальный кухонный гарнитур",
      wardrobe: "Встроенный шкаф-купе"
    };

    setTimeout(() => {
      onNotify(
        `Спецификация изделия "${typeLabels[activeTab]}" успешно разработана! Наш ведущий мебельный конструктор свяжется с вами по номеру ${clientPhone} в течение 10 минут.`,
        "success"
      );

      // Construct detailed comments based on active configuration
      let commentsText = `Создана CAD-заявка в универсальном конструкторе на ${typeLabels[activeTab]}. Оценочная стоимость: от ${totalCost.toLocaleString("ru-RU")} руб. `;
      
      if (activeTab === "table") {
        commentsText += `Массив: ${selectedWood.name}, Эпоксидная река: ${withEpoxy ? "Да" : "Нет"}, Опоры: ${selectedLeg.name}, Размеры стола: ${tableLength * 10}x${tableWidth * 10}x750 мм.`;
      } else if (activeTab === "kitchen") {
        commentsText += `Планировка: ${selectedLayout.name}, Материал фасадов: ${selectedFacade.name}, Ширина кухни: ${kitchenWidth * 10} мм, Комплект техники: ${needAppliances ? "Да" : "Нет"}.`;
      } else if (activeTab === "wardrobe") {
        commentsText += `Материал раздвижных дверей: ${selectedWardrobeMat.name}, Профиль дверей: ${selectedProfileColor.name}, Ширина шкафа: ${wardrobeWidth * 10} мм, Светодиодный профиль: ${withLed ? "Встроен (датчик движения)" : "Нет"}.`;
      }

      if (onAddLead) {
        onAddLead({
          id: `lead-builder-${Date.now()}`,
          name: clientName.trim(),
          phone: clientPhone.trim(),
          category: `Конструктор: ${typeLabels[activeTab]}`,
          comments: commentsText,
          createdAt: new Date().toLocaleString("ru-RU", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }),
          status: "pending"
        });
      }

      setClientName("");
      setClientPhone("");
      setFormIsSubmitting(false);
    }, 1200);
  };

  return (
    <section id="builder" className="py-24 bg-[#121212] border-y border-white/10 wood-grain-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center mb-12">
          <p className="text-[#ff8562] font-mono text-xs uppercase tracking-[0.25em] mb-3">
            Интерактивная 3D CAD система
          </p>
          <h2 className="text-headline-lg font-light text-white text-3xl md:text-5xl tracking-normal max-w-3xl mx-auto">
            Спроектируйте <span className="text-[#ff8562] font-serif italic">авторскую мебель</span> под ваши габариты
          </h2>
          <p className="text-white/60 text-sm max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
            Мы производим мебель любой категории на собственном цехе в Подольске. Попробуйте сконструировать интересующий мебельный комплекс, переключая вкладки ниже:
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex justify-center mb-10 w-full overflow-x-auto scrollbar-none pb-2">
          <div className="bg-[#181818] border border-white/10 p-1 rounded flex flex-nowrap sm:inline-flex gap-1 min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab("table")}
              className={`px-4 sm:px-6 py-2.5 text-xs font-mono font-medium tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === "table"
                  ? "bg-[#ff8562] text-white shadow-md font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Стол-слэб (Река)</span>
            </button>
            <button
              onClick={() => setActiveTab("kitchen")}
              className={`px-4 sm:px-6 py-2.5 text-xs font-mono font-medium tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === "kitchen"
                  ? "bg-[#ff8562] text-white shadow-md font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Кухонные гарнитуры</span>
            </button>
            <button
              onClick={() => setActiveTab("wardrobe")}
              className={`px-4 sm:px-6 py-2.5 text-xs font-mono font-medium tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === "wardrobe"
                  ? "bg-[#ff8562] text-white shadow-md font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Шкафы-купе и гардеробные</span>
            </button>
          </div>
        </div>

        {/* Configuration Core Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Live Interactive Blueprint Canvas */}
          <div className="lg:col-span-7 bg-[#1c1c1c] border border-white/10 p-6 md:p-8 rounded-none relative overflow-hidden flex flex-col justify-between aspect-video min-h-[380px]">
            
            {/* Grid blueprint background details */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute -left-12 -top-12 w-64 h-64 bg-[#ff8562] opacity-[0.02] rounded-full filter blur-3xl pointer-events-none"></div>

            {/* Technical watermark labels */}
            <div className="flex justify-between items-center text-[10px] font-mono text-white/30 z-10 select-none">
              <span>ASPEKTO CAD-VIEWER V2.4</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                ACTIVE PROD: {activeTab === "table" ? "RIVER_TABLE_3D" : activeTab === "kitchen" ? "KITCHEN_INDIVIDUAL" : "WARDROBE_LUX_SLIDING"}
              </span>
            </div>

            {/* Visual simulation area */}
            <div className="flex-1 flex flex-col items-center justify-center relative mt-4">
              
              {/* Outer Blueprint Boundary box */}
              <div className="relative w-full max-w-[480px] h-[230px] border border-white/5 bg-black/20 flex flex-col items-center justify-center rounded-sm">
                
                {activeTab === "table" && (
                  <>
                    {/* Horizontal length indicator */}
                    <div className="absolute -top-6 left-2 right-2 flex items-center justify-between z-10">
                      <div className="w-[1.5px] h-2.5 bg-[#ff8562]/40"></div>
                      <div className="flex-1 border-t border-dashed border-[#ff8562]/40 mx-1 flex items-center justify-center">
                        <span className="bg-[#1c1c1c] px-2 text-[10px] font-mono text-[#ff8562] font-semibold">
                          {tableLength * 10} мм L
                        </span>
                      </div>
                      <div className="w-[1.5px] h-2.5 bg-[#ff8562]/40"></div>
                    </div>

                    {/* Vertical Width indicator (Right side) */}
                    <div className="absolute -right-6 top-2 bottom-2 flex flex-col items-center justify-between z-10">
                      <div className="h-[1.5px] w-2.5 bg-[#ff8562]/40"></div>
                      <div className="flex-1 border-l border-dashed border-[#ff8562]/40 my-1 flex justify-center items-center">
                        <span className="bg-[#1c1c1c] py-1 px-1.5 text-[10px] font-mono text-[#ff8562] font-semibold rotate-90 transform origin-center whitespace-nowrap">
                          {tableWidth * 10} мм W
                        </span>
                      </div>
                      <div className="h-[1.5px] w-2.5 bg-[#ff8562]/40"></div>
                    </div>

                    {/* Main Table Countertop Slab Visual */}
                    <div 
                      className="rounded-sm flex relative overflow-hidden transition-all duration-500 border border-white/10"
                      style={{
                        backgroundColor: selectedWood.color,
                        width: `${Math.min(95, Math.max(50, (tableLength / 240) * 100))}%`,
                        height: `${Math.min(75, Math.max(35, (tableWidth / 120) * 80))}px`,
                        boxShadow: "rgba(0, 0, 0, 0.45) 4px 12px 24px -4px",
                      }}
                    >
                      {/* Natural Wood Grain */}
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.15)_50%)] [background-size:20px_100%]"></div>
                      
                      {/* Epoxy River */}
                      {withEpoxy && (
                        <div className="absolute left-0 right-0 top-1/3 bottom-1/3 bg-cyan-400/70 border-y border-cyan-300/40 backdrop-blur-xs flex items-center justify-center">
                          <span className="absolute z-20 text-[7px] tracking-widest font-mono text-black font-bold uppercase bg-cyan-200/90 px-1 rounded-xs">
                            РЕДКАЯ ЭПОКСИДНАЯ РЕКА
                          </span>
                        </div>
                      )}

                      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-white/20"></div>
                    </div>

                    {/* Legs representation */}
                    <div 
                      className="flex justify-between items-end border-t border-white/5 transition-all duration-300 mt-2"
                      style={{
                        width: `${Math.min(90, Math.max(45, (tableLength / 240) * 90))}%`,
                        height: "55px",
                      }}
                    >
                      {selectedLeg.id === "loop" && (
                        <>
                          <div className="w-10 h-full border-x-4 border-t-2 border-zinc-700 rounded-b-xs"></div>
                          <div className="w-10 h-full border-x-4 border-t-2 border-zinc-700 rounded-b-xs"></div>
                        </>
                      )}
                      {selectedLeg.id === "hairpin" && (
                        <>
                          <div className="w-3 h-full border-x border-amber-500 bg-gradient-to-b from-amber-600 to-amber-300"></div>
                          <div className="w-3 h-full border-x border-amber-500 bg-gradient-to-b from-amber-600 to-amber-300"></div>
                        </>
                      )}
                      {selectedLeg.id === "monolith" && (
                        <>
                          <div className="w-8 h-full" style={{ backgroundColor: selectedWood.color }}></div>
                          <div className="w-8 h-full" style={{ backgroundColor: selectedWood.color }}></div>
                        </>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "kitchen" && (
                  <>
                    {/* Width dimension marker */}
                    <div className="absolute -top-6 left-2 right-2 flex items-center justify-between z-10">
                      <div className="w-[1.5px] h-2.5 bg-[#ff8562]/40"></div>
                      <div className="flex-1 border-t border-dashed border-[#ff8562]/40 mx-1 flex items-center justify-center">
                        <span className="bg-[#1c1c1c] px-2 text-[10px] font-mono text-[#ff8562] font-semibold">
                          Ширина кухни: {kitchenWidth * 10} мм L
                        </span>
                      </div>
                      <div className="w-[1.5px] h-2.5 bg-[#ff8562]/40"></div>
                    </div>

                    {/* Render customized modular kitchen modules */}
                    <div className="w-4/5 h-[140px] flex gap-1 relative items-end">
                      
                      {/* Countertop layer */}
                      <div className="absolute top-[48px] inset-x-0 h-2 bg-[#ffffff] border-y border-neutral-300 rounded-sm z-20 flex items-center justify-center">
                        <span className="text-[6px] text-zinc-950 font-mono scale-90">КВАРЦЕВЫЙ АГЛОМЕРАТ</span>
                      </div>

                      {/* 4 Mock identical modules */}
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <div 
                          key={idx} 
                          className="flex-1 rounded-sm border relative flex flex-col justify-between transition-all duration-300 bg-[#282a2d]"
                          style={{ 
                            height: "100%", 
                            borderColor: idx % 2 === 0 ? "#ff856240" : "rgba(255,255,255,0.05)"
                          }}
                        >
                          {/* Top cabinet module (hangers) */}
                          <div 
                            className="h-[40px] border-b border-white/10 p-1 flex justify-between transition-all"
                            style={{ backgroundColor: selectedFacade.color }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                            <div className="text-[7px] text-white/50 font-sans tracking-tight">Вверх</div>
                          </div>

                          {/* Middle apron clearance placeholder */}
                          <div className="h-[25px] bg-black/40 border-y border-white/5 flex items-center justify-center">
                            <span className="text-[6px] text-neutral-500 font-mono">ФАРТУК</span>
                          </div>

                          {/* Bottom Drawer cabinet module */}
                          <div 
                            className="h-[55px] p-2 flex flex-col justify-end transition-all relative"
                            style={{ backgroundColor: selectedFacade.color }}
                          >
                            <div className="absolute top-[3px] inset-x-1.5 h-0.5 bg-black/20"></div>
                            {/* Horizontal luxury chrome grip handles */}
                            <div className="w-2/3 h-1 bg-white/10 border border-white/20 mx-auto rounded-xs my-1"></div>
                            <div className="text-[6px] text-white/40 text-center font-mono">BLUM</div>
                          </div>
                        </div>
                      ))}

                      {/* Visual rendering of optional Island if layout is island */}
                      {selectedLayout.id === "island" && (
                        <div className="absolute -bottom-8 left-1/4 right-1/4 h-[40px] bg-zinc-950 border border-[#ff8562]/30 rounded-xs z-30 p-1.5 flex flex-col justify-between shadow-2xl">
                          <div className="h-1 bg-neutral-100 rounded-xs"></div>
                          <span className="text-[6px] text-[#ff8562] font-mono text-center">КУХОННЫЙ ОСТРОВ</span>
                          <div className="h-4 bg-[#6c4d36] rounded-xs"></div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeTab === "wardrobe" && (
                  <>
                    {/* Width dimension marker */}
                    <div className="absolute -top-6 left-2 right-2 flex items-center justify-between z-10">
                      <div className="w-[1.5px] h-2.5 bg-[#ff8562]/40"></div>
                      <div className="flex-1 border-t border-dashed border-[#ff8562]/40 mx-1 flex items-center justify-center">
                        <span className="bg-[#1c1c1c] px-2 text-[10px] font-mono text-[#ff8562] font-semibold">
                          Ширина шкафа: {wardrobeWidth * 10} мм L
                        </span>
                      </div>
                      <div className="w-[1.5px] h-2.5 bg-[#ff8562]/40"></div>
                    </div>

                    {/* Rendering 3-door Sliding Wardrobe Closet */}
                    <div className="w-3/5 h-[170px] border border-white/15 bg-zinc-950 rounded-sm relative flex gap-0.5 p-1">
                      
                      {/* Active LED Ambient Neon glow inside closet frames helper */}
                      {withLed && (
                        <div className="absolute inset-0 bg-yellow-400/5 animate-pulse rounded-sm pointer-events-none border border-yellow-500/20 shadow-[inset_0_0_15px_rgba(234,179,8,0.15)]"></div>
                      )}

                      {/* Door 1: semi transparency glass effect showing internal shelfs placeholder */}
                      <div 
                        className="flex-1 h-full border rounded-xs transition-all flex flex-col justify-between relative overflow-hidden"
                        style={{ backgroundColor: selectedWardrobeMat.color, borderColor: selectedProfileColor.id === "gold-patina" ? "#d9770680" : "#a1a1aa50" }}
                      >
                        {/* Internal shelves silhouette */}
                        <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-40">
                          <div className="h-px bg-white/20"></div>
                          <div className="h-px bg-white/20"></div>
                          <div className="h-px bg-white/20"></div>
                          <div className="h-px bg-white/20"></div>
                        </div>
                        <span className="text-[6px] font-mono text-white/30 p-1.5 z-10 uppercase scale-90">Отсек А</span>
                        {/* Alu profiles profile line */}
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-[#ff8562]/60"></div>
                      </div>

                      {/* Door 2: Central sliding door */}
                      <div 
                        className="flex-1 h-full border rounded-xs transition-all relative overflow-hidden shadow-2xl transform translate-x-1"
                        style={{ backgroundColor: selectedWardrobeMat.color, borderColor: selectedProfileColor.id === "gold-patina" ? "#d9770680" : "#a1a1aa50" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10"></div>
                        <div className="absolute inset-y-2 right-1.5 w-1 bg-black/40 border border-white/10 rounded-sm"></div>
                        <span className="text-[6px] font-mono text-white/50 p-1.5 block uppercase scale-90">Зеркальный Слайд</span>
                      </div>

                      {/* Door 3: Right door */}
                      <div 
                        className="flex-1 h-full border rounded-xs transition-all flex flex-col justify-between relative overflow-hidden"
                        style={{ backgroundColor: selectedWardrobeMat.color, borderColor: selectedProfileColor.id === "gold-patina" ? "#d9770680" : "#a1a1aa50" }}
                      >
                        <span className="text-[6px] font-mono text-white/30 p-1.5 z-10 uppercase scale-90">Отсек Б</span>
                        <div className="absolute inset-y-0 right-0 w-0.5 bg-[#ff8562]/60"></div>
                      </div>

                      {/* Shelf glow indicator */}
                      {withLed && (
                        <div className="absolute bottom-1 right-2 bg-yellow-500/90 text-zinc-950 font-bold px-1 rounded-xs uppercase tracking-widest text-[5px] select-none scale-90 animate-pulse">
                          LED АКТИВЕН (Датчик)
                        </div>
                      )}
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* Bottom Overview Metadata bar */}
            <div className="border-t border-white/10 pt-4 z-10 grid grid-cols-3 gap-2 text-[10px] sm:text-xs font-mono text-white/50 bg-black/20 p-3 rounded-xs">
              <div>
                <span className="block text-[#ff8562] uppercase tracking-[0.05em] text-[8px] mb-0.5">Классификация</span>
                <span className="font-semibold text-white/90 truncate block">
                  {activeTab === "table" ? "Стол из слэба" : activeTab === "kitchen" ? "Гарнитур" : "Шкаф-купе"}
                </span>
              </div>
              <div className="border-x border-white/5 px-2">
                <span className="block text-[#ff8562] uppercase tracking-[0.05em] text-[8px] mb-0.5">Основа / Профили</span>
                <span className="font-semibold text-white/90 truncate block">
                  {activeTab === "table" ? selectedWood.name.split(" ")[1] : activeTab === "kitchen" ? selectedFacade.name.split(" ")[0] : selectedProfileColor.name.split(" ")[0]}
                </span>
              </div>
              <div className="pl-2">
                <span className="block text-[#ff8562] uppercase tracking-[0.05em] text-[8px] mb-0.5">Интеграции</span>
                <span className="font-semibold text-white/90 block truncate">
                  {activeTab === "table" ? (withEpoxy ? "Эпоксидный каньон" : "Без заливки") : activeTab === "kitchen" ? (needAppliances ? "С техникой" : "Без техники") : (withLed ? "С LED подсветкой" : "Без подсветки")}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Controls Side Panel */}
          <div className="lg:col-span-5 bg-[#181818] border border-white/10 p-6 md:p-8 rounded-sm">
            <h3 className="text-xl font-medium tracking-wide text-white mb-6 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#ff8562]" />
              Спецификация изделия
            </h3>

            {/* CASE 1: TABLES FOR CONTROLS */}
            {activeTab === "table" && (
              <div className="animate-fadeIn">
                {/* 1. Wood selection */}
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-3 font-mono">
                    1. Сорт ценной древесины (Слэб)
                  </label>
                  <div className="space-y-2.5">
                    {WOOD_OPTIONS.map((wood) => (
                      <button
                        key={wood.id}
                        type="button"
                        onClick={() => setSelectedWood(wood)}
                        className={`w-full p-3.5 text-left border flex items-center justify-between transition-all rounded-xs focus:outline-none cursor-pointer ${
                          selectedWood.id === wood.id
                            ? "border-[#ff8562] bg-[#ff8562]/5 text-white"
                            : "border-white/10 bg-black/10 hover:border-white/20 text-white/70"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white/20"
                              style={{ backgroundColor: wood.color }}
                            ></span>
                            <span className="font-medium text-sm">{wood.name}</span>
                          </div>
                          <p className="text-xs text-white/40 mt-1 pl-5 font-sans leading-relaxed">
                            {wood.desc}
                          </p>
                        </div>
                        {selectedWood.id === wood.id && (
                          <Check className="w-4 h-4 text-[#ff8562]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Epoxy River option */}
                <div className="mb-6 bg-black/20 p-4 border border-white/5 rounded-xs flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-white block">Стеклянная река из смолы (Эпоксидный каньон)</span>
                    <span className="text-xs text-white/40 font-sans block mt-0.5">
                      Текстурный средний срез с герметичной прозрачной смолой (+25,000 ₽)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWithEpoxy(!withEpoxy)}
                    className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
                      withEpoxy ? "bg-[#ff8562]" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                        withEpoxy ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Diameter sliders */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-white/50 uppercase tracking-wider font-mono">Длина столешницы (L)</span>
                      <span className="text-white font-mono font-bold">{tableLength} см</span>
                    </div>
                    <input
                      type="range"
                      min="120"
                      max="240"
                      step="10"
                      value={tableLength}
                      onChange={(e) => setTableLength(Number(e.target.value))}
                      className="w-full accent-[#ff8562] bg-[#303030] h-1.5 appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-white/50 uppercase tracking-wider font-mono">Ширина столешницы (W)</span>
                      <span className="text-white font-mono font-bold">{tableWidth} см</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="120"
                      step="5"
                      value={tableWidth}
                      onChange={(e) => setTableWidth(Number(e.target.value))}
                      className="w-full accent-[#ff8562] bg-[#303030] h-1.5 appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Base leg choices */}
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-3 font-mono">
                    Опорные Ножки
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {LEG_DESIGNS.map((leg) => (
                      <button
                        key={leg.id}
                        type="button"
                        onClick={() => setSelectedLeg(leg)}
                        className={`p-3 text-left border flex flex-col justify-between transition-all rounded-xs focus:outline-none cursor-pointer ${
                          selectedLeg.id === leg.id
                            ? "border-[#ff8562] bg-[#ff8562]/5 text-white"
                            : "border-white/10 bg-black/10 hover:border-white/20 text-white/60"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-semibold text-xs text-white/90">{leg.name}</span>
                          <span className="text-xs text-[#ff8562] font-mono">+{leg.price.toLocaleString("ru-RU")} ₽</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CASE 2: KITCHENS CONTROLS */}
            {activeTab === "kitchen" && (
              <div className="animate-fadeIn space-y-6">
                
                {/* 1. Layout choice */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-3 font-mono">
                    1. Конфигурация планировки
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {KITCHEN_LAYOUTS.map((layout) => (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => setSelectedLayout(layout)}
                        className={`w-full p-3 text-left border flex items-center justify-between transition-all rounded-xs focus:outline-none cursor-pointer ${
                          selectedLayout.id === layout.id
                            ? "border-[#ff8562] bg-[#ff8562]/5 text-white"
                            : "border-white/10 bg-black/10 hover:border-white/20 text-white/70"
                        }`}
                      >
                        <div>
                          <span className="font-medium text-xs block text-white">{layout.name}</span>
                          <span className="text-[10px] text-white/40 block mt-0.5 leading-tight">{layout.desc}</span>
                        </div>
                        {selectedLayout.id === layout.id && <Check className="w-3.5 h-3.5 text-[#ff8562]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Facade choice */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-3 font-mono">
                    2. Материал фасадов кухни
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {KITCHEN_FACADES.map((facade) => (
                      <button
                        key={facade.id}
                        type="button"
                        onClick={() => setSelectedFacade(facade)}
                        className={`p-3 text-left border flex flex-col transition-all rounded-xs focus:outline-none cursor-pointer ${
                          selectedFacade.id === facade.id
                            ? "border-[#ff8562] bg-[#ff8562]/5 text-white"
                            : "border-white/10 bg-black/10 hover:border-white/20 text-white/60"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-semibold text-xs text-white/90 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: facade.color }}></span>
                            {facade.name}
                          </span>
                          <span className="text-xs text-[#ff8562] font-mono">+{facade.price.toLocaleString("ru-RU")} ₽</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Slider Kitchen Width */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-white/50 uppercase tracking-wider font-mono">3. Длина гарнитура кухонного</span>
                    <span className="text-white font-mono font-bold">{kitchenWidth} см</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="500"
                    step="20"
                    value={kitchenWidth}
                    onChange={(e) => setKitchenWidth(Number(e.target.value))}
                    className="w-full accent-[#ff8562] bg-[#303030] h-1.5 appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/30 font-mono mt-1">
                    <span>2.0м (компакт)</span>
                    <span>3.6м (стандарт)</span>
                    <span>5.0м (для коттеджа)</span>
                  </div>
                </div>

                {/* 4. Complete set built-in appliances */}
                <div className="bg-black/20 p-4 border border-white/5 rounded-xs flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-white block">Набор встраиваемой техники</span>
                    <span className="text-xs text-white/40 font-sans block mt-0.5">
                      Духовка, варочная панель, вытяжка Blum/Krona под ключ (+120,000 ₽)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNeedAppliances(!needAppliances)}
                    className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
                      needAppliances ? "bg-[#ff8562]" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                        needAppliances ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

              </div>
            )}

            {/* CASE 3: WARDROBE CONTROLS */}
            {activeTab === "wardrobe" && (
              <div className="animate-fadeIn space-y-6">
                
                {/* 1. Doors material */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-3 font-mono">
                    1. Материал раздвижных полотен
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {WARDROBE_MATERIALS.map((mat) => (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => setSelectedWardrobeMat(mat)}
                        className={`w-full p-3 text-left border flex items-center justify-between transition-all rounded-xs focus:outline-none cursor-pointer ${
                          selectedWardrobeMat.id === mat.id
                            ? "border-[#ff8562] bg-[#ff8562]/5 text-white"
                            : "border-white/10 bg-black/10 hover:border-white/20 text-white/75"
                        }`}
                      >
                        <div>
                          <span className="font-semibold text-xs text-white flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: mat.color }}></span>
                            {mat.name}
                          </span>
                          <span className="text-[10px] text-white/40 block mt-0.5 leading-tight">{mat.desc}</span>
                        </div>
                        <span className="text-xs text-[#ff8562] font-mono shrink-0">+{mat.price.toLocaleString("ru-RU")} ₽</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Profile Colors */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-3 font-mono">
                    2. Цвет и марка алюминиевых профилей дверей
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {PROFILE_COLORS.map((profile) => (
                      <button
                        key={profile.id}
                        type="button"
                        onClick={() => setSelectedProfileColor(profile)}
                        className={`p-2.5 text-left text-xs border flex items-center justify-between transition-all rounded-xs focus:outline-none cursor-pointer ${
                          selectedProfileColor.id === profile.id
                            ? "border-[#ff8562] bg-[#ff8562]/5 text-white"
                            : "border-white/10 bg-black/10 hover:border-white/20 text-white/60"
                        }`}
                      >
                        <span>{profile.name}</span>
                        {selectedProfileColor.id === profile.id && <Check className="w-3.5 h-3.5 text-[#ff8562]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Slider wardrobe width */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-white/50 uppercase tracking-wider font-mono">3. Полная ширина шкафа / гардеробной</span>
                    <span className="text-white font-mono font-bold">{wardrobeWidth} см</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="400"
                    step="10"
                    value={wardrobeWidth}
                    onChange={(e) => setWardrobeWidth(Number(e.target.value))}
                    className="w-full accent-[#ff8562] bg-[#303030] h-1.5 appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/30 font-mono mt-1">
                    <span>1.5м (компакт)</span>
                    <span>2.4м (стандарт)</span>
                    <span>4.0м (для спальни)</span>
                  </div>
                </div>

                {/* 4. Shelves built-in lighting */}
                <div className="bg-black/20 p-4 border border-white/5 rounded-xs flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-white block">Внутренняя LED подсветка</span>
                    <span className="text-xs text-white/40 font-sans block mt-0.5">
                      Светодиодный врезной профиль с бесконтактными датчиками (+18,000 ₽)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWithLed(!withLed)}
                    className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer ${
                      withLed ? "bg-[#ff8562]" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                        withLed ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

              </div>
            )}

            {/* Price section & execution terms for config */}
            <div className="bg-[#1c1c1c] border border-white/10 p-5 rounded-xs my-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block font-mono">
                  Предварительная оценка
                </span>
                <span className="text-2xl font-semibold text-[#ff8562] font-mono block mt-1">
                  {totalCost.toLocaleString("ru-RU")} <span className="text-base text-white font-sans">₽</span>
                </span>
                <span className="text-[9px] text-white/35 font-sans block mt-0.5">
                  Включает конструкторские замеры и чертежи КМ
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-green-500 font-medium block">✓ Готов расчет</span>
                <span className="text-[10px] text-white/40 font-mono block mt-0.5">
                  Срок цеха: {activeTab === "table" ? "20" : activeTab === "kitchen" ? "40" : "30"} дн.
                </span>
              </div>
            </div>

            {/* Fast specification inquiry form */}
            <form onSubmit={handleSubmitProposal} className="space-y-3.5 border-t border-white/5 pt-5">
              <span className="block text-xs font-semibold text-white/80 font-serif">
                Получить коммерческое предложение и CAD-проект
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Ваше Имя"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="bg-black/40 border border-white/10 text-white p-3 text-xs focus:ring-1 focus:ring-[#ff8562] focus:border-[#ff8562] focus:outline-none rounded-xs w-full font-serif"
                />
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="bg-black/40 border border-white/10 text-white p-3 text-xs focus:ring-1 focus:ring-[#ff8562] focus:border-[#ff8562] focus:outline-none rounded-xs w-full font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={formIsSubmitting}
                className="w-full btn-primary font-serif select-none h-12 flex items-center justify-center gap-2"
              >
                {formIsSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-black rounded-full animate-spin"></span>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Отправить спецификацию</span>
                  </>
                )}
              </button>
            </form>

          </div>
          
        </div>

      </div>
    </section>
  );
}
