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
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

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

  const askQuestion = async () => {
    if (!selectedNoteId) {
      alert("Please select a note first");
      return;
    }

    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    try {
      const res = await api.post("/ask", {
        note_id: selectedNoteId,
        question,
      });

      console.log("Ask response:", res.data);
      setAnswer(res.data.answer);
    } catch (err) {
      console.error("Error asking question:", err);
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
            onClick={() => setSelectedNoteId(note.id)}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 12,
              cursor: "pointer",
              backgroundColor:
                selectedNoteId === note.id ? "#2a2a2a" : "transparent",
            }}
          >
            <strong>{note.title}</strong>
            <p>{note.content}</p>
          </div>
))
      )}

      <h2>Ask a Question</h2>

      {selectedNoteId ? (
        <>
          <p>Selected Note ID: {selectedNoteId}</p>

          <input
            type="text"
            placeholder="Ask something about the selected note"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
              fontSize: 16,
            }}
          />

          <button onClick={askQuestion} style={{ marginBottom: 20 }}>
            Ask
          </button>

          <div
            style={{
              border: "1px solid #ccc",
              padding: 12,
              minHeight: 60,
            }}
          >
            <strong>Answer:</strong>
            <p>{answer || "No answer yet"}</p>
          </div>
        </>
      ) : (
        <p>Select a note first</p>
      )}
    </div>
  );
}
