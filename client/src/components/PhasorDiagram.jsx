import { polarToSvg } from '../utils/phasorMath.js';

const SVG_RADIUS = 100;
const VIEW = 130;
const REF_CIRCLES = [25, 50, 75, 100];

function Background() {
  return (
    <>
      <rect x={-VIEW} y={-VIEW} width={VIEW * 2} height={VIEW * 2} fill="#1e2d3d" />
      {REF_CIRCLES.map(r => (
        <circle key={r} cx="0" cy="0" r={r} fill="none" stroke="#2d4560" strokeWidth="0.6" />
      ))}
      <line x1={-SVG_RADIUS} y1="0" x2={SVG_RADIUS} y2="0" stroke="#3a5570" strokeWidth="0.6" strokeDasharray="4 3" />
      <line x1="0" y1={-SVG_RADIUS} x2="0" y2={SVG_RADIUS} stroke="#3a5570" strokeWidth="0.6" strokeDasharray="4 3" />
      {[0, 90, 180, 270].map(deg => {
        const rad = (deg * Math.PI) / 180;
        return (
          <text key={deg}
            x={Math.cos(rad) * (SVG_RADIUS + 16)}
            y={-Math.sin(rad) * (SVG_RADIUS + 16)}
            fill="#4a6a88" fontSize="7" textAnchor="middle" dominantBaseline="middle">
            {deg}°
          </text>
        );
      })}
    </>
  );
}

function Arrow({ id, color }) {
  return (
    <marker id={id} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L0,6 L6,3 z" fill={color} />
    </marker>
  );
}

function Phasor({ label, magnitude, angleDeg, color, scale, markerId, offsetX = 0, offsetY = 0 }) {
  const tip = polarToSvg(magnitude, angleDeg, scale);
  const x2 = tip.x + offsetX;
  const y2 = tip.y + offsetY;
  const lx = polarToSvg(magnitude, angleDeg, scale * 1.18).x + offsetX;
  const ly = polarToSvg(magnitude, angleDeg, scale * 1.18).y + offsetY;
  return (
    <g>
      <line x1={offsetX} y1={offsetY} x2={x2} y2={y2}
        stroke={color} strokeWidth="2.2" markerEnd={`url(#${markerId})`} />
      <text x={lx} y={ly} fill={color} fontSize="9" fontWeight="bold"
        textAnchor="middle" dominantBaseline="middle">{label}</text>
    </g>
  );
}

/**
 * Standard phasor diagram (all phasors from origin).
 *
 * phasors: [{ label, magnitude, angleDeg, color }]
 * maxMagnitude: unified scale reference
 * animAngle: added to all phasor angles (for spinning)
 * isZeroSeq: offset overlapping lines slightly
 */
export default function PhasorDiagram({ title, phasors, maxMagnitude, animAngle = 0, isZeroSeq = false }) {
  const scale = maxMagnitude > 0 ? SVG_RADIUS / maxMagnitude : 1;
  const offsets = isZeroSeq ? [-1.5, 0, 1.5] : [0, 0, 0];

  return (
    <div className="phasor-diagram">
      <h3 className="diagram-title">{title}</h3>
      <svg viewBox={`${-VIEW} ${-VIEW} ${VIEW * 2} ${VIEW * 2}`} className="phasor-svg">
        <defs>
          {phasors.map(p => (
            <Arrow key={p.label} id={`${title}-${p.label}`} color={p.color} />
          ))}
        </defs>
        <Background />
        {phasors.map((p, i) => {
          const offRad = ((p.angleDeg + animAngle + 90) * Math.PI) / 180;
          return (
            <Phasor
              key={p.label}
              label={p.label}
              magnitude={p.magnitude}
              angleDeg={p.angleDeg + animAngle}
              color={p.color}
              scale={scale}
              markerId={`${title}-${p.label}`}
              offsetX={offsets[i] * Math.cos(offRad)}
              offsetY={-offsets[i] * Math.sin(offRad)}
            />
          );
        })}
        {isZeroSeq && (
          <text x="0" y={VIEW - 14} fill="#4a6a88" fontSize="7" textAnchor="middle">
            All phases equal — offset for visibility
          </text>
        )}
      </svg>
      <div className="diagram-legend">
        {phasors.map(p => (
          <span key={p.label} className="legend-item">
            <span className="legend-dot" style={{ background: p.color }} />
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
