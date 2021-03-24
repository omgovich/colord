import { InputObject, RgbaColor } from "../../types";
import { clamp, isPresent } from "../../helpers";

export const clampRgba = ({ r, g, b, a }: RgbaColor): RgbaColor => ({
  r: clamp(r, 0, 255),
  g: clamp(g, 0, 255),
  b: clamp(b, 0, 255),
  a: clamp(a),
});

export const parseRgba = ({ r, g, b, a = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(r) || !isPresent(g) || !isPresent(b)) return null;

  return clampRgba({
    r: Number(r),
    g: Number(g),
    b: Number(b),
    a: Number(a),
  });
};
