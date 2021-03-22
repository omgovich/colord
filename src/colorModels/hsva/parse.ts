import { InputObject, RgbaColor } from "../../types";
import { isPresent } from "../../helpers";
import { hsvaToRgba } from "./convert";

export const parseHsva = ({ h, s, v, a = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(h) || !isPresent(s) || !isPresent(v)) return null;

  return hsvaToRgba({
    h: Number(h),
    s: Number(s),
    v: Number(v),
    a: Number(a),
  });
};
