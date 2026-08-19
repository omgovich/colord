import { getDeltaE00 } from "../src/get/getPerceivedDifference";

/**
 * The supplementary test data from Sharma, Wu & Dalal, "The CIEDE2000
 * Color-Difference Formula: Implementation Notes, Supplementary Test Data and
 * Mathematical Observations" (Color Research & Application, 2005).
 *
 * The set is built to exercise the parts of the formula that are easy to get
 * wrong: the hue-difference wrap-around, the discontinuity at C' = 0, and the
 * blue-region rotation term. Pairs 17-20 are the only ones whose mean hue sits
 * near 275 degrees, so they are what pins down `R_C` / `R_T`.
 *
 * These assertions run against `getDeltaE00` rather than `colord().delta()` on
 * purpose. The public method cannot reproduce them: the inner state is RGB, so
 * CIE Lab input is rounded to the nearest displayable color before it reaches
 * the formula, and the result is then scaled and rounded to three decimals.
 *
 * [Reference data](http://www2.ece.rochester.edu/~gsharma/ciede2000/)
 */
const referencePairs: [[number, number, number], [number, number, number], number][] = [
  [[50.0, 2.6772, -79.7751], [50.0, 0.0, -82.7485], 2.0425],
  [[50.0, 3.1571, -77.2803], [50.0, 0.0, -82.7485], 2.8615],
  [[50.0, 2.8361, -74.02], [50.0, 0.0, -82.7485], 3.4412],
  [[50.0, -1.3802, -84.2814], [50.0, 0.0, -82.7485], 1.0],
  [[50.0, -1.1848, -84.8006], [50.0, 0.0, -82.7485], 1.0],
  [[50.0, -0.9009, -85.5211], [50.0, 0.0, -82.7485], 1.0],
  [[50.0, 0.0, 0.0], [50.0, -1.0, 2.0], 2.3669],
  [[50.0, -1.0, 2.0], [50.0, 0.0, 0.0], 2.3669],
  [[50.0, 2.49, -0.001], [50.0, -2.49, 0.0009], 7.1792],
  [[50.0, 2.49, -0.001], [50.0, -2.49, 0.001], 7.1792],
  [[50.0, 2.49, -0.001], [50.0, -2.49, 0.0011], 7.2195],
  [[50.0, 2.49, -0.001], [50.0, -2.49, 0.0012], 7.2195],
  [[50.0, -0.001, 2.49], [50.0, 0.0009, -2.49], 4.8045],
  [[50.0, -0.001, 2.49], [50.0, 0.001, -2.49], 4.8045],
  [[50.0, -0.001, 2.49], [50.0, 0.0011, -2.49], 4.7461],
  [[50.0, 2.5, 0.0], [50.0, 0.0, -2.5], 4.3065],
  [[50.0, 2.5, 0.0], [73.0, 25.0, -18.0], 27.1492],
  [[50.0, 2.5, 0.0], [61.0, -5.0, 29.0], 22.8977],
  [[50.0, 2.5, 0.0], [56.0, -27.0, -3.0], 31.903],
  [[50.0, 2.5, 0.0], [58.0, 24.0, 15.0], 19.4535],
  [[50.0, 2.5, 0.0], [50.0, 3.1736, 0.5854], 1.0],
  [[50.0, 2.5, 0.0], [50.0, 3.2972, 0.0], 1.0],
  [[50.0, 2.5, 0.0], [50.0, 1.8634, 0.5757], 1.0],
  [[50.0, 2.5, 0.0], [50.0, 3.2592, 0.335], 1.0],
  [[60.2574, -34.0099, 36.2677], [60.4626, -34.1751, 39.4387], 1.2644],
  [[63.0109, -31.0961, -5.8663], [62.8187, -29.7946, -4.0864], 1.263],
  [[61.2901, 3.7196, -5.3901], [61.4292, 2.248, -4.962], 1.8731],
  [[35.0831, -44.1164, 3.7933], [35.0232, -40.0716, 1.5901], 1.8645],
  [[22.7233, 20.0904, -46.694], [23.0331, 14.973, -42.5619], 2.0373],
  [[36.4612, 47.858, 18.3852], [36.2715, 50.5065, 21.2231], 1.4146],
  [[90.8027, -2.0831, 1.441], [91.1528, -1.6435, 0.0447], 1.4441],
  [[90.9257, -0.5406, -0.9208], [88.6381, -0.8985, -0.7239], 1.5381],
  [[6.7747, -0.2908, -2.4247], [5.8714, -0.0985, -2.2286], 0.6377],
  [[2.0776, 0.0795, -1.135], [0.9033, -0.0636, -0.5514], 0.9082],
];

it("Matches the CIEDE2000 reference data set", () => {
  for (const [[l1, a1, b1], [l2, a2, b2], expected] of referencePairs) {
    const deltaE = getDeltaE00(
      { l: l1, a: a1, b: b1, alpha: 1 },
      { l: l2, a: a2, b: b2, alpha: 1 }
    );
    expect(deltaE).toBeCloseTo(expected, 4);
  }
});

it("Is symmetric", () => {
  for (const [[l1, a1, b1], [l2, a2, b2]] of referencePairs) {
    const color1 = { l: l1, a: a1, b: b1, alpha: 1 };
    const color2 = { l: l2, a: a2, b: b2, alpha: 1 };
    expect(getDeltaE00(color1, color2)).toBeCloseTo(getDeltaE00(color2, color1), 10);
  }
});
