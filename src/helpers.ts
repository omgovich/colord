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
 * Examples: -1 => 359, 361 => 1
 */
export const clampHue = (degrees: number): number => {
  degrees = isFinite(degrees) ? degrees % 360 : 0;
  return degrees > 0 ? degrees : degrees + 360;
};

/**
 * Converts a hue value to degrees from 0 to 360 inclusive.
 */
export const parseHue = (value: string, unit = "deg"): number => {
  return Number(value) * (ANGLE_UNITS[unit] || 1);
};
