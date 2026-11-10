const packageJson = require("../package.json");

it("provides format-specific types for import and require entry points", () => {
  for (const entry of Object.keys(packageJson.exports)) {
    if (entry === "./package.json") continue;

    const conditions = packageJson.exports[entry];
    expect(conditions.import.types).toMatch(/\.d\.mts$/);
    expect(conditions.require.types).toMatch(/\.d\.cts$/);
  }

  expect(packageJson.files).toContain("**/*.d.mts");
  expect(packageJson.files).toContain("**/*.d.cts");
});
