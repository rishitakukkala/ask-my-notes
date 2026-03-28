from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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