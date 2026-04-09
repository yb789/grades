import { polarToSvg } from '../utils/phasorMath.js';

const SVG_RADIUS = 100;
const VIEW = 130; // half of viewBox dimension — a bit larger than SVG_RADIUS for labels

// Reference circle radii (in SVG units)
const REF_CIRCLES = [25, 50, 75, 100];

// Axis lines: [x1,y1,x2,y2]
const AXES = [
  [-SVG_RADIUS, 0, SVG_RADIUS, 0],
  [0, -SVG_RADIUS, 0, SVG_RADIUS],
];

function Arrowhead({ id, color }) {
  return (
    <marker
      id={id}
      markerWidth="6"
      markerHeight="6"
      refX="5"
      refY="3"
      orient="auto"
    >
      <path d="M0,0 L0,6 L6,3 z" fill={color} />
    </marker>
  );
}

/**
 * phasors: Array of { label, magnitude, angleDeg, color }
 * maxMagnitude: shared scale reference across all diagrams
 * title: diagram title
 * isZeroSeq: if true, phasors overlap — offset slightly so all are visible
 */
export default function PhasorDiagram({ title, phasors, maxMagnitude, isZeroSeq = false }) {
  const scale = maxMagnitude > 0 ? SVG_RADIUS / maxMagnitude : 1;

  // For zero sequence, offset lines slightly so they don't fully overlap
  const offsets = isZeroSeq ? [-1.5, 0, 1.5] : [0, 0, 0];

  return (
    <div className="phasor-diagram">
      <h3 className="diagram-title">{title}</h3>
      <svg
        viewBox={`${-VIEW} ${-VIEW} ${VIEW * 2} ${VIEW * 2}`}
        className="phasor-svg"
        aria-label={`${title} phasor diagram`}
      >
        <defs>
          {phasors.map((p) => (
            <Arrowhead key={p.label} id={`arrow-${title.replace(/\s/g, '')}-${p.label}`} color={p.color} />
          ))}
        </defs>

        {/* Background */}
        <rect x={-VIEW} y={-VIEW} width={VIEW * 2} height={VIEW * 2} fill="#0f172a" />

        {/* Reference circles */}
        {REF_CIRCLES.map((r) => (
          <circle key={r} cx="0" cy="0" r={r} fill="none" stroke="#334155" strokeWidth="0.5" />
        ))}

        {/* Axis lines */}
        {AXES.map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#475569"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}

        {/* Angle labels at 0°, 90°, 180°, 270° */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const lx = Math.cos(rad) * (SVG_RADIUS + 14);
          const ly = -Math.sin(rad) * (SVG_RADIUS + 14);
          return (
            <text key={deg} x={lx} y={ly} fill="#64748b" fontSize="7" textAnchor="middle" dominantBaseline="middle">
              {deg}°
            </text>
          );
        })}

        {/* Phasors */}
        {phasors.map((p, i) => {
          const tip = polarToSvg(p.magnitude, p.angleDeg, scale);
          const offsetAngleRad = ((p.angleDeg + 90) * Math.PI) / 180;
          const ox = offsets[i] * Math.cos(offsetAngleRad);
          const oy = -offsets[i] * Math.sin(offsetAngleRad);

          const x2 = tip.x + ox;
          const y2 = tip.y + oy;
          const markerId = `arrow-${title.replace(/\s/g, '')}-${p.label}`;

          // Label position: 15% beyond tip
          const labelScale = 1.18;
          const lx = polarToSvg(p.magnitude, p.angleDeg, scale * labelScale).x + ox;
          const ly = polarToSvg(p.magnitude, p.angleDeg, scale * labelScale).y + oy;

          return (
            <g key={p.label}>
              <line
                x1={ox} y1={oy}
                x2={x2} y2={y2}
                stroke={p.color}
                strokeWidth="2"
                markerEnd={`url(#${markerId})`}
              />
              <text
                x={lx} y={ly}
                fill={p.color}
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {p.label}
              </text>
            </g>
          );
        })}

        {/* Zero sequence annotation */}
        {isZeroSeq && (
          <text x="0" y={VIEW - 12} fill="#94a3b8" fontSize="7" textAnchor="middle">
            All phases equal — offset for visibility
          </text>
        )}
      </svg>

      {/* Legend */}
      <div className="diagram-legend">
        {phasors.map((p) => (
          <span key={p.label} className="legend-item">
            <span className="legend-dot" style={{ background: p.color }} />
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
