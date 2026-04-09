import PhasorDiagram from './PhasorDiagram.jsx';
import ReconstructionDiagram from './ReconstructionDiagram.jsx';

const COLORS = { a: '#2563eb', b: '#16a34a', c: '#dc2626' };
const REC_COLORS = { seq0: '#f59e0b', seq1: '#38bdf8', seq2: '#a78bfa', original: '#f87171' };

export default function DiagramGrid({ result, animAngle }) {
  if (!result) {
    return (
      <div className="diagram-grid diagram-grid--empty">
        <p>Enter phasor values to see diagrams.</p>
      </div>
    );
  }

  const { inputs, zero, positive, negative } = result;

  const allMags = [
    inputs.Va.magnitude, inputs.Vb.magnitude, inputs.Vc.magnitude,
    zero.Va0.magnitude,
    positive.Va1.magnitude, positive.Vb1.magnitude, positive.Vc1.magnitude,
    negative.Va2.magnitude, negative.Vb2.magnitude, negative.Vc2.magnitude,
  ];
  const maxMag = Math.max(...allMags, 1);

  return (
    <>
      {/* Main 2×2 grid */}
      <div>
        <p className="section-label">Sequence Diagrams</p>
        <div className="diagram-grid">
          <PhasorDiagram title="Original" maxMagnitude={maxMag} animAngle={animAngle}
            phasors={[
              { label: 'Va', magnitude: inputs.Va.magnitude, angleDeg: inputs.Va.angleDeg, color: COLORS.a },
              { label: 'Vb', magnitude: inputs.Vb.magnitude, angleDeg: inputs.Vb.angleDeg, color: COLORS.b },
              { label: 'Vc', magnitude: inputs.Vc.magnitude, angleDeg: inputs.Vc.angleDeg, color: COLORS.c },
            ]} />
          <PhasorDiagram title="Positive Sequence" maxMagnitude={maxMag} animAngle={animAngle}
            phasors={[
              { label: 'Va1', magnitude: positive.Va1.magnitude, angleDeg: positive.Va1.angleDeg, color: COLORS.a },
              { label: 'Vb1', magnitude: positive.Vb1.magnitude, angleDeg: positive.Vb1.angleDeg, color: COLORS.b },
              { label: 'Vc1', magnitude: positive.Vc1.magnitude, angleDeg: positive.Vc1.angleDeg, color: COLORS.c },
            ]} />
          <PhasorDiagram title="Negative Sequence" maxMagnitude={maxMag} animAngle={-animAngle}
            phasors={[
              { label: 'Va2', magnitude: negative.Va2.magnitude, angleDeg: negative.Va2.angleDeg, color: COLORS.a },
              { label: 'Vb2', magnitude: negative.Vb2.magnitude, angleDeg: negative.Vb2.angleDeg, color: COLORS.b },
              { label: 'Vc2', magnitude: negative.Vc2.magnitude, angleDeg: negative.Vc2.angleDeg, color: COLORS.c },
            ]} />
          <PhasorDiagram title="Zero Sequence" maxMagnitude={maxMag} animAngle={animAngle} isZeroSeq
            phasors={[
              { label: 'Va0', magnitude: zero.Va0.magnitude, angleDeg: zero.Va0.angleDeg, color: COLORS.a },
              { label: 'Vb0', magnitude: zero.Vb0.magnitude, angleDeg: zero.Vb0.angleDeg, color: COLORS.b },
              { label: 'Vc0', magnitude: zero.Vc0.magnitude, angleDeg: zero.Vc0.angleDeg, color: COLORS.c },
            ]} />
        </div>
      </div>

      {/* Reconstruction row */}
      <div>
        <p className="section-label">Reconstruction — Zero + Positive + Negative = Original</p>
        <div className="diagram-grid-3">
          <ReconstructionDiagram title="Phase A"
            seq0={zero.Va0} seq1={positive.Va1} seq2={negative.Va2} original={inputs.Va}
            animAngle={animAngle} colors={REC_COLORS} />
          <ReconstructionDiagram title="Phase B"
            seq0={zero.Vb0} seq1={positive.Vb1} seq2={negative.Vb2} original={inputs.Vb}
            animAngle={animAngle} colors={REC_COLORS} />
          <ReconstructionDiagram title="Phase C"
            seq0={zero.Vc0} seq1={positive.Vc1} seq2={negative.Vc2} original={inputs.Vc}
            animAngle={animAngle} colors={REC_COLORS} />
        </div>
      </div>
    </>
  );
}
