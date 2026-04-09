import { useState, useEffect, useRef } from 'react';
import InputPanel from './components/InputPanel.jsx';
import DiagramGrid from './components/DiagramGrid.jsx';
import NumericalDisplay from './components/NumericalDisplay.jsx';
import { fetchSymmetricalComponents } from './api/symmetrical.js';

const DEFAULT_INPUTS = {
  Va: { magnitude: 100, angleDeg: 0 },
  Vb: { magnitude: 80,  angleDeg: -100 },
  Vc: { magnitude: 90,  angleDeg: 130 },
};

export default function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  function handleChange(phase, field, value) {
    setInputs((prev) => ({
      ...prev,
      [phase]: { ...prev[phase], [field]: value },
    }));
  }

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSymmetricalComponents(
          inputs.Va,
          inputs.Vb,
          inputs.Vc
        );
        setResult(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [inputs]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Three-Phase Symmetrical Components</h1>
        <p className="app-subtitle">
          Fortescue's theorem — decompose unbalanced phasors into positive,
          negative, and zero sequences
        </p>
      </header>

      <main className="app-main">
        <aside className="app-sidebar">
          <InputPanel inputs={inputs} onChange={handleChange} />

          {error && <div className="error-banner">{error}</div>}
          {loading && <div className="loading-bar" />}

          <NumericalDisplay result={result} />

          <section className="theory-note">
            <h3>Theory</h3>
            <p>
              Any unbalanced three-phase system can be decomposed into three
              balanced sets using the <strong>Fortescue transformation</strong>:
            </p>
            <ul>
              <li><strong>Positive seq (+):</strong> balanced, ABC rotation</li>
              <li><strong>Negative seq (−):</strong> balanced, ACB rotation</li>
              <li><strong>Zero seq (0):</strong> all phasors in phase</li>
            </ul>
            <code className="formula">
              Va₁ = ⅓(Va + a·Vb + a²·Vc)
            </code>
            <code className="formula">
              Va₂ = ⅓(Va + a²·Vb + a·Vc)
            </code>
            <code className="formula">
              Va₀ = ⅓(Va + Vb + Vc)
            </code>
            <p className="formula-label">
              where <em>a</em> = e<sup>j120°</sup> (unit phasor at 120°)
            </p>
          </section>
        </aside>

        <section className="app-diagrams">
          <DiagramGrid result={result} />
        </section>
      </main>
    </div>
  );
}
