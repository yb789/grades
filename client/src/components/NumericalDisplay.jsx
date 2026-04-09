import { normalizeAngle, round } from '../utils/phasorMath.js';

function PhasorRow({ label, data, color }) {
  const mag = round(data.magnitude, 3);
  const ang = round(normalizeAngle(data.angleDeg), 1);
  return (
    <tr>
      <td>
        <span className="phase-badge" style={{ color }}>
          {label}
        </span>
      </td>
      <td className="num-cell">{mag}</td>
      <td className="num-cell">{ang}°</td>
    </tr>
  );
}

function SectionHeader({ label }) {
  return (
    <tr className="section-header">
      <td colSpan="3">{label}</td>
    </tr>
  );
}

/**
 * result: API response
 */
export default function NumericalDisplay({ result }) {
  if (!result) return null;
  const { inputs, zero, positive, negative } = result;

  return (
    <section className="numerical-display">
      <h2>Symmetrical Components</h2>
      <table className="results-table">
        <thead>
          <tr>
            <th>Phasor</th>
            <th>|V| (V)</th>
            <th>∠ (°)</th>
          </tr>
        </thead>
        <tbody>
          <SectionHeader label="Original" />
          <PhasorRow label="Va"  data={inputs.Va} color="#4e9af1" />
          <PhasorRow label="Vb"  data={inputs.Vb} color="#4ecf6f" />
          <PhasorRow label="Vc"  data={inputs.Vc} color="#f1704e" />

          <SectionHeader label="Positive Sequence (+)" />
          <PhasorRow label="Va1" data={positive.Va1} color="#4e9af1" />
          <PhasorRow label="Vb1" data={positive.Vb1} color="#4ecf6f" />
          <PhasorRow label="Vc1" data={positive.Vc1} color="#f1704e" />

          <SectionHeader label="Negative Sequence (−)" />
          <PhasorRow label="Va2" data={negative.Va2} color="#4e9af1" />
          <PhasorRow label="Vb2" data={negative.Vb2} color="#4ecf6f" />
          <PhasorRow label="Vc2" data={negative.Vc2} color="#f1704e" />

          <SectionHeader label="Zero Sequence (0)" />
          <PhasorRow label="Va0" data={zero.Va0} color="#4e9af1" />
          <PhasorRow label="Vb0" data={zero.Vb0} color="#4ecf6f" />
          <PhasorRow label="Vc0" data={zero.Vc0} color="#f1704e" />
        </tbody>
      </table>

      <div className="formula-note">
        <strong>Decomposition:</strong>&nbsp; Va = Va0 + Va1 + Va2
      </div>
    </section>
  );
}
