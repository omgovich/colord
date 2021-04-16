import { Colord } from "./colord";
import { parsers } from "./parse";
import { Parsers } from "./types";

export type Plugin = (ColordClass: typeof Colord, parsers: Parsers) => void;

const activePlugins: Plugin[] = [];

export const extend = (plugins: Plugin[]): void => {
  plugins.forEach((plugin) => {
    if (activePlugins.indexOf(plugin) < 0) {
      plugin(Colord, parsers);
      activePlugins.push(plugin);
    }
  });
};
