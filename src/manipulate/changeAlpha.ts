import { RgbaColor } from "../types";

export const changeAlpha = ({ r, g, b }: RgbaColor, a: number): RgbaColor => ({ r, g, b, a });
