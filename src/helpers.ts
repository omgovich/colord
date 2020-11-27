export const isPresent = (value: unknown): boolean => {
  if (typeof value === "string") return value.length > 0;
  if (typeof value === "number") return true;
  if (typeof value === "boolean") return true;
  return false;
};

export const round = (number: number, digits = 0, base = Math.pow(10, digits)): number => {
  return Math.round(base * number) / base;
};
