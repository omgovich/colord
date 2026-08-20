import { RgbaColor } from "../types";
import { clamp, round } from "../helpers";
import { roundRgba } from "./rgb";

const hexMatcher = /^#([0-9a-f]{3,8})$/i;

/**
 * Reads the value of a single Hex digit from its char code.
 *
 * `parseInt` is the obvious tool, but it only takes a string, so every channel
 * costs a substring allocation plus a generic radix parse — together the bulk of
 * the time spent parsing a Hex color. ASCII makes the same value reachable with
 * two integer ops: the low nibble of "0"-"9" (0x30-0x39) is already the digit,
 * and "A"-"F" / "a"-"f" (0x41+ / 0x61+) are the only inputs with bit 6 set,
 * which is exactly the +9 that turns their low nibble into 10-15.
 */
const digitAt = (hex: string, index: number): number => {
  const code = hex.charCodeAt(index);
  return (code & 0xf) + 9 * (code >> 6);
};

/** Reads the two Hex digits starting at `index` as a single byte. */
const byteAt = (hex: string, index: number): number =>
  (digitAt(hex, index) << 4) | digitAt(hex, index + 1);

/** Parses any valid Hex3, Hex4, Hex6 or Hex8 string and converts it to an RGBA object */
export const parseHex = (hex: string): RgbaColor | null => {
  // `test` over `exec`: the capture group is never read (the digits are addressed
  // by index below), and skipping it saves allocating a match object per call.
  if (!hexMatcher.test(hex)) return null;

  const { length } = hex;

  // Hex3 and Hex4 (leading "#" included in the length): every digit stands for
  // a whole byte, which is that digit in both nibbles — hence the 0x11 factor.
  if (length <= 5) {
    return {
      r: digitAt(hex, 1) * 0x11,
      g: digitAt(hex, 2) * 0x11,
      b: digitAt(hex, 3) * 0x11,
      a: length === 5 ? round((digitAt(hex, 4) * 0x11) / 255, 2) : 1,
    };
  }

  if (length === 7 || length === 9) {
    return {
      r: byteAt(hex, 1),
      g: byteAt(hex, 3),
      b: byteAt(hex, 5),
      a: length === 9 ? round(byteAt(hex, 7) / 255, 2) : 1,
    };
  }

  // The matcher also admits 5 and 7 digits, which no Hex notation uses
  return null;
};

/**
 * Every byte a channel can hold, as a padded hexadecimal string.
 *
 * `Number#toString(16)` runs a generic radix conversion and then needs a length
 * check to pad "0"-"f" back to two digits. There are only 256 possible answers,
 * so precomputing them is both faster and shorter at the call site.
 */
const hexBytes: string[] = [];
for (let byte = 0; byte < 256; byte++) {
  hexBytes.push((byte < 16 ? "0" : "") + byte.toString(16));
}

/** Formats an already rounded channel value (e.g. 128) as a hexadecimal byte (e.g. "80") */
const format = (byte: number): string => hexBytes[clamp(byte, 0, 255)];

/** Converts RGBA object to Hex6 or (if it has alpha channel) Hex8 string */
export const rgbaToHex = (rgba: RgbaColor): string => {
  const { r, g, b, a } = roundRgba(rgba);
  const alphaHex = a < 1 ? format(round(a * 255)) : "";
  return "#" + format(r) + format(g) + format(b) + alphaHex;
};
