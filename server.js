import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

let notes = [];
let idCounter = 1;

// 🧾 GET all notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// 📝 POST new note
app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ error: "Missing fields" });

  const note = { id: idCounter++, title, content, createdAt: new Date() };
  notes.push(note);
  res.json({ success: true, note });
});

// ❌ DELETE note by ID
app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = notes.length;
  notes = notes.filter((n) => n.id !== id);

  if (notes.length === initialLength) {
    return res.status(404).json({ error: "Note not found" });
  }

  res.json({ success: true, message: "Note deleted successfully" });
});

// 🧠 POST summarize (mock AI)
app.post("/summarize", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  const summary = `🧠 AI Summary: ${text
    .split(" ")
    .slice(0, 10)
    .join(" ")}... (summary example)`;

  res.json({ summary });
});

// 🧱 Error handler for bad JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});

// 🏠 Fallback route (for frontend)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🚀 Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
});
