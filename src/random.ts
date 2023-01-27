import { Colord } from "./colord";

export const random = (old?: Colord): Colord => {
  const { r, g, b , a } = old?.toRgb() ?? { r: 255, g: 255, b: 255 , a: 1 };
  return new Colord({
    r: r * 255,
    g: g * 255,
    b: b * 255,
    a,
  });
};
