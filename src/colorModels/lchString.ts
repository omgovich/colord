import { RgbaColor } from "../types";
import { clampLcha, rgbaToLcha, lchaToRgba, roundLcha } from "./lch";

const lchaMatcher = /lcha?\(?\s*(-?\d+\.?\d*)%?,?\s*(-?\d+\.?\d*),?\s*(-?\d+\.?\d*),?\s*\/?\s*(-?\d*\.?\d+)?\s*\)?/i;

export const parseLchaString = (input: string): RgbaColor | null => {
  const match = lchaMatcher.exec(input);

  if (!match) return null;

  const lcha = clampLcha({
    l: Number(match[1]),
    c: Number(match[2]),
    h: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  });

  return lchaToRgba(lcha);
};

export const rgbaToLchaString = (rgba: RgbaColor): string => {
  const { l, c, h, a } = roundLcha(rgbaToLcha(rgba));
  return a < 1 ? `lch(${l}% ${c} ${h} / ${a})` : `lch(${l}% ${c} ${h})`;
};
