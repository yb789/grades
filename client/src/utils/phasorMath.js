/**
 * Convert polar phasor to SVG coordinates.
 * SVG Y-axis is inverted (down = positive), so we negate Y.
 */
export function polarToSvg(magnitude, angleDeg, scale) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: magnitude * Math.cos(rad) * scale,
    y: -magnitude * Math.sin(rad) * scale,
  };
}

/**
 * Normalize an angle to [-180, 180] degrees.
 */
export function normalizeAngle(deg) {
  let a = ((deg % 360) + 360) % 360;
  return a > 180 ? a - 360 : a;
}

/**
 * Round a number to a given number of decimal places.
 */
export function round(value, decimals) {
  return Number(value.toFixed(decimals));
}
