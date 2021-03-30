import { Colord } from "./colord";
import { parsers } from "./parse";
import { Parsers } from "./types";

export type Plugin = (ColordClass: typeof Colord, parsers: Parsers) => void;

const activatePlugins: Plugin[] = [];

export const extend = (plugins: Plugin[]): void => {
  plugins.forEach((plugin) => {
    if (activatePlugins.indexOf(plugin) < 0) {
      plugin(Colord, parsers);
      activatePlugins.push(plugin);
    }
  });
};
