import { HslaColor, InputObject, RgbaColor } from "../../types";
import { clamp, isPresent } from "../../helpers";
import { hslaToRgba } from "./convert";

export const clampHsla = ({ h, s, l, a }: HslaColor): HslaColor => ({
  h: clamp(h, 0, 360),
  s: clamp(s, 0, 100),
  l: clamp(l, 0, 100),
  a: clamp(a),
});

export const parseHsla = ({ h, s, l, a = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(h) || !isPresent(s) || !isPresent(l)) return null;

  const hsla = clampHsla({
    h: Number(h),
    s: Number(s),
    l: Number(l),
    a: Number(a),
  });

  return hslaToRgba(hsla);
};
