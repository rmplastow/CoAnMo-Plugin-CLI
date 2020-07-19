import { ActionI, ActionContextI } from "../CoAnMoPluginCli";

export function renderNameAndSummary(action:ActionI, length:number) {
  return `${`${action.name} `.padEnd(length - 1 - action.summary.length, ".")} ${action.summary}`
}

export const help: ActionI = {
  name: "help",
  summary: "Shows information about actions",
  synopsis: `For a list of available actions:
  > help
To show an action’s synopsis:
  > help &lt;action>`,
  fn(args: string[], context: ActionContextI) {
    const { actions } = context;
    if (args.length === 0)
      return [
        ...actions
          .sort((a: ActionI, b: ActionI) => a.name > b.name ? 1 : -1)
          .map((action: ActionI) => renderNameAndSummary(action, 40)),
        `Use \`help &lt;action>\` to show an action’s synopsis, eg \`help ${
          actions[actions.length-1].name}\``
      ].join("\n");
    if (args.length !== 1)
      return `ERROR: 'help' expected 0 or 1 args, but got ${args.length}`;
    const actionNameLc = args[0].toLowerCase();
    const action = actions.find(actn => actn.name === actionNameLc);
    if (!action) return `ERROR: No such action '${actionNameLc}'`;
    return action.synopsis;
  }
};
