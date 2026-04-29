import React from 'react'

const RUBRIC_LEVELS = [
  { value: 1,  label: 'Not Interested',           band: 'Need Attention' },
  { value: 2,  label: 'Lacks Discipline',          band: 'Need Attention' },
  { value: 3,  label: 'Motivated but Directionless', band: 'Need Attention' },
  { value: 4,  label: 'Careless and Inconsistent', band: 'Productivity' },
  { value: 5,  label: 'Consistent Performer',      band: 'Productivity' },
  { value: 6,  label: 'Reliable and Productive',   band: 'Productivity' },
  { value: 7,  label: 'Problem Identifier',        band: 'Performance' },
  { value: 8,  label: 'Problem Solver',            band: 'Performance' },
  { value: 9,  label: 'Innovative and Experimental', band: 'Performance' },
  { value: 10, label: 'Exceptional Performer',     band: 'Performance' },
]

function cellColor(value, currentValue) {
  const isActive = value === currentValue
  if (value <= 3) return isActive ? '#dc2626' : '#fecaca'
  if (value <= 6) return isActive ? '#d97706' : '#fde68a'
  return isActive ? '#16a34a' : '#bbf7d0'
}

function textColor(value) {
  if (value <= 3) return '#7f1d1d'
  if (value <= 6) return '#78350f'
  return '#14532d'
}

export default function RubricScore({ score, editMode, onChange }) {
  if (!score) return null

  const currentValue = score.value

  return (
    <div>
      <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
        Rubric Scale
      </p>

      {/* Band labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '3px', marginBottom: '4px' }}>
        {[
          { span: 3, label: 'Need Attention', color: '#dc2626' },
          { span: 3, label: 'Productivity', color: '#d97706' },
          { span: 4, label: 'Performance', color: '#16a34a' },
        ].map((band) =>
          Array.from({ length: band.span }).map((_, bi) => (
            <div key={`${band.label}-${bi}`} style={{ textAlign: 'center' }}>
              {bi === Math.floor(band.span / 2) && (
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: band.color, whiteSpace: 'nowrap' }}>
                  {band.label}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Score cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '3px', marginBottom: '16px' }}>
        {RUBRIC_LEVELS.map((level) => {
          const isActive = level.value === currentValue
          return (
            <div
              key={level.value}
              title={`${level.value} – ${level.label}`}
              style={{
                background: cellColor(level.value, currentValue),
                borderRadius: '6px',
                padding: '8px 4px',
                textAlign: 'center',
                border: isActive ? '2px solid currentColor' : '2px solid transparent',
                borderColor: isActive ? (level.value <= 3 ? '#dc2626' : level.value <= 6 ? '#d97706' : '#16a34a') : 'transparent',
                position: 'relative',
                cursor: 'default',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: isActive ? 800 : 600, color: textColor(level.value) }}>
                {level.value}
              </div>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: `6px solid ${level.value <= 3 ? '#dc2626' : level.value <= 6 ? '#d97706' : '#16a34a'}`,
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Active level label */}
      <div style={{ marginBottom: '16px' }}>
        {RUBRIC_LEVELS.filter((l) => l.value === currentValue).map((level) => (
          <div
            key={level.value}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 14px',
            }}
          >
            <span style={{ fontSize: '1rem', fontWeight: 800, color: cellColor(level.value, level.value) }}>
              {level.value}
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>{level.label}</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>· {level.band}</span>
          </div>
        ))}
      </div>

      {/* Edit-mode slider */}
      {editMode && (
        <div style={{ marginBottom: '12px' }}>
          <label
            htmlFor="score-slider"
            style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}
          >
            Adjust Score: {currentValue} — {RUBRIC_LEVELS.find((l) => l.value === currentValue)?.label}
          </label>
          <input
            id="score-slider"
            type="range"
            min={1}
            max={10}
            value={currentValue}
            onChange={(e) => {
              const newVal = parseInt(e.target.value, 10)
              const newLevel = RUBRIC_LEVELS.find((l) => l.value === newVal)
              onChange({
                ...score,
                value: newVal,
                label: newLevel?.label || score.label,
                band: newLevel?.band || score.band,
              })
            }}
            style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>1 – Not Interested</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>10 – Exceptional</span>
          </div>

          {/* Confidence selector */}
          <div style={{ marginTop: '12px' }}>
            <label
              htmlFor="confidence-select"
              style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}
            >
              Confidence Level
            </label>
            <select
              id="confidence-select"
              value={score.confidence}
              onChange={(e) => onChange({ ...score, confidence: e.target.value })}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1.5px solid #2563eb',
                fontSize: '0.85rem',
                color: '#334155',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="high">High Confidence</option>
              <option value="medium">Medium Confidence</option>
              <option value="low">Low Confidence</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
