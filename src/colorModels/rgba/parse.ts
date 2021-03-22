import { InputObject, RgbaColor } from "../../types";
import { isPresent } from "../../helpers";

export const parseRgbaObject = ({ r, g, b, a = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(r) || !isPresent(g) || !isPresent(b)) return null;

  return {
    r: Number(r),
    g: Number(g),
    b: Number(b),
    a: Number(a),
  };
};
