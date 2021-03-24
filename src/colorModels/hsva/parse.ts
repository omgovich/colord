import { InputObject, HsvaColor, RgbaColor } from "../../types";
import { clamp, isPresent } from "../../helpers";
import { hsvaToRgba } from "./convert";

export const clampHsva = ({ h, s, v, a }: HsvaColor): HsvaColor => ({
  h: clamp(h, 0, 360),
  s: clamp(s, 0, 100),
  v: clamp(v, 0, 100),
  a: clamp(a),
});

export const parseHsva = ({ h, s, v, a = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(h) || !isPresent(s) || !isPresent(v)) return null;

  const hsva = clampHsva({
    h: Number(h),
    s: Number(s),
    v: Number(v),
    a: Number(a),
  });

  return hsvaToRgba(hsva);
};
