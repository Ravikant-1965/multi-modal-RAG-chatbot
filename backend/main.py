from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from simple_ai_assistant import get_ai_response

app = FastAPI()

# Allow React (running on localhost:5173) to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageRequest(BaseModel):
    message: str

@app.post("/api/chat")
def chat_endpoint(req: MessageRequest):
    reply = get_ai_response(req.message)
    return {"reply": reply}