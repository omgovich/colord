import { RgbaColor } from "../../types";
import { hslaToRgba } from "../hsla/convert";

const hslaMatcher = /hsla?\((\d+\.?\d*),\s*(\d+\.?\d*)%?,\s*(\d+\.?\d*)%?,?\s*(\d+\.?\d*)?\)/i;

export const parseHslaString = (input: string): RgbaColor | null => {
  const match = hslaMatcher.exec(input);

  return (
    match &&
    hslaToRgba({
      h: Number(match[1]),
      s: Number(match[2]),
      l: Number(match[3]),
      a: match[4] === undefined ? 1 : Number(match[4]),
    })
  );
};
