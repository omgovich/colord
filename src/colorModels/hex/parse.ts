import { RgbaColor } from "../../types";

const shorthandHexMatcher = /^#?[0-9A-F]{3}$/i;
const regularHexMatcher = /^#?[0-9A-F]{6}$/i;

export const parseHex = (hex: string): RgbaColor | null => {
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
