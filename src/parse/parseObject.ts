import { Colord, InputObject, RgbaColor } from "../types";
import { isPresent } from "../helpers";
import { hslaToRgba } from "../convert/hsla";
import { hsvaToRgba } from "../convert/hsva";

const parseColordObject = (object: InputObject): RgbaColor | null => {
  if (typeof object.toRgba === "function") return ((object as unknown) as Colord).toRgba();
  return null;
};

const parseRgbaObject = ({ r, g, b, a = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(r) || !isPresent(g) || !isPresent(b)) return null;

  return {
    r: Number(r),
    g: Number(g),
    b: Number(b),
    a: Number(a),
  };
};

const parseHslaObject = ({ h, s, l, a = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(h) || !isPresent(s) || !isPresent(l)) return null;

  return hslaToRgba({
    h: Number(h),
    s: Number(s),
    l: Number(l),
    a: Number(a),
  });
};

const parseHsvaObject = ({ h, s, v, a = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(h) || !isPresent(s) || !isPresent(v)) return null;

  return hsvaToRgba({
    h: Number(h),
    s: Number(s),
    v: Number(v),
    a: Number(a),
  });
};

export const parseObject = (o: InputObject): RgbaColor | null => {
  return (
    parseColordObject(o) || parseRgbaObject(o) || parseHslaObject(o) || parseHsvaObject(o) || null
  );
};
