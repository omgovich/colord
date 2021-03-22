export const isPresent = (value: unknown): boolean => {
  if (typeof value === "string") return value.length > 0;
  if (typeof value === "number") return true;
  return false;
};

export const round = (number: number, digits = 0, base = Math.pow(10, digits)): number => {
  return Math.round(base * number) / base;
};

/**
 * Clamps a value between an upper and lower bound.
 * We use ternary operators because it makes the minified code
 * 2 times shorter then `Math.min(Math.max(a,b),c)`
 */
export const clamp = (number: number, min = 0, max = 1): number => {
  return number > max ? max : number < min ? min : number;
};
