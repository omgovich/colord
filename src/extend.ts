import { Colord } from "./colord";
import { parsers } from "./parse";
import { Parsers } from "./types";

export type Plugin = (ColordClass: typeof Colord, parsers: Parsers) => void;

export const extend = (plugin: Plugin): void => {
  plugin(Colord, parsers);
};
