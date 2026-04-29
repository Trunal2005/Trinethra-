# Trinethra — Supervisor Feedback Analyzer

> **Built for DeepThought CultureTech Ventures**  
> An AI-assisted tool that helps psychology interns turn raw supervisor interview transcripts into structured, evidence-backed performance assessments of DT Fellows.

---

## What is Trinethra

Trinethra is an internal assessment aid — not an automated decision-maker. A psychology intern pastes a supervisor's raw transcript (from a call recording or interview notes), clicks **Run Analysis**, and receives:

- **Rubric Score (1–10)** with band classification and confidence rating
- **Evidence Cards** — direct quotes from the transcript tagged by dimension and sentiment
- **KPI Coverage Map** — maps the Fellow's work to the 8 business KPIs (lead generation, NPS, TAT, quality, etc.)
- **Gap Analysis** — flags which of the 4 assessment dimensions the transcript didn't adequately cover
- **Suggested Follow-up Questions** — targeted questions for the next supervisor call

Every output is clearly marked as an **AI-generated draft**. The intern must review, edit (via Edit Mode), and confirm every finding before it enters any official record.

---

## Architecture

```
[Browser]
    │
    │  HTTP (port 5173)
    ▼
[React Frontend — Vite]         ← http://localhost:5173
    │
    │  POST /api/analyze  (port 8000)
    ▼
[FastAPI Backend — Python]      ← http://localhost:8000
    │
    │  POST /api/generate  (port 11434)
    ▼
[Ollama LLM — llama3.2]        ← http://localhost:11434
```

**Two LLM calls per analysis:**
1. **Call 1** → Evidence extraction + Rubric Score + KPI Mapping
2. **Call 2** → Gap Analysis + Follow-up Question generation

Results are merged server-side and returned as a single JSON response.

---

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- [Ollama](https://ollama.com) installed

### Step 1 — Install and start Ollama

Download Ollama from [https://ollama.com](https://ollama.com) and install it.

```bash
# Pull the llama3.2 model (one-time, ~2GB download)
ollama pull llama3.2

# Start the Ollama server (keep this terminal open)
ollama serve
```

Verify Ollama is running:
```bash
curl http://localhost:11434/api/tags
```

### Step 2 — Set up the backend

```bash
cd trinethra/backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3 — Start the backend server

```bash
# From trinethra/backend/
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.  
Health check: `http://localhost:8000/health`

### Step 4 — Set up the frontend

```bash
cd trinethra/frontend

# Install Node dependencies
npm install
```

### Step 5 — Start the frontend dev server

```bash
# From trinethra/frontend/
npm run dev
```

### Step 6 — Open the app

Navigate to **[http://localhost:5173](http://localhost:5173)** in your browser.

You should see the Trinethra sidebar with the transcript input view. Click **"Load Sample Transcript"** to try it immediately with Karthik's pre-loaded transcript.

---

## Model Choice — Why llama3.2

`llama3.2` (3B parameter model) was chosen for three reasons:

1. **Local execution** — No API keys, no data leaves the machine. Supervisor transcripts contain sensitive internal business information about DT Fellows and their host companies. Running locally keeps this data private.
2. **JSON instruction-following** — llama3.2 reliably follows structured output instructions when the prompt is explicit. With the retry logic in `analyzer.py`, malformed responses are caught and re-prompted.
3. **Speed vs. quality tradeoff** — At 3B parameters, inference runs in 20–40 seconds on a modern CPU without a GPU. For an internal tool used a few dozen times per week, this is acceptable. A 7B or 13B model would give richer analysis but at 2–4× the latency.

---

## Design Challenges Tackled

### Challenge 1: One Prompt vs. Many — Why Two Separate LLM Calls

A single prompt asking for evidence + score + KPI mapping + gaps + follow-up questions consistently produced truncated or malformed JSON — the context was too long and the model would "forget" parts of the schema midway.

Splitting into two focused calls solved this:
- **Call 1** is depth-first: extract evidence, reason about the score, map KPIs.
- **Call 2** is gap-first: check coverage of each dimension, then generate targeted questions.

Each call has a shorter, cleaner schema to fill, which dramatically improved JSON reliability.

### Challenge 2: Structured Output Reliability — The JSON Retry Logic

Local LLMs frequently wrap JSON in markdown fences (` ```json ... ``` `) or add explanatory preamble before the `{`. The `extract_json()` function in `analyzer.py` handles both cases:

1. Strips markdown code block delimiters if present
2. Uses `str.find("{")` and `str.rfind("}")` to locate the JSON object boundaries
3. If `json.loads()` still fails, a retry prompt is sent with an explicit instruction: *"Return ONLY the JSON object. Do not write anything before or after the JSON."*

This two-layer approach (stripping + retry) brings reliability from ~60% to ~95%+ across runs.

### Challenge 3: Showing Uncertainty — The Draft/Edit-Mode Design

The tool is designed to **suggest, not decide**. This is enforced through three UX mechanisms:

1. **Persistent warning banner** — The amber "⚠️ AI-generated draft" bar is always visible on the results page, anchored to the top, and cannot be dismissed.
2. **Confidence rating** — Every score carries a `high / medium / low` confidence label. Low confidence is displayed in red to prompt caution.
3. **Edit Mode** — Every text field (justification, evidence interpretation) becomes an editable textarea. The rubric score gets a slider. This makes it mechanically easy for the intern to override the AI's output before finalizing.

---

## Product Decisions (MVP Tradeoffs)

| Decision | Rationale |
|---|---|
| No database | Analyses are session-only. Avoids schema design and migration complexity for an MVP. |
| No authentication | Internal tool — single-team use. Adding auth would require user management overhead. |
| Two LLM calls vs. streaming | Simpler to implement and test. Streaming would feel faster but complicates state management. |
| Tailwind CSS | Rapid UI iteration with utility classes. No custom CSS framework overhead. |
| Hardcoded sample transcript | Makes onboarding instant — intern can see a full working example without needing a real transcript. |
| `llama3.2` not `gpt-4` | Privacy (transcripts are sensitive), cost (zero API fees), and offline capability. |

---

## What I'd Improve With More Time

1. **Side-by-side view** — Split-pane layout: transcript on the left, analysis on the right. As the intern reads the transcript, the relevant evidence card highlights on the right.

2. **Quote highlighting** — Click an evidence card → the source quote becomes highlighted (yellow background) in the original transcript text. Requires mapping quote offsets into the source string.

3. **Export as PDF** — "Finalize & Export" button that generates a clean PDF of the completed (intern-edited) assessment. Libraries: `react-pdf` or a server-side `weasyprint` call.

4. **PostgreSQL storage** — Store each completed assessment with timestamps, transcript hash, and intern ID. Enables:
   - Historical lookup ("what did we assess for Karthik last month?")
   - Score calibration across Fellows

5. **Score calibration dashboard** — Show where this Fellow sits relative to the full cohort. A histogram of scores across all Fellows, with the current score highlighted, would help interns calibrate against "is 6 actually good for this company type?"

6. **Structured transcript templates** — Instead of a raw paste box, a guided form: *"What does the Fellow do day-to-day?"*, *"Any specific achievements?"*, *"Any concerns?"*. Reduces variance in transcript quality and improves LLM analysis accuracy.

7. **Multi-supervisor triangulation** — Allow pasting 2–3 supervisor transcripts for the same Fellow and ask the LLM to identify agreements and contradictions across accounts.
