import express from "express";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";
import pool from "./db";
import { initDatabase } from "./init";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

if (!process.env.ADMIN_PASSWORD) {
  console.warn("[WARN] ADMIN_PASSWORD env var is not set — admin login will be disabled");
}
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

// ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Только изображения"));
  }
});

app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Файл не получен" });
    const sharp = (await import("sharp")).default;
    const maxWidth = parseInt(req.query.size as string) || 1200;
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
    const outPath = path.join(process.cwd(), "public", "uploads", filename);
    await sharp(req.file.buffer)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);
    res.json({ url: `/uploads/${filename}` });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ─── AUTH ────────────────────────────────────────────────────────────────────

app.post("/api/admin/login", (req, res) => {
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({ ok: false, message: "Переменная ADMIN_PASSWORD не задана на сервере" });
  }
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ ok: true, token: Buffer.from(ADMIN_PASSWORD).toString("base64") });
  } else {
    res.status(401).json({ ok: false, message: "Неверный пароль" });
  }
});

app.post("/api/admin/verify", (req, res) => {
  if (!ADMIN_PASSWORD) return res.json({ ok: false });
  const { token } = req.body;
  const valid = token === Buffer.from(ADMIN_PASSWORD).toString("base64");
  res.json({ ok: valid });
});

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

app.get("/api/categories", async (req, res) => {
  try {
    const type = req.query.type as string | undefined;
    const { rows } = await pool.query(
      type
        ? "SELECT id, name, type, sort_order FROM categories WHERE type=$1 ORDER BY sort_order, name"
        : "SELECT id, name, type, sort_order FROM categories ORDER BY type, sort_order, name",
      type ? [type] : []
    );
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const { id, name, type, sort_order } = req.body;
    if (!id || !name || !type) return res.status(400).json({ error: "id, name, type — обязательные поля" });
    const { rows } = await pool.query(
      "INSERT INTO categories (id, name, type, sort_order) VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO UPDATE SET name=$2 RETURNING *",
      [id, name, type, sort_order || 0]
    );
    res.json(rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/categories/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT COUNT(*) AS cnt FROM products WHERE category=$1", [req.params.id]
    );
    if (parseInt(rows[0].cnt) > 0) {
      return res.status(409).json({ error: "Категория используется товарами. Сначала удалите или переместите их." });
    }
    await pool.query("DELETE FROM categories WHERE id=$1", [req.params.id]);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

app.get("/api/products", async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const { rows } = await pool.query(
      category
        ? `SELECT id, title, category, image, description, materials, dimensions, price_estimate AS "priceEstimate", specs FROM products WHERE category=$1 ORDER BY created_at ASC`
        : `SELECT id, title, category, image, description, materials, dimensions, price_estimate AS "priceEstimate", specs FROM products ORDER BY created_at ASC`,
      category ? [category] : []
    );
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { id, title, category, image, description, materials, dimensions, priceEstimate, specs } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO products (id, title, category, image, description, materials, dimensions, price_estimate, specs) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
      [id, title, category, image || "", description || "", JSON.stringify(materials || []), dimensions || "", priceEstimate || "", JSON.stringify(specs || {})]
    );
    const r = rows[0];
    res.json({ ...r, priceEstimate: r.price_estimate });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { title, category, image, description, materials, dimensions, priceEstimate, specs } = req.body;
    const { rows } = await pool.query(
      "UPDATE products SET title=$1, category=$2, image=$3, description=$4, materials=$5, dimensions=$6, price_estimate=$7, specs=$8 WHERE id=$9 RETURNING *",
      [title, category, image || "", description || "", JSON.stringify(materials || []), dimensions || "", priceEstimate || "", JSON.stringify(specs || {}), req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    const r = rows[0];
    res.json({ ...r, priceEstimate: r.price_estimate });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id=$1", [req.params.id]);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ─── MATERIALS ────────────────────────────────────────────────────────────────

app.get("/api/materials", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, category, image, origin, finish_type AS \"finishType\", description FROM materials ORDER BY created_at ASC"
    );
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/materials", async (req, res) => {
  try {
    const { id, name, category, image, origin, finishType, description } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO materials (id, name, category, image, origin, finish_type, description) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [id, name, category, image || "", origin || "", finishType || "", description || ""]
    );
    const r = rows[0];
    res.json({ ...r, finishType: r.finish_type });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/materials/:id", async (req, res) => {
  try {
    const { name, category, image, origin, finishType, description } = req.body;
    const { rows } = await pool.query(
      "UPDATE materials SET name=$1, category=$2, image=$3, origin=$4, finish_type=$5, description=$6 WHERE id=$7 RETURNING *",
      [name, category, image || "", origin || "", finishType || "", description || "", req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    const r = rows[0];
    res.json({ ...r, finishType: r.finish_type });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/materials/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM materials WHERE id=$1", [req.params.id]);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ─── LEADS ────────────────────────────────────────────────────────────────────

app.get("/api/leads", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, phone, category, comments, status,
              selected_table AS "selectedTable",
              showroom_booking AS "showroomBooking",
              to_char(created_at, 'DD.MM, HH24:MI') AS "createdAt"
       FROM leads ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/leads", async (req, res) => {
  try {
    const { id, name, phone, category, comments, status, selectedTable, showroomBooking } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO leads (id, name, phone, category, comments, status, selected_table, showroom_booking)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *,
       to_char(created_at, 'DD.MM, HH24:MI') AS "createdAt"`,
      [id, name, phone || "", category || "", comments || "", status || "pending",
       selectedTable ? JSON.stringify(selectedTable) : null,
       showroomBooking ? JSON.stringify(showroomBooking) : null]
    );
    const r = rows[0];
    res.json({ ...r, selectedTable: r.selected_table, showroomBooking: r.showroom_booking });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/leads/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const { rows } = await pool.query(
      `UPDATE leads SET status=$1 WHERE id=$2 RETURNING *,
       to_char(created_at, 'DD.MM, HH24:MI') AS "createdAt"`,
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    const r = rows[0];
    res.json({ ...r, selectedTable: r.selected_table, showroomBooking: r.showroom_booking });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/leads/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM leads WHERE id=$1", [req.params.id]);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ─── START ────────────────────────────────────────────────────────────────────

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[Aspekto API] Running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[FATAL] Database initialization failed:", err.message);
    process.exit(1);
  });
