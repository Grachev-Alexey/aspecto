import pool from "./db";

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'product',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'kitchen',
    image TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    materials JSONB NOT NULL DEFAULT '[]',
    dimensions TEXT NOT NULL DEFAULT '',
    price_estimate TEXT NOT NULL DEFAULT '',
    specs JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS materials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'wood',
    image TEXT NOT NULL DEFAULT '',
    origin TEXT NOT NULL DEFAULT '',
    finish_type TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT '',
    comments TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    selected_table JSONB,
    showroom_booking JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

const SEED_PRODUCTS = [
  {
    id: "kitchen-nordic-shadow",
    title: "Кухонный гарнитур «Аспекто Графит»",
    category: "kitchen",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200",
    description: "Минималистичный кухонный гарнитур в ультраматовом графитовом исполнении. Скрытые системы профилей, интегрированная умная подсветка рабочих зон и фасады из защищенного нанотехнологичного пластика.",
    materials: ["Премиальный МДФ", "Натуральный шпон ясеня", "Кварцевый агломерат"],
    dimensions: "3800 x 2400 x 600 мм (любые размеры под заказ)",
    price_estimate: "от 450 000 ₽",
    specs: { hardware: "Blum Legrabox (Австрия) / Т-Банк Лизинг", facade: "МДФ в эмали + Шпон ясеня (выбор из 500+ цветов)", countertop: "Кварцевый агломерат повышенной прочности", leadTime: "35 рабочих дней" }
  },
  {
    id: "kitchen-brut-oak",
    title: "Кухня-остров «Аспекто Сибирский Дуб»",
    category: "kitchen",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
    description: "Премиальная кухня с массивным островом из натурального сибирского дуба глубокого радиального распила. Скрытая зона пеналов со сдвижной фурнитурой.",
    materials: ["Массив дуба", "Нержавеющая сталь", "Итальянский шпон элит-класса"],
    dimensions: "4200 x 2100 x 900 мм (любые размеры под заказ)",
    price_estimate: "от 680 000 ₽",
    specs: { hardware: "Hettich Sensys + Blum скрытого монтажа", facade: "Шпон дуба со сквозной текстурой под защитным маслом", countertop: "Горячекатаная сталь или искусственный камень", leadTime: "45 рабочих дней" }
  },
  {
    id: "living-boucle-sofa",
    title: "Модульный диван «Аспекто Букле»",
    category: "living",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200",
    description: "Низкопосадочный ортопедический модульный диван в износостойкой обивке из альпийского букле.",
    materials: ["Премиальное букле", "Каркас из березовой фанеры ГОСТ", "Гусиный пух-перо"],
    dimensions: "3200 x 1100 x 680 мм",
    price_estimate: "от 240 000 ₽",
    specs: { hardware: "Усиленные скрытые крепления стальных рам", facade: "Высокопрочная грязеотталкивающая ткань букле", countertop: "Нет", leadTime: "25 рабочих дней" }
  },
  {
    id: "living-walnut-table",
    title: "Обеденный стол-слэб «Аспекто Горный Орех»",
    category: "living",
    image: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80&w=1200",
    description: "Роскошный обеденный стол из цельного слэба кавказского ореха с сохраненным живым краем (live edge).",
    materials: ["Горный кавказский орех", "Полимерная смола", "Сталь с порошковой покраской"],
    dimensions: "2200 x 1000 x 750 мм",
    price_estimate: "от 180 000 ₽",
    specs: { hardware: "Стальные прочные опоры ручной работы", facade: "Слэб толщиной 70мм высшего сорта", countertop: "Натуральное защитное покрытие (Германия)", leadTime: "20 рабочих дней" }
  },
  {
    id: "wardrobe-architect",
    title: "Шкаф-гардеробная «Аспекто Люкс»",
    category: "wardrobe",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=1200",
    description: "Встроенная гардеробная система со стеклянными тонированными фасадами в тонкой алюминиевой раме.",
    materials: ["Тонированное стекло", "Анодированный алюминий", "Натуральная или эко-кожа"],
    dimensions: "3000 x 2600 x 600 мм",
    price_estimate: "от 380 000 ₽",
    specs: { hardware: "Salice Air скрытая (Италия)", facade: "Стекло Stopsol Bronze + Смарт-профиль", countertop: "Полки со встроенным диодным неоновым профилем", leadTime: "30 рабочих дней" }
  },
  {
    id: "premium-monolith-console",
    title: "Подвесная консоль-комод «Аспекто Монолит»",
    category: "premium",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200",
    description: "Дизайнерский подвесной комод с выразительным трехмерным фрезерованным фасадом из американского ореха.",
    materials: ["Американский орех", "Латунные вставки", "Тонированное зеркало"],
    dimensions: "1800 x 500 x 450 мм",
    price_estimate: "от 145 000 ₽",
    specs: { hardware: "Tiptronic Blum", facade: "Фрезерованный влагостойкий МДФ, шпонированный орехом", countertop: "Керамогранит или закаленное стекло", leadTime: "25 рабочих дней" }
  }
];

const SEED_MATERIALS = [
  {
    id: "oak-radial",
    name: "Радиальный горный дуб",
    category: "wood",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400",
    origin: "Алтайский край, Россия",
    finish_type: "Масло-воск Rubio Monocoat",
    description: "Прочная благородная древесина с красивыми сердцевинными лучами и выраженным рельефом после брашировки."
  },
  {
    id: "walnut-american",
    name: "Кавказский горный орех",
    category: "wood",
    image: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=400",
    origin: "Кавказ, Краснодарский край",
    finish_type: "Шелковисто-матовый лак Renner (Италия)",
    description: "Изысканный темный шоколадный оттенок со сложным волнообразным рисунком волокон."
  },
  {
    id: "boucle-alpine",
    name: "Букле премиум-класса WoolTouch",
    category: "fabric",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=400",
    origin: "Отечественный текстильный комбинат",
    finish_type: "Грязеотталкивающая защитная пропитка серии EasyClean",
    description: "Фактурная ткань с высоким содержанием шерсти (более 85 000 циклов истирания)."
  },
  {
    id: "brass-burnished",
    name: "Шлифованная патинированная латунь",
    category: "metal",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400",
    origin: "Урал, Россия",
    finish_type: "Защитный сверхтонкий матовый лак",
    description: "Декоративное ручное искусственное старение. Идеально дополняет фурнитуру, мебельные опоры и ручки."
  }
];

const SEED_LEADS = [
  {
    id: "lead-seed-1",
    name: "Дмитрий Назаров",
    phone: "+7 (916) 432-88-11",
    category: "Экскурсия на производство",
    comments: "Запись на субботу к Михаилу Гришину. Хочет посмотреть срез дикого дуба и обсудить угловую кухню.",
    status: "completed",
    selected_table: null,
    showroom_booking: null
  },
  {
    id: "lead-seed-2",
    name: "Екатерина П.",
    phone: "+7 (903) 124-55-90",
    category: "Расчет «Кухонный гарнитур Аспекто Графит»",
    comments: "Оформлена заявка на расчет индивидуальной кухни Аспекто Графит (ЖК 'Пресня').",
    status: "pending",
    selected_table: null,
    showroom_booking: null
  },
  {
    id: "lead-seed-3",
    name: "Артур (Королев Парк)",
    phone: "+7 (925) 789-33-44",
    category: "Конструктор стола из массива",
    comments: "Запрос на изготовление обеденного стола размером 2200х1000мм с прозрачной эпоксидной рекой.",
    status: "pending",
    selected_table: { woodType: "Кавказский Черный Орех", resinColor: "Кристально-голубая река", tableSize: "2200x1000x750", legsStyle: "Патинированная шлифованная латунь", price: "от 240 000 ₽" },
    showroom_booking: null
  }
];

const SEED_CATEGORIES = [
  { id: "kitchen", name: "Кухни", type: "product", sort_order: 1 },
  { id: "living", name: "Гостиные / Столы", type: "product", sort_order: 2 },
  { id: "wardrobe", name: "Гардеробные", type: "product", sort_order: 3 },
  { id: "premium", name: "Премиум", type: "product", sort_order: 4 },
  { id: "wood", name: "Дерево", type: "material", sort_order: 1 },
  { id: "fabric", name: "Ткань", type: "material", sort_order: 2 },
  { id: "metal", name: "Металл", type: "material", sort_order: 3 },
  { id: "stone", name: "Камень", type: "material", sort_order: 4 },
];

export async function initDatabase(): Promise<void> {
  console.log("[DB] Checking schema...");

  await pool.query(SCHEMA);
  console.log("[DB] Schema OK");

  const { rows: catRows0 } = await pool.query("SELECT COUNT(*)::int AS cnt FROM categories");
  if (catRows0[0].cnt === 0) {
    console.log("[DB] Seeding categories...");
    for (const c of SEED_CATEGORIES) {
      await pool.query(
        "INSERT INTO categories (id, name, type, sort_order) VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING",
        [c.id, c.name, c.type, c.sort_order]
      );
    }
    console.log(`[DB] Seeded ${SEED_CATEGORIES.length} categories`);
  }

  const { rows: productRows } = await pool.query("SELECT COUNT(*)::int AS cnt FROM products");
  if (productRows[0].cnt === 0) {
    console.log("[DB] Seeding products...");
    for (const p of SEED_PRODUCTS) {
      await pool.query(
        `INSERT INTO products (id, title, category, image, description, materials, dimensions, price_estimate, specs)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id) DO NOTHING`,
        [p.id, p.title, p.category, p.image, p.description, JSON.stringify(p.materials), p.dimensions, p.price_estimate, JSON.stringify(p.specs)]
      );
    }
    console.log(`[DB] Seeded ${SEED_PRODUCTS.length} products`);
  }

  const { rows: matRows } = await pool.query("SELECT COUNT(*)::int AS cnt FROM materials");
  if (matRows[0].cnt === 0) {
    console.log("[DB] Seeding materials...");
    for (const m of SEED_MATERIALS) {
      await pool.query(
        `INSERT INTO materials (id, name, category, image, origin, finish_type, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING`,
        [m.id, m.name, m.category, m.image, m.origin, m.finish_type, m.description]
      );
    }
    console.log(`[DB] Seeded ${SEED_MATERIALS.length} materials`);
  }

  const { rows: leadRows } = await pool.query("SELECT COUNT(*)::int AS cnt FROM leads");
  if (leadRows[0].cnt === 0) {
    console.log("[DB] Seeding demo leads...");
    for (const l of SEED_LEADS) {
      await pool.query(
        `INSERT INTO leads (id, name, phone, category, comments, status, selected_table, showroom_booking)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
        [l.id, l.name, l.phone, l.category, l.comments, l.status,
         l.selected_table ? JSON.stringify(l.selected_table) : null,
         l.showroom_booking ? JSON.stringify(l.showroom_booking) : null]
      );
    }
    console.log(`[DB] Seeded ${SEED_LEADS.length} demo leads`);
  }

  console.log("[DB] Initialization complete");
}
