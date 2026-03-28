import { useEffect, useState } from "react";
import { api } from "./api";

type Note = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes/");
      console.log("API response:", res.data);
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  const createNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter both title and content");
      return;
    }

    try {
      const res = await api.post("/notes/", {
        title,
        content,
      });

      console.log("Created note:", res.data);

      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>AskMyNotes</h1>

      <h2>Create Note</h2>
      <input
        type="text"
        placeholder="Enter note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          fontSize: 16,
        }}
      />

      <textarea
        placeholder="Enter note content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          fontSize: 16,
        }}
      />

      <button onClick={createNote} style={{ marginBottom: 20 }}>
        Save Note
      </button>

      <h2>Notes</h2>
      <button onClick={fetchNotes} style={{ marginBottom: 16 }}>
        Refresh Notes
      </button>

      {notes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 12,
            }}
          >
            <strong>{note.title}</strong>
            <p>{note.content}</p>
          </div>
        ))
      )}
    </div>
  );
}