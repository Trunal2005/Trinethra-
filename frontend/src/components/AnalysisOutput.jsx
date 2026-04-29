import React, { useState } from 'react'
import EvidenceCard from './EvidenceCard.jsx'
import RubricScore from './RubricScore.jsx'
import KPIMapping from './KPIMapping.jsx'
import GapAnalysis from './GapAnalysis.jsx'
import FollowUpQuestions from './FollowUpQuestions.jsx'

const TABS = [
  { id: 'evidence', label: 'Evidence', countKey: 'evidence' },
  { id: 'kpi', label: 'KPI Mapping', countKey: 'kpiMapping' },
  { id: 'gaps', label: 'Gaps', countKey: 'gaps' },
  { id: 'followup', label: 'Follow-up Questions', countKey: 'followUpQuestions' },
]

function scoreColor(value) {
  if (value <= 3) return '#dc2626'
  if (value <= 6) return '#d97706'
  return '#16a34a'
}

function scoreBg(value) {
  if (value <= 3) return '#fef2f2'
  if (value <= 6) return '#fffbeb'
  return '#f0fdf4'
}

function confidenceStyle(conf) {
  const styles = {
    high:   { bg: '#dcfce7', color: '#15803d', label: '● High Confidence' },
    medium: { bg: '#fef9c3', color: '#854d0e', label: '◐ Medium Confidence' },
    low:    { bg: '#fee2e2', color: '#b91c1c', label: '○ Low Confidence' },
  }
  return styles[conf] || styles.medium
}

export default function AnalysisOutput({ analysis, onBack, editMode, setEditMode, setAnalysis }) {
  const [activeTab, setActiveTab] = useState('evidence')

  if (!analysis) return null

  const { score, evidence, kpiMapping, gaps, followUpQuestions } = analysis
  const confStyle = confidenceStyle(score?.confidence)

  function handleScoreChange(updatedScore) {
    setAnalysis((prev) => ({ ...prev, score: updatedScore }))
  }

  function counts() {
    return {
      evidence: evidence?.length || 0,
      kpiMapping: kpiMapping?.length || 0,
      gaps: gaps?.length || 0,
      followUpQuestions: followUpQuestions?.length || 0,
    }
  }

  const c = counts()

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Top bar ── */}
      <div
        style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          id="back-to-transcript-btn"
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#2563eb',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
            padding: '6px 10px',
            borderRadius: '6px',
          }}
        >
          ← Back to Transcript
        </button>

        {/* Edit Mode toggle */}
        <label
          htmlFor="edit-mode-toggle"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#475569' }}>Edit Mode</span>
          <div
            style={{
              position: 'relative',
              width: '44px',
              height: '24px',
            }}
          >
            <input
              id="edit-mode-toggle"
              type="checkbox"
              checked={editMode}
              onChange={(e) => setEditMode(e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
            />
            <div
              onClick={() => setEditMode(!editMode)}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '12px',
                background: editMode ? '#2563eb' : '#cbd5e1',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: editMode ? '23px' : '3px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  transition: 'left 0.2s',
                }}
              />
            </div>
          </div>
          {editMode && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#2563eb',
                background: '#eff6ff',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              EDITING
            </span>
          )}
        </label>
      </div>

      {/* ── AI Draft Warning ── */}
      <div
        style={{
          background: '#fffbeb',
          borderBottom: '1px solid #fde68a',
          padding: '10px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
        role="alert"
        aria-live="polite"
      >
        <span style={{ fontSize: '1rem' }}>⚠️</span>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400e', fontWeight: 500 }}>
          AI-generated draft — all findings must be reviewed and confirmed by the intern before use.
          Quotes and scores are suggestions, not final assessments.
        </p>
      </div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-8 py-8">

        {/* Score Card */}
        <div
          className="rounded-xl mb-8"
          style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '24px 28px' }}>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-5">
                {/* Big score number */}
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    background: scoreBg(score?.value),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: '2.25rem',
                      fontWeight: 800,
                      color: scoreColor(score?.value),
                      lineHeight: 1,
                    }}
                  >
                    {score?.value ?? '–'}
                  </span>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                      {score?.label || 'Unknown'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '2px 10px',
                        borderRadius: '20px',
                        background: scoreBg(score?.value),
                        color: scoreColor(score?.value),
                      }}
                    >
                      {score?.band || '—'} Band
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 10px',
                        borderRadius: '20px',
                        background: confStyle.bg,
                        color: confStyle.color,
                      }}
                    >
                      {confStyle.label}
                    </span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '4px' }}>
                    Score {score?.value}/10 · {score?.band}
                  </p>
                </div>
              </div>
            </div>

            {/* Justification */}
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Justification
              </p>
              {editMode ? (
                <textarea
                  id="score-justification-edit"
                  value={score?.justification || ''}
                  onChange={(e) =>
                    handleScoreChange({ ...score, justification: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #2563eb',
                    fontSize: '0.875rem',
                    lineHeight: '1.6',
                    color: '#334155',
                    minHeight: '80px',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              ) : (
                <p style={{ color: '#334155', fontSize: '0.875rem', lineHeight: '1.7', margin: 0 }}>
                  {score?.justification || 'No justification provided.'}
                </p>
              )}
            </div>
          </div>

          {/* Rubric Score visual */}
          <div style={{ borderTop: '1px solid #f1f5f9', padding: '20px 28px', background: '#fafafa' }}>
            <RubricScore score={score} editMode={editMode} onChange={handleScoreChange} />
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            borderBottom: '2px solid #e2e8f0',
            marginBottom: '24px',
          }}
        >
          {TABS.map((tab) => {
            const count = c[tab.countKey]
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#2563eb' : '#64748b',
                  borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                  marginBottom: '-2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: isActive ? '#eff6ff' : '#f1f5f9',
                    color: isActive ? '#1d4ed8' : '#94a3b8',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'evidence' && (
          <EvidenceCard items={evidence || []} editMode={editMode} />
        )}
        {activeTab === 'kpi' && (
          <KPIMapping kpiMappings={kpiMapping || []} />
        )}
        {activeTab === 'gaps' && (
          <GapAnalysis gaps={gaps || []} />
        )}
        {activeTab === 'followup' && (
          <FollowUpQuestions questions={followUpQuestions || []} />
        )}
      </div>
    </div>
  )
}
