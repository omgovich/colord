import colord from "../src/";

it("Parses string and converts it to HEX", () => {
  expect(colord("#FFF").toHex()).toBe("#ffffff");
  expect(colord("rgba(50, 100, 200)").toHex()).toBe("#3264c8");
  expect(colord("hsl(20, 40%, 60%)").toHex()).toBe("#c28b70");
  expect(colord("hsv(50, 100%, 100%)").toHex()).toBe("#ffd500");
});
