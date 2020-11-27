import { RgbaColor } from "../types";

const format = (number: number) => {
  const hex = number.toString(16);
  return hex.length < 2 ? "0" + hex : hex;
};

export const rgbaToHex = ({ r, g, b }: RgbaColor): string => {
  return "#" + format(r) + format(g) + format(b);
};
