import { RgbaColor } from "../../types";

const rgbaMatcher = /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d+\.?\d*)?\)/i;

export const parseRgbaString = (input: string): RgbaColor | null => {
  const match = rgbaMatcher.exec(input);

  return (
    match && {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
      a: match[4] === undefined ? 1 : Number(match[4]),
    }
  );
};
