import { Colord } from "./colord";

export const random = (): Colord => {
  return new Colord({
    r: Math.random() * 255,
    g: Math.random() * 255,
    b: Math.random() * 255,
  });
};

export const randomFromSeed = (seed: string): Colord => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  return new Colord({
    r: hash & 0xff,
    g: (hash >> 8) & 0xff,
    b: (hash >> 16) & 0xff,
  });
};
