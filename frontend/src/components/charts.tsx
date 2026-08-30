export type DonutSlice = { label: string; value: number; color: string }

export function DonutChart({
  data,
  centerLabel,
  centerValue,
}: {
  data: DonutSlice[]
  centerLabel?: string
  centerValue?: string
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const r = 40
  const circumference = 2 * Math.PI * r
  let offsetAccum = 0

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 100 100" className="donut-svg">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border-soft)" strokeWidth="14" />
        {data.map((d) => {
          const frac = d.value / total
          const dash = frac * circumference
          const gap = circumference - dash
          const el = (
            <circle
              key={d.label}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth="14"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offsetAccum}
              transform="rotate(-90 50 50)"
            >
              <title>{d.label}</title>
            </circle>
          )
          offsetAccum += dash
          return el
        })}
      </svg>
      <div className="donut-center">
        <span className="donut-center-value">{centerValue}</span>
        <span className="donut-center-label">{centerLabel}</span>
      </div>
    </div>
  )
}

export function HorizontalBarChart({
  data,
  formatValue,
}: {
  data: { label: string; value: number }[]
  formatValue: (v: number) => string
}) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="hbar-chart">
      {data.map((d) => (
        <div className="hbar-row" key={d.label}>
          <span className="hbar-label">{d.label}</span>
          <div className="hbar-track">
            <div className="hbar-fill" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <span className="hbar-value">{formatValue(d.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function AreaChart({
  points,
  max,
  formatValue,
}: {
  points: { label: string; value: number }[]
  max: number
  formatValue: (v: number) => string
}) {
  const n = points.length
  const coords = points.map((p, i) => ({
    x: n > 1 ? (i / (n - 1)) * 100 : 50,
    y: 100 - Math.min(100, (p.value / max) * 100),
  }))
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} 100 L ${coords[0].x} 100 Z`

  return (
    <>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="area-svg">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaFill)" stroke="none" />
        <path d={linePath} fill="none" stroke="var(--primary-dark)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      </svg>
      {coords.map((c, i) => {
        // keep the label from colliding with the dot: flip it below when the
        // point sits near the top of the chart, and pull it in from the edges
        // at the first/last point so it doesn't spill outside the plot area
        const labelBelow = c.y < 18
        const edgeShift = c.x < 8 ? '0%' : c.x > 92 ? '-100%' : '-50%'
        return (
          <span key={points[i].label} className="area-point" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
            <span className="area-dot" />
            <span
              className="chart-value area-point-label"
              style={{
                transform: `translate(${edgeShift}, ${labelBelow ? '6px' : 'calc(-100% - 6px)'})`,
              }}
              title={`${points[i].label}: ${formatValue(points[i].value)}`}
            >
              {formatValue(points[i].value)}
            </span>
          </span>
        )
      })}
    </>
  )
}
