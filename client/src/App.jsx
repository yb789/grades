import { useState, useMemo, useEffect, useRef } from 'react';
import InputPanel from './components/InputPanel.jsx';
import DiagramGrid from './components/DiagramGrid.jsx';
import NumericalDisplay from './components/NumericalDisplay.jsx';
import { computeSymmetricalComponents } from './utils/symmetricalComponents.js';

const DEFAULT_INPUTS = {
  Va: { magnitude: 100, angleDeg: 0 },
  Vb: { magnitude: 80,  angleDeg: -100 },
  Vc: { magnitude: 90,  angleDeg: 130 },
};

export default function App() {
  const [inputs, setInputs]     = useState(DEFAULT_INPUTS);
  const [spinning, setSpinning] = useState(false);
  const [animAngle, setAnimAngle] = useState(0);
  const [speed, setSpeed]       = useState(30); // degrees per second
  const rafRef   = useRef(null);
  const lastTRef = useRef(null);

  function handleChange(phase, field, value) {
    setInputs(prev => ({ ...prev, [phase]: { ...prev[phase], [field]: value } }));
  }

  const result = useMemo(
    () => computeSymmetricalComponents(inputs.Va, inputs.Vb, inputs.Vc),
    [inputs]
  );

  // Animation loop
  useEffect(() => {
    if (!spinning) {
      cancelAnimationFrame(rafRef.current);
      lastTRef.current = null;
      return;
    }
    function step(ts) {
      if (lastTRef.current !== null) {
        const delta = (ts - lastTRef.current) / 1000; // seconds
        setAnimAngle(prev => (prev + speed * delta) % 360);
      }
      lastTRef.current = ts;
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [spinning, speed]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Three-Phase Symmetrical Components</h1>
        <p className="app-subtitle">
          Fortescue's theorem — decompose unbalanced phasors into positive, negative, and zero sequences
        </p>
      </header>

      <main className="app-main">
        <aside className="app-sidebar">
          <InputPanel inputs={inputs} onChange={handleChange} />

          {/* Spinning controls */}
          <div className="anim-controls">
            <button
              className={`anim-btn ${spinning ? 'stop' : ''}`}
              onClick={() => { setSpinning(s => !s); }}
            >
              {spinning ? '⏹ Stop' : '▶ Spin'}
            </button>
            <span className="anim-label">{spinning ? 'Rotating…' : 'Static'}</span>
            <label className="anim-speed">
              Speed
              <input type="range" min="5" max="120" value={speed}
                onChange={e => setSpeed(Number(e.target.value))} />
              {speed}°/s
            </label>
          </div>

          <NumericalDisplay result={result} />

          <section className="theory-note">
            <h3>Theory</h3>
            <p>
              Any unbalanced three-phase system decomposes into three balanced sets
              via the <strong>Fortescue transformation</strong>:
            </p>
            <ul>
              <li><strong>Positive (+):</strong> balanced, ABC rotation</li>
              <li><strong>Negative (−):</strong> balanced, ACB rotation</li>
              <li><strong>Zero (0):</strong> all phasors in phase</li>
            </ul>
            <code className="formula">Va₁ = ⅓(Va + a·Vb + a²·Vc)</code>
            <code className="formula">Va₂ = ⅓(Va + a²·Vb + a·Vc)</code>
            <code className="formula">Va₀ = ⅓(Va + Vb + Vc)</code>
            <p className="formula-label">
              <em>a</em> = e<sup>j120°</sup> &nbsp;|&nbsp;
              Spin: + seq rotates CCW, − seq rotates CW
            </p>
          </section>
        </aside>

        <section className="app-diagrams">
          <DiagramGrid result={result} animAngle={animAngle} />
        </section>
      </main>
    </div>
  );
}
