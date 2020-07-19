import { ActionI, ActionMetaI, CoAnMoPluginCli } from "./CoAnMoPluginCli";

const cli = new CoAnMoPluginCli(
  "CoAnMoPluginCli",
  "1.0.11",
  ".CoAnMoPluginCli.stdin",
  ".CoAnMoPluginCli.stdout",
  document
);

cli.addActions([
  {
    name: "help",
    summary: "Shows a help message",
    fn(args: string[], meta: ActionMetaI) {
      const { actions, name, version } = meta;
      const longest = actions.reduce(
        (longest = 0, action: ActionI) => Math.max(longest, action.name.length),
        0
      );
      if (args.length === 0)
        return [
          `${name} ${version} Actions:`,
          ...actions.map(
            (action: ActionI) =>
              `${action.name.padEnd(longest + 2, " ")}${action.summary}`
          )
        ].join("\n");
      if (args.length !== 1)
        return `'help' got ${args.length} args, expected 0 or 1 ${args.join()}`;
      const actionNameLc = args[0].toLowerCase();
      const action = actions.find(actn => actn.name === actionNameLc);
      if (!action) return `No such action '${actionNameLc}'`;
      return `${action.name}  ${action.summary}`;
    }
  },
  {
    name: "version",
    summary: "Shows the CoAnMo’s version",
    fn(args: string[], meta: ActionMetaI) {
      const { name, version } = meta;
      return `${name} ${version}`;
    }
  }
]);

cli.focusOnInput();
