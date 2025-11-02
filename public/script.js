const API_URL = "http://127.0.0.1:3000"; // backend base URL

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const saveBtn = document.getElementById("save");
const summarizeBtn = document.getElementById("summarize");
const summaryBox = document.getElementById("summaryBox");
const summaryDiv = document.getElementById("summary");
const notesList = document.getElementById("notesList");

// 🧾 Load all notes
async function loadNotes() {
  try {
    const res = await fetch(`${API_URL}/notes`);
    const notes = await res.json();
    notesList.innerHTML = "";
    notes.forEach((n) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <b>${n.title}</b> - ${n.content.substring(0, 50)}...
        <button onclick="deleteNote(${n.id})">🗑️</button>
      `;
      notesList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading notes:", err);
  }
}

// ❌ Delete note
async function deleteNote(id) {
  try {
    await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" });
    loadNotes();
  } catch (err) {
    console.error("Error deleting note:", err);
  }
}

// 💾 Save note
saveBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title || !content) return alert("Enter both title and content!");

  try {
    await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    titleInput.value = "";
    contentInput.value = "";
    loadNotes();
  } catch (err) {
    console.error("Error saving note:", err);
  }
});

// 🧠 Summarize note content
summarizeBtn.addEventListener("click", async () => {
  const content = contentInput.value.trim();
  if (!content) return alert("Write something first!");

  summaryDiv.innerText = "Generating summary... ⏳";
  summaryBox.classList.remove("hidden");

  try {
    const res = await fetch(`${API_URL}/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content }),
    });

    // Safely parse JSON
    let data;
    try {
      data = await res.json();
    } catch {
      data = { summary: "⚠️ Server returned no data." };
    }

    summaryDiv.innerText = data.summary || "No summary generated.";
  } catch (err) {
    summaryDiv.innerText = "⚠️ Failed to connect to server.";
    console.error("Error summarizing:", err);
  }
});

// 🧭 Custom cursor
const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

document.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

loadNotes();
