from pydantic import BaseModel
from typing import List, Optional


class TranscriptRequest(BaseModel):
    transcript: str


class EvidenceItem(BaseModel):
    quote: str
    signal: str  # "positive", "negative", "neutral"
    dimension: str  # "execution", "systems_building", "kpi_impact", "change_management"
    interpretation: str


class KPIMapping(BaseModel):
    kpi: str  # one of the 8 KPI IDs
    evidence: str
    systemOrPersonal: str  # "system" or "personal"


class RubricScore(BaseModel):
    value: int  # 1-10
    label: str
    band: str  # "Need Attention", "Productivity", "Performance"
    justification: str
    confidence: str  # "high", "medium", "low"


class GapItem(BaseModel):
    dimension: str
    detail: str


class FollowUpQuestion(BaseModel):
    question: str
    targetGap: str
    lookingFor: str


class AnalysisResponse(BaseModel):
    score: RubricScore
    evidence: List[EvidenceItem]
    kpiMapping: List[KPIMapping]
    gaps: List[GapItem]
    followUpQuestions: List[FollowUpQuestion]
