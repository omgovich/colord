import { ANGLE_UNITS } from "./constants";

export const isPresent = (value: unknown): boolean => {
  if (typeof value === "string") return value.length > 0;
  if (typeof value === "number") return true;
  return false;
};

export const round = (number: number, digits = 0, base = Math.pow(10, digits)): number => {
  return Math.round(base * number) / base + 0;
};

export const floor = (number: number, digits = 0, base = Math.pow(10, digits)): number => {
  return Math.floor(base * number) / base + 0;
};

/**
 * Clamps a value between an upper and lower bound.
 * We use ternary operators because it makes the minified code
 * is 2 times shorter then `Math.min(Math.max(a,b),c)`
 * NaN is clamped to the lower bound
 */
export const clamp = (number: number, min = 0, max = 1): number => {
  return number > max ? max : number > min ? number : min;
};

/**
 * Processes and clamps a degree (angle) value properly.
 * Any `NaN` or `Infinity` will be converted to `0`.
 * Examples: -1 => 359, 361 => 1, 360 => 0
 *
 * Deliberately not the canonical `((degrees % 360) + 360) % 360`: that form
 * loses precision for values already in range (`0.4` comes back as
 * `0.39999999999997726`), and the result reaches the `*ToRgba` conversions
 * unrounded.
 */
export const clampHue = (degrees: number): number => {
  degrees = isFinite(degrees) ? degrees % 360 : 0;
  return degrees < 0 ? degrees + 360 : degrees;
};

/**
 * Rounds a hue and keeps it inside [0, 360).
 * Rounding alone can produce exactly 360 (a raw hue of 359.6 rounds up), which
 * every consumer then has to special-case, so the wrap belongs here.
 * Examples: 359.6 => 0, 12.4 => 12
 */
export const roundHue = (degrees: number, digits = 0): number => {
  return round(degrees, digits) % 360;
};

/**
 * Converts a hue value to degrees from 0 to 360 inclusive.
 */
export const parseHue = (value: string, unit = "deg"): number => {
  return Number(value) * (ANGLE_UNITS[unit] || 1);
};
