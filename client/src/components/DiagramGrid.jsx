import PhasorDiagram from './PhasorDiagram.jsx';

/**
 * result: the API response object:
 *   { inputs: {Va,Vb,Vc}, zero: {Va0,Vb0,Vc0}, positive: {Va1,Vb1,Vc1}, negative: {Va2,Vb2,Vc2} }
 */
export default function DiagramGrid({ result }) {
  if (!result) {
    return (
      <div className="diagram-grid diagram-grid--empty">
        <p>Enter phasor values to see diagrams.</p>
      </div>
    );
  }

  const { inputs, zero, positive, negative } = result;

  // Shared scale: largest magnitude across all phasors
  const allMags = [
    inputs.Va.magnitude, inputs.Vb.magnitude, inputs.Vc.magnitude,
    zero.Va0.magnitude,
    positive.Va1.magnitude,
    negative.Va2.magnitude,
  ];
  const maxMagnitude = Math.max(...allMags, 1); // at least 1 to avoid division by zero

  const diagrams = [
    {
      title: 'Original (Unbalanced)',
      phasors: [
        { label: 'Va',  magnitude: inputs.Va.magnitude, angleDeg: inputs.Va.angleDeg, color: '#4e9af1' },
        { label: 'Vb',  magnitude: inputs.Vb.magnitude, angleDeg: inputs.Vb.angleDeg, color: '#4ecf6f' },
        { label: 'Vc',  magnitude: inputs.Vc.magnitude, angleDeg: inputs.Vc.angleDeg, color: '#f1704e' },
      ],
      isZeroSeq: false,
    },
    {
      title: 'Positive Sequence',
      phasors: [
        { label: 'Va1', magnitude: positive.Va1.magnitude, angleDeg: positive.Va1.angleDeg, color: '#4e9af1' },
        { label: 'Vb1', magnitude: positive.Vb1.magnitude, angleDeg: positive.Vb1.angleDeg, color: '#4ecf6f' },
        { label: 'Vc1', magnitude: positive.Vc1.magnitude, angleDeg: positive.Vc1.angleDeg, color: '#f1704e' },
      ],
      isZeroSeq: false,
    },
    {
      title: 'Negative Sequence',
      phasors: [
        { label: 'Va2', magnitude: negative.Va2.magnitude, angleDeg: negative.Va2.angleDeg, color: '#4e9af1' },
        { label: 'Vb2', magnitude: negative.Vb2.magnitude, angleDeg: negative.Vb2.angleDeg, color: '#4ecf6f' },
        { label: 'Vc2', magnitude: negative.Vc2.magnitude, angleDeg: negative.Vc2.angleDeg, color: '#f1704e' },
      ],
      isZeroSeq: false,
    },
    {
      title: 'Zero Sequence',
      phasors: [
        { label: 'Va0', magnitude: zero.Va0.magnitude, angleDeg: zero.Va0.angleDeg, color: '#4e9af1' },
        { label: 'Vb0', magnitude: zero.Vb0.magnitude, angleDeg: zero.Vb0.angleDeg, color: '#4ecf6f' },
        { label: 'Vc0', magnitude: zero.Vc0.magnitude, angleDeg: zero.Vc0.angleDeg, color: '#f1704e' },
      ],
      isZeroSeq: true,
    },
  ];

  return (
    <div className="diagram-grid">
      {diagrams.map((d) => (
        <PhasorDiagram
          key={d.title}
          title={d.title}
          phasors={d.phasors}
          maxMagnitude={maxMagnitude}
          isZeroSeq={d.isZeroSeq}
        />
      ))}
    </div>
  );
}
