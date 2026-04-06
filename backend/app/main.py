from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.langgraph_flow import graph_app

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

notes = []

class NoteCreate(BaseModel):
    title: str
    content: str
class AskRequest(BaseModel):
    note_id: int
    question: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/notes/")
def get_notes():
    return notes

@app.post("/notes/")
def create_note(note: NoteCreate):
    new_note = {
        "id": len(notes) + 1,
        "title": note.title,
        "content": note.content,
        "created_at": "now"
    }
    notes.append(new_note)
    return new_note

@app.post("/ask")
def ask_question(payload: AskRequest):
    selected_note = next((note for note in notes if note["id"] == payload.note_id), None)

    if not selected_note:
        return {"answer": "Note not found"}

    result = graph_app.invoke({
        "note_content": selected_note["content"],
        "question": payload.question,
        "answer": ""
    })

    return {"answer": result["answer"]}