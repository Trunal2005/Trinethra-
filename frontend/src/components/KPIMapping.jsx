import React from 'react'

const ALL_KPIS = [
  { id: 'lead_generation', label: 'Lead Generation', icon: '🎯' },
  { id: 'lead_conversion', label: 'Lead Conversion',  icon: '✅' },
  { id: 'upselling',       label: 'Upselling',        icon: '↑' },
  { id: 'cross_selling',   label: 'Cross-selling',    icon: '↔' },
  { id: 'nps',             label: 'NPS',              icon: '⭐' },
  { id: 'pat',             label: 'PAT',              icon: '💰' },
  { id: 'tat',             label: 'TAT',              icon: '⏱' },
  { id: 'quality',         label: 'Quality',          icon: '🔍' },
]

export default function KPIMapping({ kpiMappings }) {
  // Build a lookup from kpi id → mapping object
  const mappingByKpi = {}
  if (kpiMappings) {
    kpiMappings.forEach((m) => {
      mappingByKpi[m.kpi] = m
    })
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
          KPI Coverage Map
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
          Which of the 8 KPIs appear in this transcript — and whether the impact is systemic or personal.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}
      >
        {ALL_KPIS.map((kpi) => {
          const mapping = mappingByKpi[kpi.id]
          const isActive = !!mapping
          const isSystem = mapping?.systemOrPersonal === 'system'

          return (
            <div
              key={kpi.id}
              id={`kpi-card-${kpi.id}`}
              style={{
                background: isActive ? 'white' : '#f8fafc',
                border: isActive ? '1.5px solid #e2e8f0' : '1.5px dashed #e2e8f0',
                borderRadius: '12px',
                padding: '16px 18px',
                opacity: isActive ? 1 : 0.6,
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Active accent stripe */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: isSystem ? '#7c3aed' : '#2563eb',
                    borderRadius: '12px 0 0 12px',
                  }}
                />
              )}

              <div style={{ paddingLeft: isActive ? '8px' : 0 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{kpi.icon}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: isActive ? '#0f172a' : '#94a3b8' }}>
                      {kpi.label}
                    </span>
                  </div>
                  {isActive && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '20px',
                        background: isSystem ? '#faf5ff' : '#eff6ff',
                        color: isSystem ? '#7c3aed' : '#1d4ed8',
                        border: `1px solid ${isSystem ? '#c4b5fd' : '#93c5fd'}`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isSystem ? '🏗 System Built' : '👤 Personal Work'}
                    </span>
                  )}
                </div>

                {/* Evidence or placeholder */}
                {isActive ? (
                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, lineHeight: '1.55' }}>
                    {mapping.evidence}
                  </p>
                ) : (
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
                    Not mentioned in transcript
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#7c3aed' }} />
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            System Built — impact persists if Fellow leaves
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb' }} />
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Personal Work — impact relies on Fellow being present
          </span>
        </div>
      </div>
    </div>
  )
}
