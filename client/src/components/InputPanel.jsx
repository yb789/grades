import { useState, useEffect } from 'react';

const PHASES = [
  { key: 'Va', label: 'Vₐ', color: '#2563eb' },
  { key: 'Vb', label: 'V_b', color: '#16a34a' },
  { key: 'Vc', label: 'V_c', color: '#dc2626' },
];

function PhaseRow({ phaseKey, label, color, magnitude, angleDeg, onChange }) {
  // Keep raw string state so "-" and partial inputs work while typing
  const [magRaw, setMagRaw]     = useState(String(magnitude));
  const [angleRaw, setAngleRaw] = useState(String(angleDeg));

  // Sync if parent value changes (e.g. reset)
  useEffect(() => { setMagRaw(String(magnitude)); }, [magnitude]);
  useEffect(() => { setAngleRaw(String(angleDeg)); }, [angleDeg]);

  function commit(field, raw) {
    const v = parseFloat(raw);
    if (isFinite(v)) onChange(phaseKey, field, field === 'magnitude' ? Math.abs(v) : v);
  }

  return (
    <tr>
      <td><span className="phase-badge" style={{ color }}>{label}</span></td>
      <td>
        <input
          type="number"
          min="0"
          step="1"
          value={magRaw}
          onChange={e => { setMagRaw(e.target.value); commit('magnitude', e.target.value); }}
          onBlur={e => commit('magnitude', e.target.value)}
        />
      </td>
      <td>
        <input
          type="number"
          step="1"
          value={angleRaw}
          onChange={e => { setAngleRaw(e.target.value); commit('angleDeg', e.target.value); }}
          onBlur={e => commit('angleDeg', e.target.value)}
        />
      </td>
    </tr>
  );
}

export default function InputPanel({ inputs, onChange }) {
  return (
    <section className="input-panel">
      <h2>Input Phasors</h2>
      <table className="input-table">
        <thead>
          <tr>
            <th>Phase</th>
            <th>|V| (V)</th>
            <th>∠ (°)</th>
          </tr>
        </thead>
        <tbody>
          {PHASES.map(({ key, label, color }) => (
            <PhaseRow
              key={key}
              phaseKey={key}
              label={label}
              color={color}
              magnitude={inputs[key].magnitude}
              angleDeg={inputs[key].angleDeg}
              onChange={onChange}
            />
          ))}
        </tbody>
      </table>
      <p className="input-hint">
        Balanced: Va=100∠0°, Vb=100∠−120°, Vc=100∠120°
      </p>
    </section>
  );
}
