import { RgbaColor } from "../types";
import { hslaToRgba } from "../convert/hsla";
import { hsvaToRgba } from "../convert/hsva";

const shorthandHexMatcher = /^#?[0-9A-F]{3}$/i;
const regularHexMatcher = /^#?[0-9A-F]{6}$/i;
const rgbaMatcher = /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d+\.?\d*)?\)/i;
const hslaMatcher = /hsla?\((\d+\.?\d*),\s*(\d+\.?\d*)%?,\s*(\d+\.?\d*)%?,?\s*(\d+\.?\d*)?\)/i;
const hsvaMatcher = /hsva?\((\d+\.?\d*),\s*(\d+\.?\d*)%?,\s*(\d+\.?\d*)%?,?\s*(\d+\.?\d*)?\)/i;

const parseHex = (hex: string): RgbaColor | null => {
  if (hex[0] === "#") hex = hex.substr(1);

  if (shorthandHexMatcher.test(hex)) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
      a: 1,
    };
  }

  if (regularHexMatcher.test(hex)) {
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16),
      a: 1,
    };
  }

  return null;
};

const parseRgbaString = (input: string): RgbaColor | null => {
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

const parseHslaString = (input: string): RgbaColor | null => {
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

const parseHsvaString = (input: string): RgbaColor | null => {
  const match = hsvaMatcher.exec(input);

  return (
    match &&
    hsvaToRgba({
      h: Number(match[1]),
      s: Number(match[2]),
      v: Number(match[3]),
      a: match[4] === undefined ? 1 : Number(match[4]),
    })
  );
};

export const parseString = (s: string): RgbaColor | null => {
  return parseHex(s) || parseRgbaString(s) || parseHslaString(s) || parseHsvaString(s) || null;
};
