import React, { useState } from 'react'
import TranscriptInput from './components/TranscriptInput.jsx'
import AnalysisOutput from './components/AnalysisOutput.jsx'

const API_BASE = 'http://127.0.0.1:8000'

export default function App() {
  const [transcript, setTranscript] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)

  const view = analysis ? 'results' : 'input'

  async function handleAnalyze() {
    if (!transcript.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || `Server error: ${res.status}`)
      }
      const data = await res.json()
      setAnalysis(data)
      setEditMode(false)
    } catch (err) {
      setError(err.message || 'Failed to connect to backend. Is the server running on port 8000?')
    } finally {
      setLoading(false)
    }
  }

  function handleBack() {
    setAnalysis(null)
    setError(null)
    setEditMode(false)
  }

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col flex-shrink-0"
        style={{
          width: '260px',
          background: '#0f172a',
          borderRight: '1px solid #1e293b',
          minHeight: '100vh',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {/* Logo area */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: '1.6rem' }}>👁</span>
            <span
              style={{
                color: '#f8fafc',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              Trinethra
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: '1.4', marginTop: '4px' }}>
            Supervisor Feedback Analyzer
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#1e293b', margin: '0 24px' }} />

        {/* Nav state indicator */}
        <nav className="px-4 mt-6 flex flex-col gap-1">
          <button
            onClick={handleBack}
            style={{
              background: view === 'input' ? '#1e293b' : 'transparent',
              color: view === 'input' ? '#e2e8f0' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 12px',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>📋</span> Transcript Input
          </button>
          <button
            disabled={!analysis}
            style={{
              background: view === 'results' ? '#1e293b' : 'transparent',
              color: !analysis ? '#334155' : view === 'results' ? '#e2e8f0' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 12px',
              textAlign: 'left',
              cursor: analysis ? 'pointer' : 'not-allowed',
              fontSize: '0.85rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>📊</span> Analysis Results
          </button>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer info */}
        <div className="px-6 pb-8">
          <div style={{ height: '1px', background: '#1e293b', marginBottom: '16px' }} />
          <p style={{ color: '#475569', fontSize: '0.72rem', lineHeight: '1.5' }}>
            ⚡ Powered by PDGMS
          </p>
          <p style={{ color: '#334155', fontSize: '0.7rem', marginTop: '2px' }}>
            DeepThought CultureTech Ventures
          </p>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto" style={{ background: '#f8fafc' }}>
        {view === 'input' ? (
          <TranscriptInput
            transcript={transcript}
            setTranscript={setTranscript}
            onAnalyze={handleAnalyze}
            loading={loading}
            error={error}
          />
        ) : (
          <AnalysisOutput
            analysis={analysis}
            onBack={handleBack}
            editMode={editMode}
            setEditMode={setEditMode}
            setAnalysis={setAnalysis}
          />
        )}
      </main>
    </div>
  )
}
