// Complex number arithmetic — represented as plain objects { re, im }

function add(a, b) {
  return { re: a.re + b.re, im: a.im + b.im };
}

function mul(a, b) {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

function scale(c, s) {
  return { re: c.re * s, im: c.im * s };
}

function fromPolar(magnitude, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { re: magnitude * Math.cos(rad), im: magnitude * Math.sin(rad) };
}

function toPolar(c) {
  const magnitude = Math.sqrt(c.re * c.re + c.im * c.im);
  if (magnitude < 1e-10) {
    return { magnitude: 0, angleDeg: 0 };
  }
  const angleDeg = (Math.atan2(c.im, c.re) * 180) / Math.PI;
  return { magnitude, angleDeg };
}

/**
 * Compute symmetrical components from three unbalanced phasors.
 *
 * Inputs: Va, Vb, Vc — each { magnitude, angleDeg }
 * Returns structured result with zero, positive, negative sequences.
 */
export function computeSymmetricalComponents(Va, Vb, Vc) {
  // Convert inputs from polar to rectangular
  const va = fromPolar(Va.magnitude, Va.angleDeg);
  const vb = fromPolar(Vb.magnitude, Vb.angleDeg);
  const vc = fromPolar(Vc.magnitude, Vc.angleDeg);

  // Rotation operators: a = e^(j120°), a² = e^(j240°)
  const a  = fromPolar(1, 120);
  const a2 = fromPolar(1, 240);

  // Sequence components for phase A
  //   Va0 = (1/3)(Va + Vb + Vc)
  //   Va1 = (1/3)(Va + a·Vb + a²·Vc)
  //   Va2 = (1/3)(Va + a²·Vb + a·Vc)
  const Va0 = scale(add(va, add(vb, vc)), 1 / 3);
  const Va1 = scale(add(va, add(mul(a, vb), mul(a2, vc))), 1 / 3);
  const Va2 = scale(add(va, add(mul(a2, vb), mul(a, vc))), 1 / 3);

  // Derive B and C sequences
  const Vb0 = Va0;
  const Vb1 = mul(a2, Va1);
  const Vb2 = mul(a, Va2);

  const Vc0 = Va0;
  const Vc1 = mul(a, Va1);
  const Vc2 = mul(a2, Va2);

  return {
    inputs: {
      Va: toPolar(va),
      Vb: toPolar(vb),
      Vc: toPolar(vc),
    },
    zero: {
      Va0: toPolar(Va0),
      Vb0: toPolar(Vb0),
      Vc0: toPolar(Vc0),
    },
    positive: {
      Va1: toPolar(Va1),
      Vb1: toPolar(Vb1),
      Vc1: toPolar(Vc1),
    },
    negative: {
      Va2: toPolar(Va2),
      Vb2: toPolar(Vb2),
      Vc2: toPolar(Vc2),
    },
  };
}
