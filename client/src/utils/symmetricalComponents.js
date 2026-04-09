// Complex number arithmetic — { re, im }
function add(a, b) { return { re: a.re + b.re, im: a.im + b.im }; }
function mul(a, b) { return { re: a.re*b.re - a.im*b.im, im: a.re*b.im + a.im*b.re }; }
function scale(c, s) { return { re: c.re * s, im: c.im * s }; }
function fromPolar(mag, deg) {
  const r = (deg * Math.PI) / 180;
  return { re: mag * Math.cos(r), im: mag * Math.sin(r) };
}
function toPolar(c) {
  const mag = Math.sqrt(c.re * c.re + c.im * c.im);
  if (mag < 1e-10) return { magnitude: 0, angleDeg: 0 };
  return { magnitude: mag, angleDeg: (Math.atan2(c.im, c.re) * 180) / Math.PI };
}

export function computeSymmetricalComponents(Va, Vb, Vc) {
  const va = fromPolar(Va.magnitude, Va.angleDeg);
  const vb = fromPolar(Vb.magnitude, Vb.angleDeg);
  const vc = fromPolar(Vc.magnitude, Vc.angleDeg);

  const a  = fromPolar(1, 120);
  const a2 = fromPolar(1, 240);

  const Va0 = scale(add(va, add(vb, vc)), 1 / 3);
  const Va1 = scale(add(va, add(mul(a, vb), mul(a2, vc))), 1 / 3);
  const Va2 = scale(add(va, add(mul(a2, vb), mul(a, vc))), 1 / 3);

  return {
    inputs: { Va: toPolar(va), Vb: toPolar(vb), Vc: toPolar(vc) },
    zero:     { Va0: toPolar(Va0), Vb0: toPolar(Va0), Vc0: toPolar(Va0) },
    positive: { Va1: toPolar(Va1), Vb1: toPolar(mul(a2, Va1)), Vc1: toPolar(mul(a, Va1)) },
    negative: { Va2: toPolar(Va2), Vb2: toPolar(mul(a, Va2)),  Vc2: toPolar(mul(a2, Va2)) },
  };
}
