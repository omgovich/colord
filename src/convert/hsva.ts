import { HsvaColor, RgbaColor } from "../types";
import { round } from "../helpers";

export const rgbaToHsva = ({ r, g, b, a }: RgbaColor): HsvaColor => {
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);

  // prettier-ignore
  const hh = delta
    ? max === r
      ? (g - b) / delta
      : max === g
        ? 2 + (b - r) / delta
        : 4 + (r - g) / delta
    : 0;

  return {
    h: round(60 * (hh < 0 ? hh + 6 : hh)),
    s: round(max ? (delta / max) * 100 : 0),
    v: round((max / 255) * 100),
    a,
  };
};

export const hsvaToRgba = ({ h, s, v, a }: HsvaColor): RgbaColor => {
  h = (h / 360) * 6;
  s = s / 100;
  v = v / 100;

  const hh = Math.floor(h),
    b = v * (1 - s),
    c = v * (1 - (h - hh) * s),
    d = v * (1 - (1 - h + hh) * s),
    module = hh % 6;

  return {
    r: round([v, c, b, b, d, v][module] * 255),
    g: round([d, v, v, c, b, b][module] * 255),
    b: round([b, b, d, v, v, c][module] * 255),
    a: round(a, 2),
  };
};
