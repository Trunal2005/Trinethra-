import React from 'react'

const DIMENSION_META = {
  execution: {
    label: 'Driving Execution',
    hint: 'Ask how much follow-up the supervisor needs to do',
    color: '#1d4ed8',
    bg: '#eff6ff',
    border: '#93c5fd',
  },
  systems_building: {
    label: 'Systems Building',
    hint: 'Ask about survivability: what keeps running if the Fellow leaves?',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#c4b5fd',
  },
  kpi_impact: {
    label: 'KPI Impact',
    hint: 'Ask for specific numbers — what has measurably changed?',
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#86efac',
  },
  change_management: {
    label: 'Change Management',
    hint: 'Ask how floor workers respond to the Fellow\'s requests',
    color: '#c2410c',
    bg: '#fff7ed',
    border: '#fdba74',
  },
}

export default function GapAnalysis({ gaps }) {
  if (!gaps || gaps.length === 0) {
    return (
      <div
        style={{
          background: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: '12px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>✓</span>
        <div>
          <p style={{ fontWeight: 700, color: '#15803d', margin: '0 0 4px 0', fontSize: '0.9rem' }}>
            All dimensions covered
          </p>
          <p style={{ color: '#166534', fontSize: '0.82rem', margin: 0 }}>
            The transcript provides sufficient data across all 4 assessment dimensions.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
          Assessment Gaps
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
          Dimensions the transcript did <strong>not</strong> adequately cover — these should be probed in a follow-up call.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {gaps.map((gap, i) => {
          const meta = DIMENSION_META[gap.dimension] || {
            label: gap.dimension,
            hint: 'Ask follow-up questions to fill this gap.',
            color: '#475569',
            bg: '#f1f5f9',
            border: '#cbd5e1',
          }

          return (
            <div
              key={i}
              id={`gap-card-${i}`}
              style={{
                background: 'white',
                border: `1.5px solid ${meta.border}`,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              {/* Color header strip */}
              <div
                style={{
                  background: meta.bg,
                  borderBottom: `1px solid ${meta.border}`,
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '1rem' }}>⚠️</span>
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: meta.color,
                  }}
                >
                  Gap: {meta.label}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '14px 18px' }}>
                <p style={{ fontSize: '0.875rem', color: '#334155', margin: '0 0 12px 0', lineHeight: '1.6' }}>
                  {gap.detail}
                </p>

                {/* Hint */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', flexShrink: 0 }}>💡</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.5' }}>
                    <strong style={{ color: '#475569' }}>Suggested approach:</strong> {meta.hint}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
