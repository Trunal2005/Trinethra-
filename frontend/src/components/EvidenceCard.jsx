import React from 'react'

const DIMENSION_META = {
  execution: {
    label: 'Driving Execution',
    bg: '#eff6ff',
    color: '#1d4ed8',
    border: '#93c5fd',
  },
  systems_building: {
    label: 'Systems Building',
    bg: '#faf5ff',
    color: '#7c3aed',
    border: '#c4b5fd',
  },
  kpi_impact: {
    label: 'KPI Impact',
    bg: '#f0fdf4',
    color: '#15803d',
    border: '#86efac',
  },
  change_management: {
    label: 'Change Management',
    bg: '#fff7ed',
    color: '#c2410c',
    border: '#fdba74',
  },
}

const SIGNAL_META = {
  positive: { label: '↑ Positive', bg: '#dcfce7', color: '#15803d' },
  negative: { label: '↓ Negative', bg: '#fee2e2', color: '#dc2626' },
  neutral:  { label: '→ Neutral',  bg: '#f1f5f9', color: '#475569' },
}

const BORDER_COLOR = {
  positive: '#22c55e',
  negative: '#ef4444',
  neutral:  '#94a3b8',
}

export default function EvidenceCard({ items, editMode }) {
  if (!items || items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
        No evidence items extracted.
      </div>
    )
  }

  return (
    <div>
      {/* Disclaimer */}
      <div
        style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '20px',
          fontSize: '0.78rem',
          color: '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>⚠️</span>
        <span>Quotes extracted by AI — verify each against the original transcript</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map((item, i) => {
          const dimMeta = DIMENSION_META[item.dimension] || DIMENSION_META.execution
          const sigMeta = SIGNAL_META[item.signal] || SIGNAL_META.neutral
          const borderColor = BORDER_COLOR[item.signal] || BORDER_COLOR.neutral

          return (
            <div
              key={i}
              id={`evidence-card-${i}`}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderLeft: `4px solid ${borderColor}`,
                borderRadius: '10px',
                padding: '18px 20px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              {/* Top badges */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '2px 10px',
                    borderRadius: '20px',
                    background: sigMeta.bg,
                    color: sigMeta.color,
                  }}
                >
                  {sigMeta.label}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '2px 10px',
                    borderRadius: '20px',
                    background: dimMeta.bg,
                    color: dimMeta.color,
                  }}
                >
                  {dimMeta.label}
                </span>
              </div>

              {/* Quote */}
              <blockquote
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.9375rem',
                  color: '#1e293b',
                  lineHeight: '1.65',
                  margin: '0 0 12px 0',
                  padding: '0 0 0 12px',
                  borderLeft: 'none',
                }}
              >
                "{item.quote}"
              </blockquote>

              {/* Interpretation */}
              {editMode ? (
                <textarea
                  defaultValue={item.interpretation}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1.5px solid #2563eb',
                    fontSize: '0.82rem',
                    color: '#475569',
                    lineHeight: '1.5',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit',
                    background: '#f8fafc',
                  }}
                />
              ) : (
                <p
                  style={{
                    fontSize: '0.825rem',
                    color: '#64748b',
                    margin: 0,
                    lineHeight: '1.55',
                  }}
                >
                  {item.interpretation}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
