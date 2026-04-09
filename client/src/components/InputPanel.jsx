const PHASES = [
  { key: 'Va', label: 'Vₐ', color: '#4e9af1' },
  { key: 'Vb', label: 'V_b', color: '#4ecf6f' },
  { key: 'Vc', label: 'V_c', color: '#f1704e' },
];

export default function InputPanel({ inputs, onChange }) {
  function handleChange(phase, field, raw) {
    const value = parseFloat(raw);
    if (!isNaN(value)) {
      onChange(phase, field, value);
    }
  }

  return (
    <section className="input-panel">
      <h2>Input Phasors</h2>
      <table className="input-table">
        <thead>
          <tr>
            <th>Phase</th>
            <th>Magnitude (V)</th>
            <th>Angle (°)</th>
          </tr>
        </thead>
        <tbody>
          {PHASES.map(({ key, label, color }) => (
            <tr key={key}>
              <td>
                <span className="phase-badge" style={{ color }}>
                  {label}
                </span>
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={inputs[key].magnitude}
                  onChange={(e) => handleChange(key, 'magnitude', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  step="1"
                  min="-360"
                  max="360"
                  value={inputs[key].angleDeg}
                  onChange={(e) => handleChange(key, 'angleDeg', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="input-hint">
        Balanced system: Va=100∠0°, Vb=100∠−120°, Vc=100∠120°
      </p>
    </section>
  );
}
