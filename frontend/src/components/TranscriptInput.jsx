import React from 'react'

const SAMPLE_TRANSCRIPT = `Karthik? Haan, he is good. Very sincere boy. Comes on time, leaves on time — actually he stays late most days, I don't ask him to. He's always on the floor. He's not one of those people who sits in the office and sends emails. He's hands-on.

What does he do? He helps me with production tracking. Earlier I used to maintain everything in my head — how many pieces came off each machine, what's the rejection rate, what's pending for dispatch. Now Karthik maintains a sheet. Every evening he updates it and sends it to me on WhatsApp. Very useful. I look at it every morning before the shift meeting.

He also handles a lot of the coordination. When we have quality complaints from Tier 1 — they send an email, sometimes call directly — Karthik takes the first call. He notes down the complaint, talks to the QC team, and gives me a summary. Earlier I used to handle all of this myself. Big relief.

The new drum brake line — he's been involved from the beginning. He helped set up the machine layout. He did a study on cycle times and suggested we move the deburring station closer to the CNC machines. Good idea. We did it. Saved maybe 10 minutes per batch in material handling.

Any complaints? No, not really. Sometimes he asks too many questions — like he wants to understand everything before doing it. Sometimes in a factory you just need to do it and learn by doing. But this is a minor thing.

One thing — he doesn't really push back. If I tell him to do something, he does it. Even if it's not the best way. I wish he would tell me sometimes, 'Sir, I think we should do it differently.' But maybe he's still new. He'll get there.

Overall I'm happy. He's become part of the team. The workers on the floor know him. He speaks to them in Marathi — that helps. If you asked them, they would say he's one of us.`

export default function TranscriptInput({ transcript, setTranscript, onAnalyze, loading, error }) {
  const charCount = transcript.length
  const canAnalyze = transcript.trim().length >= 50 && !loading

  function loadSample() {
    setTranscript(SAMPLE_TRANSCRIPT)
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Paste Supervisor Transcript</h1>
        <p className="text-slate-500 text-sm">
          The intern's call recording or notes from a supervisor interview
        </p>
      </div>

      {/* Textarea card */}
      <div
        className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)' }}
      >
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="ml-2 text-xs text-slate-400 font-mono">supervisor-transcript.txt</span>
        </div>
        <textarea
          id="transcript-input"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste the supervisor's transcript here — their exact words from the call..."
          disabled={loading}
          style={{
            width: '100%',
            minHeight: '320px',
            padding: '20px',
            fontFamily: "'SF Mono', 'Fira Code', 'Courier New', monospace",
            fontSize: '0.875rem',
            lineHeight: '1.7',
            color: '#334155',
            background: 'white',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
          }}
        />
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {charCount > 0 ? (
              <>
                <span className="font-medium text-slate-600">{charCount.toLocaleString()}</span> characters
              </>
            ) : (
              'No text yet'
            )}
          </span>
          {charCount > 50 && (
            <span className="text-xs text-slate-400">
              ⏱ ~25 sec analysis time
            </span>
          )}
        </div>
      </div>

      {/* Error box */}
      {error && (
        <div
          className="mt-4 rounded-lg px-4 py-3 flex items-start gap-3"
          style={{ background: '#fef2f2', border: '1px solid #fecaca' }}
          role="alert"
        >
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
          <div>
            <p className="text-sm font-semibold text-red-700">Analysis Failed</p>
            <p className="text-sm text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-6">
        <button
          id="load-sample-btn"
          onClick={loadSample}
          disabled={loading}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1.5px solid #cbd5e1',
            background: 'white',
            color: '#475569',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        >
          Load Sample Transcript
        </button>

        <button
          id="run-analysis-btn"
          onClick={onAnalyze}
          disabled={!canAnalyze}
          style={{
            padding: '10px 24px',
            borderRadius: '8px',
            border: 'none',
            background: canAnalyze ? '#2563eb' : '#94a3b8',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: canAnalyze ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: canAnalyze ? '0 1px 3px rgba(37,99,235,0.4)' : 'none',
          }}
        >
          {loading ? (
            <>
              <Spinner />
              Analyzing transcript...
            </>
          ) : (
            <>
              Run Analysis ▶
            </>
          )}
        </button>
      </div>

      {/* Loading message */}
      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
          <Spinner />
          <span>Analyzing transcript... This takes 20–40 seconds</span>
        </div>
      )}

      {/* Tip box */}
      {!loading && transcript.trim().length === 0 && (
        <div
          className="mt-8 rounded-lg px-5 py-4"
          style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
        >
          <p className="text-sm font-semibold text-blue-700 mb-1">💡 How to use Trinethra</p>
          <ol className="text-sm text-blue-600 list-decimal list-inside space-y-1">
            <li>Paste the supervisor's raw interview notes or call transcript above</li>
            <li>Click "Run Analysis" — the AI will extract evidence and score the Fellow</li>
            <li>Review every finding carefully — all output is an AI draft</li>
            <li>Toggle Edit Mode to correct any field before finalizing</li>
          </ol>
        </div>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <svg
      style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite', flexShrink: 0 }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        style={{ opacity: 0.75 }}
      />
    </svg>
  )
}
