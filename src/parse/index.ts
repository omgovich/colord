import { Input, InputObject, RgbaColor } from "../types";
import { parseObject } from "./parseObject";
import { parseString } from "./parseString";

export const parse = (input: Input): RgbaColor | null => {
  if (typeof input === "string") return parseString(input);
  if (typeof input === "object") return parseObject((input as unknown) as InputObject);
  return null;
};
