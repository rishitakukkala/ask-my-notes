import os
from typing import TypeDict

from dotenv import load_dotenv
from lang_graph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

load_dotenv()

class GraphState(TypeDict):
    note_id: int
    question: str
    answer: str

llm = ChatOpenAI(model="gpt-3.5-turbo", api_key=os.getenv("OPENAI_API_KEY"))

