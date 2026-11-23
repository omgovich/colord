import { Colord } from "./colord";
import { parsers } from "./parse";
import { Parsers } from "./types";

export type Plugin = (ColordClass: typeof Colord, parsers: Parsers) => void;

const activePlugins: Plugin[] = [];

export const extend = (plugins: Plugin[]): void => {
  plugins.forEach((value: Plugin | { default: Plugin }) => {
    // Resolvers that map `require()` to the ES module build (like CodeSandbox's) hand over its namespace
    const plugin = typeof value === "function" ? value : value.default;
    if (activePlugins.indexOf(plugin) < 0) {
      plugin(Colord, parsers);
      activePlugins.push(plugin);
    }
  });
};
