from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import TranscriptRequest, AnalysisResponse
from analyzer import analyze_transcript

app = FastAPI(title="Trinethra API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "model": "llama3.2"}


@app.post("/api/analyze")
async def analyze(request: TranscriptRequest):
    if not request.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript cannot be empty")
    if len(request.transcript.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Transcript too short to analyze — paste at least a few sentences from the supervisor interview."
        )
    try:
        result = await analyze_transcript(request.transcript)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
