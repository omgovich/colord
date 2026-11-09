// Writes each changeset summary as a plain bullet, without the commit hash the
// default generator prepends, so entries keep the existing CHANGELOG.md style:
// "- Fix: ... ❤️ [@user](https://github.com/user)"
export default {
  getReleaseLine: (changeset) => {
    const [firstLine, ...rest] = changeset.summary.trim().split("\n");
    return [`- ${firstLine}`, ...rest.map((line) => (line ? `  ${line}` : line))].join("\n");
  },
  getDependencyReleaseLine: () => "",
};
