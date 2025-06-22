import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import { pool } from "./member_db.js";

const app = express();
app.use(cors());
app.use(express.json());

// Cek member dari barcode
app.post("/api/membership/check", async (req, res) => {
  const { barcode } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM members WHERE member_id = $1",
      [barcode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Member tidak ditemukan" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error /check:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Ambil semua data member
app.get("/api/membership/list", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM members");
    res.json(rows);
  } catch (err) {
    console.error("Error /list:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Tambah member
app.post("/api/membership/add", async (req, res) => {
  const { member_id, name, email, phone, point } = req.body;

  try {
    const [check] = await pool.query(
      "SELECT COUNT(*) AS count FROM members WHERE member_id = $1",
      [member_id]
    );
    if (check[0].count > 0) {
      return res.status(400).json({ error: "ID Member sudah ada" });
    }

    await pool.query(
      `INSERT INTO members (member_id, name, email, phone, point) VALUES ($1, $2, $3, $4, $5)`,
      [member_id, name, email, phone, point]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menambahkan member" });
  }
});

// Update member
app.put("/api/membership/update/:id", async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    await pool.query(
      `UPDATE members SET name = $1, email = $2, phone = $3 WHERE member_id = $4`,
      [name, email, phone, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error /update:", err);
    res.status(500).json({ error: "Gagal mengupdate member" });
  }
});

// Hapus member
app.delete("/api/membership/delete/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM members WHERE member_id = $1`, [
      req.params.id,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error /delete:", err);
    res.status(500).json({ error: "Gagal menghapus member" });
  }
});
// Tambah 1 point ke member
app.put("/api/membership/add-point/:id", async (req, res) => {
  try {
    await pool.query(
      `UPDATE members SET point = point + 1 WHERE member_id = $1`,
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Tambah point error:", err);
    res.status(500).json({ error: "Gagal tambah point" });
  }
});

// Reset point ke 0
app.put("/api/membership/reset-point/:id", async (req, res) => {
  try {
    await pool.query(`UPDATE members SET point = 0 WHERE member_id = $1`, [
      req.params.id,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error("Reset point error:", err);
    res.status(500).json({ error: "Gagal reset point" });
  }
});

export const handler = serverless(app);
