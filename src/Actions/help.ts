import { ActionI, ActionMetaI } from "../CoAnMoPluginCli";

export const help: ActionI = {
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
      return `ERROR: 'help' expected 0 or 1 args, but got ${args.length}`;
    const actionNameLc = args[0].toLowerCase();
    const action = actions.find(actn => actn.name === actionNameLc);
    if (!action) return `No such action '${actionNameLc}'`;
    return `${action.name}  ${action.summary}`;
  }
};
