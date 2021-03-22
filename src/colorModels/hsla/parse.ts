import { InputObject, RgbaColor } from "../../types";
import { isPresent } from "../../helpers";
import { hslaToRgba } from "./convert";

export const parseHsla = ({ h, s, l, a = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(h) || !isPresent(s) || !isPresent(l)) return null;

  return hslaToRgba({
    h: Number(h),
    s: Number(s),
    l: Number(l),
    a: Number(a),
  });
};
