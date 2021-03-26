import { RgbaColor } from "../../types";

const hexMatcher = /^\s*#?([0-9A-F]{3,4}){1,2}\s*$/i;

export const parseHex = (hex: string): RgbaColor | null => {
  if (!hexMatcher.test(hex)) return null;

  hex = hex.replace("#", "").trim();

  if (hex.length <= 4) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
      a: hex.length === 4 ? parseInt(hex[3] + hex[3], 16) / 255 : 1,
    };
  }

  return {
    r: parseInt(hex.substr(0, 2), 16),
    g: parseInt(hex.substr(2, 2), 16),
    b: parseInt(hex.substr(4, 2), 16),
    a: hex.length === 8 ? parseInt(hex.substr(6, 2), 16) / 255 : 1,
  };
};
