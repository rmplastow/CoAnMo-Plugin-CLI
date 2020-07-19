import { ActionI, ActionContextI } from "../CoAnMoPluginCli";

export const clear: ActionI = {
  name: "clear",
  summary: "Deletes the stdout log",
  synopsis: `Deletes everything in the on-screen stdout panel.
Does not delete history, or remotely stored logs.`,
  fn(args: string[], context: ActionContextI) {
    const { $stdout } = context;
    if (args.length !== 0)
      return `ERROR: 'clear' expected 0 args, but got ${args.length}`;
    if ($stdout) $stdout.innerHTML = "";
    return "";
  }
};
