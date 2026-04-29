import React, { useState } from 'react'

const DIMENSION_LABELS = {
  execution: 'Driving Execution',
  systems_building: 'Systems Building',
  kpi_impact: 'KPI Impact',
  change_management: 'Change Management',
}

const DIMENSION_COLORS = {
  execution:         { bg: '#eff6ff', color: '#1d4ed8' },
  systems_building:  { bg: '#faf5ff', color: '#7c3aed' },
  kpi_impact:        { bg: '#f0fdf4', color: '#15803d' },
  change_management: { bg: '#fff7ed', color: '#c2410c' },
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments without clipboard API
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: '4px 12px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        background: copied ? '#f0fdf4' : 'white',
        color: copied ? '#15803d' : '#64748b',
        fontSize: '0.75rem',
        fontWeight: 600,
        cursor: 'pointer',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        minWidth: '72px',
        justifyContent: 'center',
        transition: 'all 0.15s',
      }}
    >
      {copied ? '✓ Copied!' : '📋 Copy'}
    </button>
  )
}

export default function FollowUpQuestions({ questions }) {
  if (!questions || questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
        No follow-up questions generated.
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
          Suggested Follow-up Questions
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
          For the next supervisor call — targeting specific gaps in the assessment data.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {questions.map((q, i) => {
          const dimColors = DIMENSION_COLORS[q.targetGap] || { bg: '#f1f5f9', color: '#475569' }
          const dimLabel = DIMENSION_LABELS[q.targetGap] || q.targetGap

          return (
            <div
              key={i}
              id={`followup-question-${i + 1}`}
              style={{
                background: 'white',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '18px 20px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              {/* Number + Question + Copy button */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                {/* Number circle */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#0f172a',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                >
                  {i + 1}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        margin: '0 0 10px 0',
                        lineHeight: '1.55',
                        flex: 1,
                      }}
                    >
                      {q.question}
                    </p>
                    <CopyButton text={q.question} />
                  </div>

                  {/* Dimension badge */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 10px',
                        borderRadius: '20px',
                        background: dimColors.bg,
                        color: dimColors.color,
                      }}
                    >
                      Targets: {dimLabel}
                    </span>
                  </div>

                  {/* Looking for */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Looking for
                    </span>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: '#64748b',
                        fontStyle: 'italic',
                        margin: '4px 0 0 0',
                        lineHeight: '1.55',
                      }}
                    >
                      {q.lookingFor}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom disclaimer */}
      <div
        style={{
          marginTop: '20px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>🤖</span>
        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
          These questions were generated by AI. The intern should adapt them to the natural flow of
          the conversation — don't read them verbatim.
        </p>
      </div>
    </div>
  )
}
