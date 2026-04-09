import { polarToSvg } from '../utils/phasorMath.js';

const SVG_RADIUS = 100;
const VIEW = 130;

/**
 * Shows how Va0 + Va1 + Va2 = Va (tip-to-tail phasor addition).
 *
 * seq0, seq1, seq2: { magnitude, angleDeg } — the three sequence components
 * original: { magnitude, angleDeg } — the original unbalanced phasor
 * animAngle: rotation offset; seq1 uses +animAngle, seq2 uses -animAngle (opposite direction)
 * colors: { seq0, seq1, seq2, original }
 * title: string
 */
export default function ReconstructionDiagram({ title, seq0, seq1, seq2, original, animAngle = 0, colors }) {
  // Work out the maximum extent to pick a good scale
  const maxR = seq0.magnitude + seq1.magnitude + seq2.magnitude;
  const scale = maxR > 0 ? SVG_RADIUS / maxR : 1;

  // Angles with animation offsets:
  // Zero & positive sequence rotate with +animAngle
  // Negative sequence rotates with -animAngle (opposite direction)
  const a0deg = seq0.angleDeg + animAngle;
  const a1deg = seq1.angleDeg + animAngle;
  const a2deg = seq2.angleDeg - animAngle;

  const v0 = polarToSvg(seq0.magnitude, a0deg, scale);
  const v1 = polarToSvg(seq1.magnitude, a1deg, scale);
  const v2 = polarToSvg(seq2.magnitude, a2deg, scale);

  // Tip-to-tail: each starts where the previous ended
  const tip0 = { x: v0.x, y: v0.y };
  const tip1 = { x: tip0.x + v1.x, y: tip0.y + v1.y };
  const tip2 = { x: tip1.x + v2.x, y: tip1.y + v2.y };

  // Reference circles
  const refR = [25, 50, 75, 100];

  function arrow(id, color) {
    return (
      <marker key={id} id={id} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L6,3 z" fill={color} />
      </marker>
    );
  }

  function labelPos(ax, ay, bx, by, frac = 0.5) {
    // midpoint + small perpendicular offset
    const mx = ax + (bx - ax) * frac;
    const my = ay + (by - ay) * frac;
    const dx = bx - ax, dy = by - ay;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: mx + (-dy / len) * 9, y: my + (dx / len) * 9 };
  }

  const l0 = labelPos(0, 0, tip0.x, tip0.y);
  const l1 = labelPos(tip0.x, tip0.y, tip1.x, tip1.y);
  const l2 = labelPos(tip1.x, tip1.y, tip2.x, tip2.y);

  return (
    <div className="phasor-diagram">
      <h3 className="diagram-title">{title}</h3>
      <svg viewBox={`${-VIEW} ${-VIEW} ${VIEW * 2} ${VIEW * 2}`} className="phasor-svg">
        <defs>
          {arrow(`rec-${title}-0`, colors.seq0)}
          {arrow(`rec-${title}-1`, colors.seq1)}
          {arrow(`rec-${title}-2`, colors.seq2)}
          {arrow(`rec-${title}-orig`, colors.original)}
        </defs>

        {/* Background */}
        <rect x={-VIEW} y={-VIEW} width={VIEW * 2} height={VIEW * 2} fill="#1e2d3d" />
        {refR.map(r => (
          <circle key={r} cx="0" cy="0" r={r} fill="none" stroke="#2d4560" strokeWidth="0.6" />
        ))}
        <line x1={-SVG_RADIUS} y1="0" x2={SVG_RADIUS} y2="0" stroke="#3a5570" strokeWidth="0.6" strokeDasharray="4 3" />
        <line x1="0" y1={-SVG_RADIUS} x2="0" y2={SVG_RADIUS} stroke="#3a5570" strokeWidth="0.6" strokeDasharray="4 3" />

        {/* Dashed resultant (original phasor) */}
        <line x1="0" y1="0" x2={tip2.x} y2={tip2.y}
          stroke={colors.original} strokeWidth="1.5" strokeDasharray="5 3"
          markerEnd={`url(#rec-${title}-orig)`} />

        {/* Seq 0 — from origin */}
        <line x1="0" y1="0" x2={tip0.x} y2={tip0.y}
          stroke={colors.seq0} strokeWidth="2.2" markerEnd={`url(#rec-${title}-0)`} />
        <text x={l0.x} y={l0.y} fill={colors.seq0} fontSize="8" fontWeight="bold"
          textAnchor="middle" dominantBaseline="middle">0</text>

        {/* Seq 1 — from tip0 */}
        <line x1={tip0.x} y1={tip0.y} x2={tip1.x} y2={tip1.y}
          stroke={colors.seq1} strokeWidth="2.2" markerEnd={`url(#rec-${title}-1)`} />
        <text x={l1.x} y={l1.y} fill={colors.seq1} fontSize="8" fontWeight="bold"
          textAnchor="middle" dominantBaseline="middle">+</text>

        {/* Seq 2 — from tip1 */}
        <line x1={tip1.x} y1={tip1.y} x2={tip2.x} y2={tip2.y}
          stroke={colors.seq2} strokeWidth="2.2" markerEnd={`url(#rec-${title}-2)`} />
        <text x={l2.x} y={l2.y} fill={colors.seq2} fontSize="8" fontWeight="bold"
          textAnchor="middle" dominantBaseline="middle">−</text>

        {/* Resultant label */}
        {seq0.magnitude + seq1.magnitude + seq2.magnitude > 0 && (
          <text x={tip2.x * 1.12} y={tip2.y * 1.12}
            fill={colors.original} fontSize="9" fontWeight="bold"
            textAnchor="middle" dominantBaseline="middle">
            {title.replace('Phase ', 'V')}
          </text>
        )}
      </svg>
      <div className="diagram-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: colors.seq0 }} />Zero (0)</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: colors.seq1 }} />Pos (+)</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: colors.seq2 }} />Neg (−)</span>
        <span className="legend-item" style={{ opacity: 0.7 }}>
          <span style={{ width:16, display:'inline-block', borderBottom:'2px dashed '+colors.original, marginRight:4, verticalAlign:'middle' }} />
          Result
        </span>
      </div>
    </div>
  );
}
